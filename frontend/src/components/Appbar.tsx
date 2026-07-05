import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { ToastContainer, useToast } from "./Toast";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Feather, LogOut, SquarePen } from "lucide-react";

interface AppbarProps {
  searchTerm?: string;
  onSearch?: (query: string) => void;
}

const Appbar: React.FC<AppbarProps> = ({ searchTerm = "", onSearch }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-100 bg-white/90 backdrop-blur-sm">
      <div className="flex justify-between items-center gap-3 px-4 sm:px-6 lg:px-10 h-16">
        <Link
          to={"/blogs"}
          className="flex items-center text-2xl sm:text-3xl font-black tracking-tight text-stone-800 shrink-0"
        >
          <Feather className="h-6 w-6 mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Inscribe</span>
        </Link>

        {onSearch && (
          <div className="flex-grow max-w-md">
            <SearchBar value={searchTerm} onSearch={onSearch} />
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            to={"/publish"}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <SquarePen className="h-4 w-4" aria-hidden="true" />
            Write
          </Link>
          <ProfileDropdown />
        </div>
      </div>
    </header>
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
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

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
          aria-label="Account menu"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="flex items-center gap-1.5 rounded-full bg-stone-100 p-1.5 pr-2 hover:bg-stone-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
        >
          <Avatar name={name || "Unknown"} />
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-48 rounded-xl bg-white py-1 shadow-lg ring-1 ring-stone-900/5 border border-stone-100"
          >
            <div className="px-4 py-2 border-b border-stone-100">
              <p className="text-sm font-bold text-stone-900 truncate">{name}</p>
            </div>
            <Link
              to={"/publish"}
              role="menuitem"
              className="md:hidden flex w-full items-center px-4 py-2 text-sm text-stone-700 border-b border-stone-100 hover:bg-stone-50 transition-colors"
            >
              <SquarePen className="mr-2 h-4 w-4" aria-hidden="true" />
              Write
            </Link>
            <button
              role="menuitem"
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-stone-50 transition-colors"
              onClick={handleLogoutClick}
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
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
