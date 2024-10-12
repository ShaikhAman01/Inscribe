const BlogSkeleton = () => {
    return (
      <div className="border-b border-slate-200 pb-4 p-4 w-screen max-w-screen-md animate-pulse">
        <div className="flex">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex justify-center flex-col pl-2">
            <div className="bg-gray-300 h-4 w-1/2 rounded mb-2"></div>
            <div className="bg-gray-300 h-3 w-1/3 rounded"></div>
          </div>
        </div>
        <div className="bg-gray-300 h-6 w-full rounded mt-2"></div>
        <div className="bg-gray-300 h-4 w-full rounded mt-2"></div>
        <div className="bg-gray-300 h-3 w-1/4 rounded mt-4"></div>
      </div>
    );
  };
  
  export default BlogSkeleton;
  