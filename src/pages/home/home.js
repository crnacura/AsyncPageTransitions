import template from "./home.html?raw";

export default function HomePage() {
  return template;
}

export function init() {
  console.log("Home page loaded");
}

export function cleanup() {
  console.log("Home page cleaned");
}
