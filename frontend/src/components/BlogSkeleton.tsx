const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 sm:p-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-stone-200 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-2">
          <div className="bg-stone-200 h-3.5 w-28 rounded"></div>
          <div className="bg-stone-100 h-3 w-20 rounded"></div>
        </div>
      </div>
      <div className="bg-stone-200 h-6 w-3/4 rounded mt-4"></div>
      <div className="space-y-2 mt-3">
        <div className="bg-stone-100 h-4 w-full rounded"></div>
        <div className="bg-stone-100 h-4 w-11/12 rounded"></div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="bg-stone-100 h-6 w-16 rounded-full"></div>
        <div className="bg-stone-100 h-6 w-20 rounded-full"></div>
      </div>
      <div className="bg-stone-100 h-3 w-24 rounded mt-4"></div>
    </div>
  );
};

export default BlogSkeleton;
