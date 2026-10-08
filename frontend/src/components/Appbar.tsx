import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { ToastContainer, useToast } from "./Toast";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Feather, LogOut, SquarePen, UserX } from "lucide-react";
import axios from "axios";
import { clearSession, deleteAccount, isSignedIn } from "../hooks";

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

        {!isSignedIn() ? (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/signin"
              className="px-4 py-2 rounded-full text-sm font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-full text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 transition-colors"
            >
              Get started
            </Link>
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
};

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
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

  const closeDelete = () => {
    setIsDeleteVisible(false);
    setDeletePassword("");
    setDeleteError("");
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteAccount(deletePassword);
      clearSession();
      showToast("Your account has been deleted", "success");
      closeDelete();
      navigate("/");
    } catch (e) {
      const status = axios.isAxiosError(e) ? e.response?.status : undefined;
      setDeleteError(
        status === 401
          ? "That password is incorrect."
          : status === 429
          ? "Too many attempts. Please wait a minute."
          : "Couldn't delete your account. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmLogout = () => {
    clearSession();
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
            <button
              role="menuitem"
              className="flex w-full items-center px-4 py-2 text-sm text-stone-500 border-t border-stone-100 hover:bg-stone-50 hover:text-red-600 transition-colors"
              onClick={() => {
                setIsOpen(false);
                setIsDeleteVisible(true);
              }}
            >
              <UserX className="mr-2 h-4 w-4" aria-hidden="true" />
              Delete account
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

      <ConfirmDialog
        isVisible={isDeleteVisible}
        title="Delete your account?"
        description="This permanently removes your account along with every story, comment and like you've made. It can't be undone."
        confirmLabel="Delete account"
        busy={isDeleting}
        confirmDisabled={!deletePassword}
        onConfirm={confirmDelete}
        onClose={closeDelete}
      >
        <label htmlFor="delete-password" className="block text-sm font-bold text-stone-700 mb-1.5">
          Confirm with your password
        </label>
        <input
          id="delete-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          aria-invalid={Boolean(deleteError)}
          aria-describedby={deleteError ? "delete-password-error" : undefined}
          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900"
        />
        {deleteError && (
          <p id="delete-password-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
            {deleteError}
          </p>
        )}
      </ConfirmDialog>
    </>
  );
};

export default Appbar;
