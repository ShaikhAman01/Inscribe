import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { ToastContainer, useToast } from "./Toast";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Feather, LogOut, SquarePen } from "lucide-react";

interface AppbarProps {
  onSearch: (query: string) => void;
}

const Appbar: React.FC<AppbarProps> = ({ onSearch }) => {

  return (
    <div className="border-b flex justify-between items-center px-10 py-3 h-16">
      <div className="flex items-center space-x-6">
        <Link
          to={"/blogs"}
          className="flex items-center text-4xl font-bold text-stone-800"
        >
          <Feather className="h-6 w-6 mr-2" />
          Inscribe
        </Link>
      </div>
      <div className="flex-grow max-w-md mx-2 px-2">
        <SearchBar onSearch={onSearch} />
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to={"/publish"}
          className="mr-5 hidden  md:flex items-center hover:text-blue-700 transition-colors duration-200"
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
        <ProfileDropdown />
      </div>
    </div>
  );
};

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const name = localStorage.getItem("name")?.toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsModalVisible(true);
    setIsOpen(false);
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

  const cancelLogout = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 rounded-full bg-gray-100 p-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Avatar name={name || "Unknown"} />
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>



        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{name}</p>
            </div>
 <p className="md:hidden w-full px-4 py-2 text-sm border-b border-gray-100 flex items-center  hover:bg-gray-100">
            <Link
          to={"/publish"}
          className="flex"
        >
          <SquarePen className="mr-2 h-4 w-4"/>
          Write
        </Link>
        </p>

            <button
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={handleLogoutClick}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        )}

      </div>
        <ToastContainer />

      <Modal
        isVisible={isModalVisible}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </>
  );
};

export default Appbar;