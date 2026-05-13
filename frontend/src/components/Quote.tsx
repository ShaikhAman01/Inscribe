const Quote = () => {
  return (
    <div className="bg-stone-100 h-screen flex flex-col justify-center items-center p-12 lg:p-24">
      <div className="max-w-xl">
        <div className="text-3xl lg:text-4xl font-black text-stone-900 leading-tight">
          "The ability to simplify means to eliminate the unnecessary so that the necessary may speak. Inscribe provides the silence required for true clarity."
        </div>
        
        <div className="mt-8 flex items-center gap-4">
          <div className="w-12 h-[2px] bg-stone-900"></div>
          <div>
            <div className="text-xl font-bold text-stone-900">
              Hans Hofmann
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-stone-500 mt-1">
              Artist & Educator
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 text-stone-300 font-black tracking-tighter text-6xl opacity-20 pointer-events-none">
        INSCRIBE
      </div>
    </div>
  );
};

export default Quote;