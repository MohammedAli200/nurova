import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Package,
  Plus,
  Minus,
  Trash2,
  X,
  ArrowRight,
  ShieldCheck,
  Eye,
  Tag,
  Star,
  RefreshCw,
} from "lucide-react";

import UserNavbar from "../../../components/layout/UserNavbar";
import ClayCard from "../../../components/ui/ClayCard";
import ClayButton from "../../../components/ui/ClayButton";
import ClayBadge from "../../../components/ui/ClayBadge";
import ClayInput from "../../../components/ui/ClayInput";
import ClaySelect from "../../../components/ui/ClaySelect";
import ClayModal from "../../../components/ui/ClayModal";
import ClaySkeleton from "../../../components/ui/ClaySkeleton";
import ClayEmptyState from "../../../components/ui/ClayEmptyState";
import ClayErrorState from "../../../components/ui/ClayErrorState";
import { useToast } from "../../../contexts/ToastContext";
import { useAuth } from "../../../contexts/AuthContext";

import { getProducts } from "../services/productservice";
import useCart from "../hooks/usecart";
import CheckoutModal from "../components/CheckoutModal";

const CATEGORIES = [
  "All Remedies",
  "Herbal Supplements",
  "Oils & Ghee",
  "Teas & Infusions",
  "Classical Churnas",
  "Natural Skincare",
  "Aromatherapy",
  "Yoga & Wellness",
  "Ayurvedic Formulations",
];

export default function MarketplacePage() {
  const toast = useToast();
  const { user } = useAuth();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totals,
    checkoutOrder,
    isCheckingOut,
  } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Remedies");
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load marketplace products:", err);
      setError(err.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (
          selectedCategory !== "All Remedies" &&
          p.category?.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // In-stock filter
        if (inStockOnly && (p.stock <= 0 || p.inStock === false)) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchShort = p.shortDescription?.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          const matchPractitioner =
            p.practitionerId?.name?.toLowerCase().includes(q) ||
            p.practitionerId?.specialization?.toLowerCase().includes(q);

          if (
            !matchName &&
            !matchDesc &&
            !matchShort &&
            !matchBrand &&
            !matchCat &&
            !matchPractitioner
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "stock") return (b.stock || 0) - (a.stock || 0);
        // Default: featured / newest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  const handleAddToCart = (product, qty = 1) => {
    if (product.stock <= 0 || product.inStock === false) {
      toast.error("This product is currently out of stock.", "Out of Stock");
      return;
    }

    addToCart(product, qty);
    toast.success(
      `Added ${qty} × ${product.name} to your cart.`,
      "Cart Updated"
    );
  };

  const handleOpenQuickView = (product) => {
    setQuickViewProduct(product);
    setModalQty(1);
  };

  const handleConfirmOrder = async (
    shippingInfo,
    paymentMethod
  ) => {
    const receipt = await checkoutOrder(
      shippingInfo,
      paymentMethod
    );
    toast.success("Order placed successfully!", "Order Confirmed");
    return receipt;
  };

  const getProductImage = (product) => {
    if (!product?.image) return null;
    return product.image.startsWith("http")
      ? product.image
      : `${apiBase}${product.image}`;
  };

  return (
    <div className="min-h-screen bg-sand font-georama pb-16">
      <UserNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Hero Section */}
        <ClayCard level="2" className="p-6 sm:p-8 relative overflow-hidden border border-white/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bitcount text-burntOrange text-xs uppercase font-bold tracking-wider">
                  HOLISTIC APOTHECARY & AYURVEDA
                </span>
                <span className="text-[10px] bg-forest/10 text-forest px-2 py-0.5 rounded-full font-bold">
                  Verified Remedies
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-forest tracking-tight">
                Wellness Marketplace
              </h1>

              <p className="text-sm sm:text-base text-forest/80 leading-relaxed font-medium">
                Discover clinically tested botanicals, classical rasayanas, organic oils, and restorative care curated directly by verified alternative therapy practitioners.
              </p>

              <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-forest/70 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest" />
                  Direct from Verified Vaidyas
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-burntOrange" />
                  Free shipping on orders above ₹999
                </span>
              </div>
            </div>

            {/* Cart Trigger Badge */}
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => setCartDrawerOpen(true)}
                className="w-full sm:w-auto p-4 rounded-2xl bg-warmBeige shadow-[4px_4px_10px_rgba(53,92,69,0.1),-4px_-4px_10px_rgba(255,255,255,0.85)] border border-white/60 hover:shadow-[2px_2px_6px_rgba(53,92,69,0.15)] active:shadow-[inset_2px_2px_5px_rgba(53,92,69,0.15)] transition-all flex items-center justify-between sm:justify-start gap-4 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-forest text-sand flex items-center justify-center relative shadow-[2px_2px_6px_rgba(53,92,69,0.25)]">
                  <ShoppingBag className="w-5 h-5" />
                  {totals.totalCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-burntOrange text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                      {totals.totalCount}
                    </span>
                  )}
                </div>

                <div className="text-left pr-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                    Your Cart
                  </p>
                  <p className="text-base font-extrabold text-forest">
                    ₹{totals.grandTotal.toLocaleString("en-IN")}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </ClayCard>

        {/* Filter and Search Bar */}
        <ClayCard level="1" className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search remedies, herbs, practitioners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-warmBeige/60 border border-white/60 shadow-[inset_1px_1px_3px_rgba(53,92,69,0.08),inset_-1px_-1px_3px_rgba(255,255,255,0.85)] text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:border-forest/50 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/40 hover:text-forest p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4">
              <ClaySelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: "featured", label: "Featured & Newest" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "stock", label: "Highest Stock Availability" },
                ]}
              />
            </div>

            {/* In-stock Only Toggle */}
            <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-forest">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-forest focus:ring-forest cursor-pointer"
                />
                <span>In-Stock Only</span>
              </label>

              <span className="text-xs font-semibold text-forest/60">
                ({filteredProducts.length} items)
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    active
                      ? "clay-btn-forest text-sand shadow-[2px_3px_8px_rgba(53,92,69,0.25)] scale-100"
                      : "bg-warmBeige/80 text-forest/75 hover:text-forest hover:bg-white/50 border border-white/40 shadow-[1px_1px_3px_rgba(53,92,69,0.06)]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </ClayCard>

        {/* Product Grid Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ClayCard key={i} level="1" className="p-4 space-y-3 animate-pulse">
                <div className="h-44 bg-forest/10 rounded-2xl w-full" />
                <div className="h-4 bg-forest/20 rounded w-3/4" />
                <div className="h-3 bg-forest/10 rounded w-1/2" />
                <div className="h-8 bg-forest/10 rounded-xl w-full" />
              </ClayCard>
            ))}
          </div>
        ) : error ? (
          <ClayCard level="1" className="p-8 max-w-xl mx-auto">
            <ClayErrorState
              title="Marketplace Error"
              message={error}
              onRetry={fetchProducts}
            />
          </ClayCard>
        ) : !filteredProducts.length ? (
          <ClayCard level="1" className="p-8">
            <ClayEmptyState
              icon={Package}
              title="No Products Match Your Filter"
              description="Try adjusting your search query, selecting another category, or unchecking the in-stock filter."
              actionLabel="Reset All Filters"
              onAction={() => {
                setSearchQuery("");
                setSelectedCategory("All Remedies");
                setInStockOnly(false);
                setSortBy("featured");
              }}
            />
          </ClayCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0 || product.inStock === false;
              const isLowStock = product.stock > 0 && product.stock <= 5;
              const imgUrl = getProductImage(product);
              const practitioner = product.practitionerId;

              return (
                <ClayCard
                  key={product._id || product.id}
                  level="1"
                  className="p-4 flex flex-col justify-between hover:shadow-clay-card hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Fixed Aspect Image Frame */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-warmBeige/80 border border-white/60 mb-3 flex items-center justify-center group">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-forest/40">
                          <Package className="w-10 h-10 mb-1" />
                          <span className="text-[11px] font-semibold">Ayurvedic Remedy</span>
                        </div>
                      )}

                      {/* Stock Pill Badge */}
                      <div className="absolute top-2.5 right-2.5">
                        <ClayBadge
                          status={
                            isOutOfStock
                              ? "danger"
                              : isLowStock
                              ? "orange"
                              : "forest"
                          }
                          size="xs"
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : isLowStock
                            ? `Only ${product.stock} Left`
                            : "Available"}
                        </ClayBadge>
                      </div>

                      {/* Quick View Hover Action */}
                      <button
                        type="button"
                        onClick={() => handleOpenQuickView(product)}
                        className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-sand/90 backdrop-blur-md text-forest text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white flex items-center gap-1 cursor-pointer"
                        title="View product details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-burntOrange">
                        <span className="uppercase tracking-wider">
                          {product.category || "Remedy"}
                        </span>
                        {product.brand && (
                          <span className="text-forest/50 font-semibold truncate max-w-[120px]">
                            {product.brand}
                          </span>
                        )}
                      </div>

                      <h2
                        onClick={() => handleOpenQuickView(product)}
                        className="text-base font-bold text-forest leading-snug line-clamp-1 hover:text-burntOrange transition-colors cursor-pointer"
                        title={product.name}
                      >
                        {product.name}
                      </h2>

                      <p className="text-xs text-forest/70 line-clamp-2 leading-relaxed">
                        {product.shortDescription || product.description}
                      </p>
                    </div>

                    {/* Practitioner Credit */}
                    {practitioner && (
                      <div className="mt-3 pt-2.5 border-t border-forest/10 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-forest text-sand flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                          {(
                            practitioner.displayName?.replace(/^Dr\.\s*/i, "")[0] ||
                            practitioner.name?.[0] ||
                            practitioner.username?.[0] ||
                            "P"
                          ).toUpperCase()}
                        </div>
                        <div className="text-left truncate flex-1">
                          <div className="flex items-center gap-1">
                            <p className="text-[11px] font-bold text-forest truncate">
                              {practitioner.displayName ||
                                practitioner.name ||
                                practitioner.username ||
                                "Holistic Practitioner"}
                            </p>
                            {practitioner.verified && (
                              <CheckCircle2 className="w-3 h-3 text-forest flex-shrink-0" />
                            )}
                          </div>
                          {practitioner.specialization && (
                            <p className="text-[10px] text-burntOrange capitalize truncate">
                              {practitioner.specialization}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price and Add-to-cart */}
                  <div className="mt-4 pt-3 border-t border-forest/10 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-forest/50">
                        Price
                      </p>
                      <p className="text-base font-extrabold text-forest">
                        ₹{product.price}
                      </p>
                    </div>

                    <ClayButton
                      type="button"
                      variant={isOutOfStock ? "beige" : "forest"}
                      size="sm"
                      fullWidth={false}
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(product, 1)}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </ClayButton>
                  </div>
                </ClayCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Details Modal */}
      {quickViewProduct && (
        <ClayModal
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          title={quickViewProduct.name}
          subtitle={`REMEDY DETAILS • ${quickViewProduct.category?.toUpperCase() || "HERBAL"}`}
          maxWidth="max-w-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto pr-1">
            {/* Image Section */}
            <div className="space-y-3">
              <div className="w-full h-64 rounded-3xl overflow-hidden bg-warmBeige/80 border border-white/60 flex items-center justify-center">
                {getProductImage(quickViewProduct) ? (
                  <img
                    src={getProductImage(quickViewProduct)}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-16 h-16 text-forest/30" />
                )}
              </div>

              {/* Practitioner Attribution Box */}
              {(quickViewProduct.practitioner || quickViewProduct.practitionerId) && (() => {
                const pr = quickViewProduct.practitioner || quickViewProduct.practitionerId;
                const prName = pr.displayName || pr.name || pr.username || "Holistic Practitioner";
                const prInitial = (prName.replace(/^Dr\.\s*/i, "")[0] || "P").toUpperCase();
                const isPrVerified = pr.verified || pr.approvalStatus === "approved" || pr.verificationStatus === "approved" || pr.isApproved;

                return (
                  <div className="p-3.5 rounded-2xl bg-warmBeige border border-white/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest text-sand flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {prInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-forest">
                          {prName}
                        </p>
                        {isPrVerified && (
                          <ClayBadge status="approved" size="xs">
                            Verified
                          </ClayBadge>
                        )}
                      </div>
                      <p className="text-[11px] text-burntOrange font-semibold capitalize">
                        {pr.specialization || "Alternative Therapy Specialist"}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Product Details Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-burntOrange uppercase tracking-wider">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-xl font-extrabold text-forest mt-0.5">
                    ₹{quickViewProduct.price}
                  </h3>
                </div>

                <ClayBadge
                  status={
                    quickViewProduct.stock <= 0 || quickViewProduct.inStock === false
                      ? "danger"
                      : "approved"
                  }
                  size="sm"
                >
                  {quickViewProduct.stock <= 0 || quickViewProduct.inStock === false
                    ? "Out of Stock"
                    : `In Stock (${quickViewProduct.stock})`}
                </ClayBadge>
              </div>

              {/* Short & Detailed Description */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-forest/80 leading-relaxed">
                  {quickViewProduct.shortDescription || quickViewProduct.description}
                </p>

                {quickViewProduct.shortDescription && quickViewProduct.description && (
                  <p className="text-xs text-forest/70 leading-relaxed font-normal">
                    {quickViewProduct.description}
                  </p>
                )}
              </div>

              {/* Ingredients */}
              {quickViewProduct.ingredients && quickViewProduct.ingredients.length > 0 && (
                <div className="p-3 rounded-2xl bg-warmBeige/70 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-forest/60">
                    Ingredients & Botanicals
                  </p>
                  <p className="text-xs font-medium text-forest">
                    {Array.isArray(quickViewProduct.ingredients)
                      ? quickViewProduct.ingredients.join(", ")
                      : quickViewProduct.ingredients}
                  </p>
                </div>
              )}

              {/* Dosage / Instructions */}
              {(quickViewProduct.usageInstructions || quickViewProduct.dosage) && (
                <div className="p-3 rounded-2xl bg-warmBeige/70 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-forest/60">
                    Usage Instructions / Dosage
                  </p>
                  <p className="text-xs font-medium text-forest">
                    {quickViewProduct.usageInstructions || quickViewProduct.dosage}
                  </p>
                </div>
              )}

              {/* Quantity Selector & Add to Cart */}
              <div className="pt-3 border-t border-forest/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest">Quantity</span>
                  <div className="flex items-center gap-2 bg-warmBeige p-1 rounded-xl shadow-[inset_1px_1px_3px_rgba(53,92,69,0.1)]">
                    <button
                      type="button"
                      disabled={modalQty <= 1}
                      onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-sand text-forest flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer shadow-sm"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-forest">
                      {modalQty}
                    </span>
                    <button
                      type="button"
                      disabled={modalQty >= (quickViewProduct.stock || 1)}
                      onClick={() =>
                        setModalQty((q) =>
                          Math.min(quickViewProduct.stock || 1, q + 1)
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-sand text-forest flex items-center justify-center font-bold disabled:opacity-40 cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <ClayButton
                  type="button"
                  variant={
                    quickViewProduct.stock <= 0 || quickViewProduct.inStock === false
                      ? "beige"
                      : "forest"
                  }
                  size="md"
                  fullWidth
                  disabled={
                    quickViewProduct.stock <= 0 || quickViewProduct.inStock === false
                  }
                  onClick={() => {
                    handleAddToCart(quickViewProduct, modalQty);
                    setQuickViewProduct(null);
                  }}
                >
                  {quickViewProduct.stock <= 0 || quickViewProduct.inStock === false
                    ? "Out of Stock"
                    : `Add ${modalQty} to Cart • ₹${quickViewProduct.price * modalQty}`}
                </ClayButton>
              </div>
            </div>
          </div>
        </ClayModal>
      )}

      {/* Cart Drawer Modal */}
      <ClayModal
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        title="Your Wellness Cart"
        subtitle={`MARKETPLACE BAG • ${totals.totalCount} ITEM${totals.totalCount === 1 ? "" : "S"}`}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 max-h-[75vh] flex flex-col justify-between">
          {!cartItems.length ? (
            <div className="py-8">
              <ClayEmptyState
                icon={ShoppingBag}
                title="Your Cart is Empty"
                description="Explore certified botanicals and therapeutic products to add them to your cart."
                actionLabel="Explore Marketplace"
                onAction={() => setCartDrawerOpen(false)}
              />
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3 overflow-y-auto max-h-72 pr-1">
                {cartItems.map((item) => {
                  const itemId = item._id || item.id || item.productId;
                  const itemImg = getProductImage(item);

                  return (
                    <div
                      key={itemId}
                      className="p-3.5 rounded-2xl bg-warmBeige/80 border border-white/60 flex items-center justify-between gap-3 shadow-[1px_1px_3px_rgba(53,92,69,0.06)]"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/60 flex items-center justify-center flex-shrink-0">
                        {itemImg ? (
                          <img
                            src={itemImg}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-forest/40" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-forest truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] font-bold text-burntOrange">
                          ₹{item.price} each
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-sand p-1 rounded-xl shadow-inner">
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-warmBeige text-forest flex items-center justify-center font-bold hover:bg-white transition-all cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-forest">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-warmBeige text-forest flex items-center justify-center font-bold hover:bg-white transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="text-right flex items-center gap-2">
                        <span className="text-xs font-extrabold text-forest">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(itemId)}
                          className="p-1 text-forest/40 hover:text-burntOrange transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Pricing Breakdown */}
              <div className="p-4 rounded-2xl bg-warmBeige space-y-2 border border-white/60 text-xs font-semibold text-forest/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-forest">
                    ₹{totals.subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-bold text-forest">
                    {totals.shippingFee === 0 ? (
                      <span className="text-forest font-bold">FREE</span>
                    ) : (
                      `₹${totals.shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Taxes (5%)</span>
                  <span className="font-bold text-forest">
                    ₹{totals.tax.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="pt-2 border-t border-forest/10 flex justify-between text-sm font-extrabold text-forest">
                  <span>Total Amount</span>
                  <span>₹{totals.grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <div className="pt-2 flex gap-3">
                <ClayButton
                  type="button"
                  variant="beige"
                  size="md"
                  fullWidth
                  onClick={clearCart}
                >
                  Clear Bag
                </ClayButton>

                <ClayButton
                  type="button"
                  variant="forest"
                  size="md"
                  fullWidth
                  icon={ArrowRight}
                  onClick={() => {
                    setCartDrawerOpen(false);
                    setCheckoutModalOpen(true);
                  }}
                >
                  Checkout Now
                </ClayButton>
              </div>
            </>
          )}
        </div>
      </ClayModal>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cartItems={cartItems}
        totals={totals}
        onConfirmOrder={handleConfirmOrder}
        isCheckingOut={isCheckingOut}
      />
    </div>
  );
}