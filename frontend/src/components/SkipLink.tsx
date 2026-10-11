const SkipLink = () => (
  <a
    href="#main"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("main")?.focus();
    }}
    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
  >
    Skip to content
  </a>
);

export default SkipLink;
