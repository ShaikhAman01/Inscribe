const Quote = () => {
  return (
    <div className="relative bg-stone-100 h-screen flex flex-col justify-center items-center p-12 lg:p-24">
      <figure className="max-w-xl">
        <blockquote className="text-3xl lg:text-4xl font-black text-stone-900 leading-tight">
          <p>"The ability to simplify means to eliminate the unnecessary so that the necessary may speak."</p>
        </blockquote>

        <figcaption className="mt-8 flex items-center gap-4">
          <div className="w-12 h-[2px] bg-stone-900" aria-hidden="true"></div>
          <div>
            <div className="text-xl font-bold text-stone-900">Hans Hofmann</div>
            <div className="text-sm font-black uppercase tracking-widest text-stone-600 mt-1">
              Artist &amp; Educator
            </div>
          </div>
        </figcaption>

        <p className="mt-12 text-base text-stone-600 leading-relaxed">
          Inscribe is built on the same idea: a quiet page, so your words can do the work.
        </p>
      </figure>

      <div
        className="absolute bottom-10 text-stone-300 font-black tracking-tighter text-6xl opacity-20 pointer-events-none"
        aria-hidden="true"
      >
        INSCRIBE
      </div>
    </div>
  );
};

export default Quote;
