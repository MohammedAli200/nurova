// ==========================================================================
// NUROVA - MODULE C: WISHLIST SERVICE
// ==========================================================================

const WISHLIST_STORAGE_KEY = "nurova_ayurveda_wishlist";

export const getStoredWishlist = () => {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveWishlist = (items) => {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save wishlist", err);
  }
};

export const toggleWishlistItem = (currentWishlist, product) => {
  const exists = currentWishlist.some((item) => item.id === product.id);
  let updated;
  if (exists) {
    updated = currentWishlist.filter((item) => item.id !== product.id);
  } else {
    updated = [...currentWishlist, product];
  }
  saveWishlist(updated);
  return { updatedList: updated, isWishlistedNow: !exists };
};
