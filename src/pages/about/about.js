import template from "./about.html?raw";

export default function AboutPage() {
  return template;
}

export function init() {
  console.log("about page loaded");
}

export function cleanup() {
  console.log("about page cleaned");
}
