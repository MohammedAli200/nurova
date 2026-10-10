import React from "react";
import ProductFilter from "../components/productfilter";
import ProductGrid from "../components/productgrid";
import ProductModal from "../components/ProductModal";

export default function ProductPage({
  productsHook,
  cartHook,
  wishlistHook,
  onNavigateToCart
}) {
  const {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDosha,
    setSelectedDosha,
    selectedBenefit,
    setSelectedBenefit,
    sortBy,
    setSortBy,
    quickViewProduct,
    setQuickViewProduct,
    resetFilters,
    isFilterActive
  } = productsHook;

  const { addToCart, isInCart } = cartHook;
  const { isWishlisted, toggleWishlist } = wishlistHook;

  return (
    <main className="clay-product-marketplace">
      {/* Hero Section */}
      <section className="clay-hero-section">
        <div className="clay-hero-card">
          <div className="clay-hero-content">
            <div className="clay-hero-tag">
              <span>🌿 Pure Ayurvedic Apothecary</span>
            </div>
            <h2>Ancient Wisdom. Modern Holistic Wellness.</h2>
            <p>
              Hand-harvested botanicals, classic Bilona ghee, and dosha-balancing
              elixirs rigorously tested for heavy metals, purity, and AYUSH clinical standards.
            </p>

            <div className="clay-hero-stats">
              <div className="clay-stat-item">
                <strong>100%</strong>
                <span>Wildcrafted & Pure</span>
              </div>
              <div className="clay-stat-item">
                <strong>AYUSH</strong>
                <span>Certified Formulas</span>
              </div>
              <div className="clay-stat-item">
                <strong>Vaidya</strong>
                <span>Doctor Curated</span>
              </div>
            </div>
          </div>

          <div className="clay-hero-visual">
            <div className="clay-hero-badge-float">
              ✨ Free Consult with Order
            </div>
            <div className="clay-hero-showcase">
              <span className="icon-large">🪷</span>
              <span className="clay-hero-showcase-caption">
                Balancing Vata, Pitta & Kapha
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <ProductFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedDosha={selectedDosha}
        onSelectDosha={setSelectedDosha}
        selectedBenefit={selectedBenefit}
        onSelectBenefit={setSelectedBenefit}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        resultsCount={filteredProducts.length}
        onResetFilters={resetFilters}
        isFilterActive={isFilterActive}
      />

      {/* Main Grid Section */}
      <section className="clay-main-layout">
        <ProductGrid
          products={filteredProducts}
          onAddToCart={addToCart}
          isInCart={isInCart}
          isWishlisted={isWishlisted}
          onToggleWishlist={toggleWishlist}
          onQuickView={setQuickViewProduct}
          onResetFilters={resetFilters}
        />
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          isInCart={isInCart(quickViewProduct.id)}
          isWishlisted={isWishlisted(quickViewProduct.id)}
          onToggleWishlist={toggleWishlist}
        />
      )}
    </main>
  );
}