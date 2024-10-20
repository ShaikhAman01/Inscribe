import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { ToastContainer, useToast } from "./Toast";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useState } from "react";

interface AppbarProps {
  onSearch: (query: string) => void;
}

const Appbar: React.FC<AppbarProps> = ({ onSearch }) => {
  const { showToast } = useToast();
  const name = localStorage.getItem("name") as string;
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    setIsModalVisible(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    showToast("Signed out successfully", "success");

    setIsModalVisible(false);

    setTimeout(() => {
      navigate("/signin");
    }, 1000);
  };

  const cancalLogout = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="border-b flex justify-between items-center px-10 py-3 h-16">
      <div className="flex items-center space-x-6">
        <Link
          to={"/blogs"}
          className=" font-extrabold font-raleway text-blue-900 text-4xl "
        >
          Inkscribe
        </Link>
        <div className="flex-grow max-w-md ">
          <SearchBar onSearch={onSearch} />
        </div>
      </div>

      <div className="flex items-center  space-x-4">
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
        <div className="pr-2 flex items-center">
          <Avatar name={name} size={"big"} />
        </div>
        <div>
          <button
            onClick={handleLogout}
            type="button"
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300 shadow hover:shadow-md"
          >
            Logout
          </button>
        </div>
      </div>

      <ToastContainer />

      <Modal
        isVisible={isModalVisible}
        onClose={cancalLogout}
        onConfirm={confirmLogout}
      />
    </div>
  );
};

export default Appbar;
