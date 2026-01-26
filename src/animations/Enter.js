import { wrap_chars } from "../helpers/wrap";
import { gsap, SplitText } from "../lib";

const ENTER = (nextContainer, delay = 0) => {
  const t = nextContainer?.querySelector("h1") || document.querySelector("h1");
  const img = nextContainer?.querySelector(".img_hero") || document.querySelector(".img_hero");
  const lines = nextContainer?.querySelectorAll(".inner_linesright") || document.querySelectorAll(".inner_linesright");
  const ps = nextContainer?.querySelectorAll(".anim_p") || document.querySelectorAll(".anim_p");
  const lines2 = nextContainer?.querySelectorAll(".inner_linesleft") || document.querySelectorAll(".inner_linesleft");
  if (!t) return null;

  gsap.set(t, { opacity: 1 });

  const s = new SplitText(t, { type: "chars" });
  const p = new SplitText(ps, { type: "lines" });

  wrap_chars(s, true);

  if (img) gsap.set(img, { y: "180%", force3D: true, willChange: "transform" });
  if (ps.length) gsap.set(ps, { opacity: 0 });
  // if (lines.length) gsap.set(lines, { x: "-100%", force3D: true });

  const tl = gsap.timeline({ 
    defaults: { force3D: true },
    delay 
  });

  tl.to(s.chars, {
    rotateX: 0,
    y: 0,
    duration: 1.9,
    stagger: 0.032,
    ease: "expo.out",
  }, 0);

  if (img) {
    tl.to(img, {
      y: 0,
      duration: 1.9,
      ease: "expo.out",
    }, 0);
  }

  if (ps.length) {
    tl.to(ps, {
      opacity: 1,
      duration: 0.7,
     
      ease: "none",
   }, 0.9);
  }

  if (lines.length) {
    tl.to(lines, {
      x: 0,
   duration: 1.7,
        stagger: {
          amount:0.3,
        from:"end",
      },
      ease: "expo.out",
    }, 0);
    
  }

   if (lines2.length) {
    tl.to(lines2, {
      x: 0,
      duration: 1.7,
      stagger: {
           amount:0.3,
        from:"end",
      },
      ease: "expo.out",
    }, 0);
    
  }

  return { timeline: tl, splitInstance: s };
};

export default ENTER;