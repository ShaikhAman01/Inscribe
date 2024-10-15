
const BlogPostSkeleton = () => {
  return (
    <div className="grid grid-cols-12 xl:px-40 lg:px-20 px-5 w-full pt-10 animate-pulse">
      <div className="col-span-12 lg:col-span-8">
        {/* Title skeleton */}
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-3"></div>

        {/* Posted date skeleton */}
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>

        {/* Content paragraphs skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 pl-4 mt-8 lg:mt-0">
        {/* Author section skeleton */}
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="flex items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
          <div className="ml-4 space-y-2 flex-grow">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;