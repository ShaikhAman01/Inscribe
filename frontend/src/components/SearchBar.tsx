import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSearch }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <Search className="w-4 h-4 text-stone-400" aria-hidden="true" />
      </div>
      <input
        type="search"
        aria-label="Search stories"
        className="block w-full py-2 pl-10 pr-9 text-sm text-stone-900 rounded-full border border-stone-200 bg-stone-50/50 placeholder-stone-400 transition-all focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent focus:bg-white [&::-webkit-search-cancel-button]:hidden"
        placeholder="Search stories..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onSearch("")}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
