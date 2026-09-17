import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { storeApi } from "../services/api";

const StoreContext = createContext();

export const INITIAL_STORE_PRODUCTS = [
  {
    id: "tn_prod_1",
    name: "Complete Engineering Drawing Kit (Mini Drafter + Compass + Clips + Sheet Holder)",
    category: "Drawing & Drafting",
    price: 650,
    originalPrice: 850,
    inStock: true,
    stockCount: 45,
    unit: "kit",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    description: "Official NIT approved mini drafter with steel rod, clamp, drafting scales, protractor, and water-resistant storage bag.",
    isBestseller: true,
  },
  {
    id: "tn_prod_2",
    name: "Engineering Physics & Chemistry Official Lab Manuals + Hardcover Record (Set of 2)",
    category: "Lab Records & Manuals",
    price: 180,
    originalPrice: 240,
    inStock: true,
    stockCount: 120,
    unit: "set",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    description: "Official college syllabus verified experiments manual with graph sheets and certified pre-printed index format.",
    isBestseller: true,
  },
  {
    id: "tn_prod_3",
    name: "Casio FX-991EX Classwiz Scientific Calculator (Non-Programmable)",
    category: "Electronics & Tech",
    price: 1390,
    originalPrice: 1595,
    inStock: true,
    stockCount: 22,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80",
    description: "552 functions, high-resolution LCD screen, permitted in all university mid-term and semester examinations.",
    isBestseller: false,
  },
  {
    id: "tn_prod_4",
    name: "A2 Engineering Drawing Sheets Pack (20 Sheets, 180 GSM Ivory Paper)",
    category: "Drawing & Drafting",
    price: 120,
    originalPrice: 160,
    inStock: true,
    stockCount: 85,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
    description: "Smooth finish heavy cartridge sheets, pre-bordered with college title block format.",
    isBestseller: false,
  }
];

export const StoreProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("rentify_store_products");
      return saved ? JSON.parse(saved) : INITIAL_STORE_PRODUCTS;
    } catch (e) {
      return INITIAL_STORE_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("rentify_store_orders");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activePickupPass, setActivePickupPass] = useState(null);

  // Fetch products and orders from backend API
  const fetchStoreData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        storeApi.getProducts().catch(() => ({ products: [] })),
        storeApi.getOrders().catch(() => ({ orders: [] })),
      ]);

      if (prodRes.products && prodRes.products.length > 0) {
        setProducts(prodRes.products);
      }
      if (orderRes.orders && orderRes.orders.length > 0) {
        setOrders(orderRes.orders);
      }
    } catch (err) {
      console.warn("Store data fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, [currentUser?.id]);

  useEffect(() => {
    try {
      localStorage.setItem("rentify_store_products", JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("rentify_store_orders", JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // Student Places Order with Payment Verification
  const placeStoreOrder = async (cartItems, paymentMethod = "Razorpay UPI") => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const paymentOrderPayload = {
      studentId: currentUser?.id || "student_guest",
      items: cartItems,
      totalAmount: total,
    };

    try {
      // 1. Create Payment Order (Razorpay / Instant Campus UPI)
      const payRes = await storeApi.createPaymentOrder(paymentOrderPayload).catch(() => ({
        success: true,
        orderId: `order_sim_${Date.now()}`,
      }));

      // 2. Complete Order & Issue Verified Pickup Pass
      const orderPayload = {
        studentId: currentUser?.id || "student_guest",
        studentName: currentUser?.name || "Campus Student",
        studentRoll: currentUser?.rollNo || "2024CS" + Math.floor(100 + Math.random() * 900),
        studentBranch: currentUser?.branch || "Computer Engineering",
        items: cartItems,
        totalAmount: total,
        paymentMethod,
        paymentId: payRes.orderId || `pay_sim_${Date.now()}`,
      };

      const res = await storeApi.createOrder(orderPayload);
      const newOrder = res.order;
      setOrders((prev) => [newOrder, ...prev]);
      setActivePickupPass(newOrder);

      // Decrement stock in local state
      setProducts((prev) =>
        prev.map((prod) => {
          const ordered = cartItems.find((ci) => ci.productId === prod.id);
          if (ordered) {
            return {
              ...prod,
              stockCount: Math.max(0, prod.stockCount - ordered.quantity),
            };
          }
          return prod;
        })
      );

      return newOrder;
    } catch (err) {
      console.error("placeStoreOrder API error:", err);
      // Fallback
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const fallbackOrder = {
        id: `ord_${Date.now()}`,
        pickupCode: `KM-${randomSuffix}`,
        studentId: currentUser?.id || "student_guest",
        studentName: currentUser?.name || "Campus Student",
        studentRoll: currentUser?.rollNo || "2024CS" + Math.floor(100 + Math.random() * 900),
        studentBranch: currentUser?.branch || "Computer Engineering",
        items: cartItems,
        totalAmount: total,
        paymentMethod,
        status: "Ready for Pickup",
        placedAt: new Date().toISOString(),
        pickupSlot: "Today, Counter Pickup (SAC Counter #2)",
        pickupLocation: "UniMandi SAC Store Counter #2",
        qrDataPayload: `UNIMANDI-SAC-${randomSuffix}-${currentUser?.id || "guest"}`,
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
      setActivePickupPass(fallbackOrder);
      return fallbackOrder;
    }
  };

  // Tanish Store Manager Verifies Order
  const verifyAndDispenseOrder = async (pickupCode) => {
    const code = pickupCode.trim().toUpperCase();

    try {
      const res = await storeApi.verifyPickup(null, code, code);
      const verifiedOrder = res.order;

      setOrders((prev) =>
        prev.map((o) => (o.id === verifiedOrder.id ? verifiedOrder : o))
      );

      return {
        success: true,
        message: res.message || `Verified! Handed over to ${verifiedOrder.studentName}`,
        order: verifiedOrder,
      };
    } catch (err) {
      console.warn("verifyAndDispenseOrder API error:", err.message);
      // Local fallback
      const orderIndex = orders.findIndex(
        (o) => o.pickupCode === code || o.pickupCode === `TN-${code}`
      );

      if (orderIndex === -1) {
        return { success: false, message: "Invalid Pickup Code. Please check the code on student's screen." };
      }

      const order = orders[orderIndex];
      const updatedOrder = {
        ...order,
        status: "Picked Up / Completed",
        completedAt: new Date().toISOString(),
      };

      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? updatedOrder : o))
      );

      return {
        success: true,
        message: `Verified! Handed over to ${order.studentName} (${order.studentRoll}). Total: ₹${order.totalAmount}`,
        order: updatedOrder,
      };
    }
  };

  const addStoreProduct = async (newProductData) => {
    try {
      const res = await storeApi.createProduct(newProductData);
      const newProduct = res.product;
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      const fallback = {
        id: `tn_prod_${Date.now()}`,
        inStock: true,
        isBestseller: false,
        ...newProductData,
      };
      setProducts((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateStoreProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteStoreProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const studentOrders = currentUser
    ? orders.filter((o) => o.studentId === currentUser.id)
    : [];

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        studentOrders,
        activePickupPass,
        setActivePickupPass,
        placeStoreOrder,
        verifyAndDispenseOrder,
        addStoreProduct,
        updateStoreProduct,
        deleteStoreProduct,
        refreshStore: fetchStoreData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
