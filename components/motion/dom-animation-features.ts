// Async feature bundle for <LazyMotion>. Kept in its own module so the bundler
// can code-split framer-motion's DOM-animation features into a separate chunk
// that only downloads the first time an animated `m.*` component actually
// mounts — never on the home page's critical hydration path.
export { domAnimation as default } from "framer-motion";
