import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";

const Appbar = () => {
  return (
    <div className="border-b flex justify-between px-10 py-4 cursor-pointer">
      <Link to={"/blogs"} className="flex justify-center flex-col font-extrabold text-green-500 text-2xl">
        EchoScribe
      </Link>
      <div>
        <Avatar name="Shaikh Aman" size={"big"} />
      </div>
    </div>
  );
};

export default Appbar;
