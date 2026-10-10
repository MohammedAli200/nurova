import { useState, useEffect, useCallback } from "react";
import {
  getStoredWishlist,
  saveWishlist,
  toggleWishlistItem
} from "../services/wishlistservice";

export function useWishlist() {
  const [wishlist, setWishlist] = useState(getStoredWishlist);

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  const isWishlisted = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback((product) => {
    setWishlist((current) => {
      const { updatedList } = toggleWishlistItem(current, product);
      return updatedList;
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return {
    wishlist,
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount: wishlist.length
  };
}

export default useWishlist;
