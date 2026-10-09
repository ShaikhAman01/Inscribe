import { Link } from "react-router-dom";
import { Feather, Heart } from "lucide-react";
import { AUTHOR_URL, BUG_REPORT_URL, CONTACT_EMAIL, FEATURE_REQUEST_URL, REPO_URL } from "../lib/links";

const linkClass =
  "rounded hover:text-stone-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900";

const Column = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">{title}</h2>
    <ul className="space-y-2.5 text-sm font-medium">{children}</ul>
  </div>
);

const External = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
      {children}
    </a>
  </li>
);

const SiteFooter = () => (
  <footer className="mt-28 border-t border-stone-200/60 bg-stone-50/50 pt-16 pb-12 text-stone-600">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-12 gap-10 pb-12">
        <div className="col-span-2 md:col-span-4 flex flex-col items-start space-y-4">
          <Link to="/" className={`flex items-center text-2xl font-black text-stone-900 tracking-tight ${linkClass}`}>
            <Feather className="h-6 w-6 mr-2.5" aria-hidden="true" />
            Inscribe
          </Link>
          <p className="text-sm text-stone-600 max-w-xs leading-relaxed">
            A calm place to write and read stories. Open source, ad free, and built by one developer.
          </p>
        </div>

        <div className="md:col-span-2 md:col-start-6">
          <Column title="Read & write">
            <li>
              <Link to="/blogs" className={linkClass}>Explore stories</Link>
            </li>
            <li>
              <Link to="/publish" className={linkClass}>Write a story</Link>
            </li>
          </Column>
        </div>

        <div className="md:col-span-2">
          <Column title="Project">
            <External href={REPO_URL}>Source on GitHub</External>
            <External href={BUG_REPORT_URL}>Report a bug</External>
            <External href={FEATURE_REQUEST_URL}>Suggest a feature</External>
          </Column>
        </div>

        <div className="md:col-span-2">
          <Column title="Legal">
            <li>
              <Link to="/privacy" className={linkClass}>Privacy</Link>
            </li>
            <li>
              <Link to="/terms" className={linkClass}>Terms</Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>Contact</a>
            </li>
          </Column>
        </div>
      </div>

      <div className="border-t border-stone-200/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-stone-500">
          &copy; {new Date().getFullYear()} Inscribe. Code released under the MIT License.
        </p>
        <p className="text-xs font-semibold text-stone-500 flex items-center gap-1 bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/40">
          Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" aria-label="love" /> by{" "}
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noreferrer"
            className="text-stone-700 underline decoration-stone-300 hover:text-stone-900 transition-colors"
          >
            Aman
          </a>
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
