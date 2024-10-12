import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";

const Appbar = () => {
  const name = localStorage.getItem("name") as string;;
  return (
    <div className="border-b flex justify-between px-10 py-2 cursor-pointer">
      <Link
        to={"/blogs"}
        className="flex justify-center flex-col font-extrabold font-raleway text-blue-900 text-4xl "
      >
        Inkspire
      </Link>
      <div className="flex justify-center items-center">
        <Link
          to={"/publish"}
          className="mr-5 flex items-center hover:text-blue-700 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
          <span className="ml-1">Write</span>
        </Link>
        <div>
          <Avatar name={name} size={"big"} />
        </div>
      </div>
    </div>
  );
};

export default Appbar;
