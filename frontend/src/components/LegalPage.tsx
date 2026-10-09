import Appbar from "./Appbar";
import SiteFooter from "./SiteFooter";
import { usePageTitle } from "../hooks/usePageTitle";

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  children: React.ReactNode;
}

const LegalPage = ({ title, updated, intro, children }: LegalPageProps) => {
  usePageTitle(title);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Appbar />
      <main className="flex-grow px-5 pt-12 sm:pt-16">
        <article className="max-w-2xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-widest text-stone-500">Last updated {updated}</p>
          <h1 className="mt-3 text-4xl font-black text-stone-900 tracking-tight">{title}</h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">{intro}</p>
          <div className="mt-10 space-y-10 text-stone-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-stone-900 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_p+p]:mt-3 [&_ul+p]:mt-3 [&_p+ul]:mt-3 [&_a]:font-semibold [&_a]:text-stone-900 [&_a]:underline [&_a]:underline-offset-2">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
};

export default LegalPage;
