const Quote = () => {
  return (
    <div className="bg-slate-100 h-screen flex flex-col justify-center items-start p-16">
      <div className="max-w-3xl text-3xl font-bold text-left">
        "The Customer support I received was exceptional. The support team went
        above and beyond to address my concerns."
      </div>
      <div className="max-w-md text-2xl font-medium text-left pt-5 items">
        Julius Winfield
      </div>
      <div className="max-w-md text-lg font-normal  text-left text-slate-500 ">
        CEO, Acme Inc
      </div>
    </div>
  );
};

export default Quote;
