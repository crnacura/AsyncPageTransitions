import { gsap } from "../lib/index.js";
const routes = {
  "/": {
    namespace: "home",
    loader: () => import("../pages/home/home.js"),
  },
  "/about": {
    namespace: "about",
    loader: () => import("../pages/about/about.js"),
  },
};

class Router {
  constructor() {
    this.currentPage = null;
    this.currentNamespace = null;
    this.isTransitioning = false;
    this.abortController = null;
  }

  init() {
    this.loadInitialPage();

    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");

      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();

        if (this.isTransitioning) return;

        const path = new URL(link.href).pathname;
        this.navigate(path);
      }
    });

    window.addEventListener("popstate", () => {
      const path = window.location.pathname;
      if (this.isTransitioning) {
        this.abortTransition();
        this.loadPageInstantly(path);
      } else {
        this.handlePopstate(path);
      }
    });
  }

  async loadInitialPage() {
    const path = window.location.pathname;
    const route = routes[path] || routes["/"];

    const pageModule = await route.loader();
    const content = document.getElementById("page_content");
    content.innerHTML = pageModule.default();

    const container = document.querySelector('[data-transition="container"]');
    container.setAttribute("data-namespace", route.namespace);

    if (pageModule.init) {
      pageModule.init();
    }

    this.currentPage = pageModule;
    this.currentNamespace = route.namespace;
  }

  async navigate(path) {
    if (this.isTransitioning) return;

    const currentPath = window.location.pathname;
    if (currentPath === path) return;

    window.history.pushState({}, "", path);
    await this.performTransition(path);
  }

  async handlePopstate(path) {
    await this.performTransition(path);
  }
  rs;
  abortTransition() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    import("../transitions/pageTransition.js").then(
      ({ killActiveTimeline }) => {
        killActiveTimeline();
      },
    );

    this.isTransitioning = false;
  }

  async loadPageInstantly(path) {
    const route = routes[path] || routes["/"];
    if (!route) return;

    if (this.currentPage?.cleanup) {
      this.currentPage.cleanup();
    }

    const pageModule = await route.loader();

    const wrapper = document.querySelector('[data-transition="wrapper"]');
    const allContainers = wrapper.querySelectorAll(
      '[data-transition="container"]',
    );

    allContainers.forEach((container, index) => {
      if (index > 0) {
        container.remove();
      }
    });

    const container = wrapper.querySelector('[data-transition="container"]');

    gsap.killTweensOf(container);
    gsap.set(container, { clearProps: "all" });

    const content = container.querySelector("#page_content");
    if (content) {
      content.innerHTML = pageModule.default();
    } else {
      container.innerHTML = `<main id="page_content" class="page_content">${pageModule.default()}</main>`;
    }

    container.setAttribute("data-namespace", route.namespace);

    if (pageModule.init) {
      pageModule.init();
    }

    this.currentPage = pageModule;
    this.currentNamespace = route.namespace;

    window.dispatchEvent(
      new CustomEvent("route-changed", {
        detail: { path, namespace: route.namespace },
      }),
    );

    window.scrollTo(0, 0);
  }

  async performTransition(path) {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.abortController = new AbortController();

    try {
      const route = routes[path] || routes["/"];

      if (!route || this.currentNamespace === route.namespace) return;

      if (this.currentPage?.cleanup) {
        this.currentPage.cleanup();
      }

      const pageModule = await route.loader();

      const { executeTransition } =
        await import("../transitions/pageTransition.js");

      await executeTransition({
        currentNamespace: this.currentNamespace,
        nextNamespace: route.namespace,
        nextHTML: pageModule.default(),
        nextModule: pageModule,
        signal: this.abortController.signal,
      });

      this.currentPage = pageModule;
      this.currentNamespace = route.namespace;

      window.dispatchEvent(
        new CustomEvent("route-changed", {
          detail: { path, namespace: route.namespace },
        }),
      );
    } finally {
      this.isTransitioning = false;
      this.abortController = null;
    }
  }
}

export const router = new Router();
