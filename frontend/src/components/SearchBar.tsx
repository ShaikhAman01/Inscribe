import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    onSearch(value); // Call the parent-provided function
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 4a6 6 0 100 12 6 6 0 000-12zm8 8l4 4"
          />
        </svg>
      </div>
      <input
        type="search"
        className="block w-full p-4 pl-10 text-sm text-gray-900 rounded-3xl border"
        placeholder="Search"
        value={searchTerm}
        onChange={handleSearch}
        required
      />
    </div>
  );
};

export default SearchBar;
