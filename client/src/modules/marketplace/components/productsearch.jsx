import React from "react";

const SEARCH_SUGGESTIONS = [
  "Ashwagandha",
  "Triphala",
  "Kumkumadi Oil",
  "Tulsi Tea",
  "Vedic Ghee",
  "Brahmi"
];

export default function ProductSearch({
  searchQuery,
  onSearchChange,
  onClearSearch
}) {
  return (
    <div className="clay-search-wrapper">
      <span className="clay-search-icon">🔍</span>
      <input
        type="text"
        className="clay-search-input"
        placeholder="Search Ayurvedic remedies, ingredients (e.g. Ashwagandha, Saffron, Triphala)..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          className="clay-search-clear"
          onClick={onClearSearch}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export { SEARCH_SUGGESTIONS };
