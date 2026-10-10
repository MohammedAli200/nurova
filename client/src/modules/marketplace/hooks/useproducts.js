import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  filterProducts,
} from "../services/productservice";

export function useProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDosha, setSelectedDosha] = useState("all");
  const [selectedBenefit, setSelectedBenefit] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(5000);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const products = await getProducts();

        if (isMounted) {
          setAllProducts(Array.isArray(products) ? products : []);
        }
      } catch (err) {
        console.error("Failed to load products:", err);

        if (isMounted) {
          setError(err.message || "Failed to load products");
          setAllProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return filterProducts({
      products: allProducts,
      category: selectedCategory,
      dosha: selectedDosha,
      benefit: selectedBenefit,
      search: searchQuery,
      sortBy,
      inStockOnly,
      priceMax,
    });
  }, [
    allProducts,
    selectedCategory,
    selectedDosha,
    selectedBenefit,
    searchQuery,
    sortBy,
    inStockOnly,
    priceMax,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedDosha("all");
    setSelectedBenefit("");
    setSortBy("popular");
    setInStockOnly(false);
    setPriceMax(5000);
  };

  const isFilterActive =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedDosha !== "all" ||
    selectedBenefit !== "" ||
    inStockOnly ||
    priceMax < 5000;

  return {
    allProducts,
    filteredProducts,
    loading,
    error,
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
    inStockOnly,
    setInStockOnly,
    priceMax,
    setPriceMax,
    quickViewProduct,
    setQuickViewProduct,
    resetFilters,
    isFilterActive,
  };
}

export default useProducts;