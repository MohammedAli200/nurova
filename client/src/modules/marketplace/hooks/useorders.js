import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:5001/api/orders";
export function useOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching orders for user:", userId);

      const response = await fetch(
        `${API_BASE_URL}/user/${userId}`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch orders"
        );
      }

      console.log("Orders received from MongoDB:", result);

      setOrders(result.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refreshOrders = useCallback(() => {
    return fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to cancel order"
        );
      }

      console.log("Order cancelled:", result);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? result.data
            : order
        )
      );

      return result.data;
    } catch (err) {
      console.error("Cancel order failed:", err);
      throw err;
    }
  }, []);

  return {
    orders,
    isLoading,
    error,
    refreshOrders,
    cancelOrder,
  };
}

export default useOrders;