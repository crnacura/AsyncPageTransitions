import { gsap } from "../lib/index";

export function wrap_lines(el) {
  el.lines.forEach((line) => {
    const wrapper = document.createElement("div");
    wrapper.style.overflow = "hidden";
    wrapper.style.lineHeight = "100%";
    wrapper.style.transform = "translateZ(0)";
    wrapper.style.backfaceVisibility = "hidden";
    wrapper.style.marginBottom = "0.1rem";
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  gsap.set(el.lines, {
    y: "100%",
    z: 0,
    force3D: true,
    willChange: "transform",
  });
}

export function wrap_chars(el, z) {
  el.chars.forEach((char, index) => {
    const wrapper = document.createElement("span");
    wrapper.style.overflow = "hidden";
    wrapper.style.transform = "translateZ(0)";
    wrapper.style.backfaceVisibility = "hidden";
    wrapper.style.display = "inline-block";
    wrapper.style.backfaceVisibility = "hidden";
    wrapper.style.perspective = "1000px";
    char.parentNode.insertBefore(wrapper, char);
    wrapper.appendChild(char);
  });
  if (z) {
    gsap.set(el.chars, {
      y: "70%",
      force3D: true,
      rotateX: 90,
      willChange: "transform",
    });
  } else {
    gsap.set(el.chars, {
      y: "100%",
      force3D: true,
      willChange: "transform",
    });
  }
}

export default { wrap_lines, wrap_chars };
