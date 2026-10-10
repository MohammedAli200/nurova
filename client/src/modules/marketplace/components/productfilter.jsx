import React from "react";
import ProductSearch from "./productsearch";
import {
  AYURVEDIC_CATEGORIES,
  DOSHA_TYPES,
  AYURVEDIC_BENEFITS
} from "../services/productservice";

export default function ProductFilter({
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedCategory,
  onSelectCategory,
  selectedDosha,
  onSelectDosha,
  selectedBenefit,
  onSelectBenefit,
  sortBy,
  onSelectSort,
  resultsCount,
  onResetFilters,
  isFilterActive
}) {
  return (
    <section className="clay-controls-section">
      <div className="clay-controls-card">
        {/* Search and Sort Row */}
        <div className="clay-search-row">
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onClearSearch={onClearSearch}
          />
          <select
            className="clay-sort-select"
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="popular">🔥 Most Popular</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="price-low">💵 Price: Low to High</option>
            <option value="price-high">💎 Price: High to Low</option>
          </select>
        </div>

        {/* Category Chips Bar */}
        <div className="clay-category-row">
          {AYURVEDIC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`clay-category-chip ${
                selectedCategory === cat.id ? "active" : ""
              }`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Dosha & Benefit Filtering Row */}
        <div className="clay-tags-row">
          <div className="clay-dosha-filters">
            <span className="clay-filter-label">Dosha:</span>
            {DOSHA_TYPES.map((dosha) => (
              <button
                key={dosha.id}
                type="button"
                className={`clay-pill-tag ${
                  selectedDosha === dosha.id ? "active" : ""
                }`}
                onClick={() => onSelectDosha(dosha.id)}
              >
                {dosha.label}
              </button>
            ))}
          </div>

          <div className="clay-dosha-filters">
            <span className="clay-filter-label">Target Benefit:</span>
            {AYURVEDIC_BENEFITS.map((benefit) => (
              <button
                key={benefit}
                type="button"
                className={`clay-pill-tag ${
                  selectedBenefit === benefit ? "active" : ""
                }`}
                onClick={() =>
                  onSelectBenefit(selectedBenefit === benefit ? "" : benefit)
                }
              >
                {benefit}
              </button>
            ))}
          </div>

          <div className="clay-filter-actions">
            <span className="clay-results-count">
              Showing {resultsCount} {resultsCount === 1 ? "Product" : "Products"}
            </span>
            {isFilterActive && (
              <button
                type="button"
                className="clay-reset-btn"
                onClick={onResetFilters}
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
