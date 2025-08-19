import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Navbar2 from "../components/Navbar2";
import {
  selectCartItems,
  selectSubtotal,
  selectDeliveryFee,
  selectTax,
  selectTotal,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from "../store/cartSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast } from "react-toastify";

// Static coupon data
const COUPONS = [
  { code: "WELCOME10", discount: 10, description: "10% off your first order" },
  {
    code: "FOODIE20",
    discount: 20,
    description: "20% off on orders above ₹500",
  },
  { code: "HUNGRY50", discount: 50, description: "Flat ₹50 off" },
  { code: "FREEDEL", discount: 0, description: "Free delivery" },
];

const CartPage = () => {
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const deliveryFee = useSelector(selectDeliveryFee);
  const tax = useSelector(selectTax);
  const total = useSelector(selectTotal);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(total);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let newTotal = total;
    if (appliedCoupon) {
      if (appliedCoupon.code === "FREEDEL") {
        newTotal = subtotal + tax;
      } else if (appliedCoupon.discount > 0) {
        if (
          appliedCoupon.code === "WELCOME10" ||
          appliedCoupon.code === "FOODIE20"
        ) {
          const discount = (subtotal * appliedCoupon.discount) / 100;
          setDiscountAmount(discount);
          newTotal = total - discount;
        } else if (appliedCoupon.code === "HUNGRY50") {
          setDiscountAmount(appliedCoupon.discount);
          newTotal = total - appliedCoupon.discount;
        }
      }
    }
    setFinalTotal(newTotal > 0 ? newTotal : 0);
  }, [total, appliedCoupon, subtotal, tax]);

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > cartItems.find((item) => item.id === id).quantity) {
      dispatch(incrementQuantity(id));
    } else {
      dispatch(decrementQuantity(id));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const applyCoupon = () => {
    const coupon = COUPONS.find(
      (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase()
    );
    if (!coupon) {
      toast.error("Invalid coupon code");
      return;
    }
    if (coupon.code === "FOODIE20" && subtotal < 500) {
      toast.error("This coupon requires minimum order of ₹500");
      return;
    }
    setAppliedCoupon(coupon);
    setShowCouponInput(false);
    toast.success(`Coupon applied: ${coupon.description}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setDiscountAmount(0);
    toast.info("Coupon removed");
  };

  // Payment success handler that accepts orderId as parameter
  const handlePaymentSuccess = async (paymentResponse, orderId) => {
    if (!orderId) {
      toast.error("Order ID missing. Please contact support.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const verifyResponse = await API.post("/verify-payment", {
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        order_id: orderId,
      });
      if (verifyResponse.data.success) {
        toast.success("Payment successful! Your order is confirmed.");
        dispatch(clearCart());
        navigate(`/order/${orderId}`, { replace: true });
      } else {
        toast.error("Payment verification failed");
        await API.put("/update-order-status", {
          orderId: orderId,
          status: "failed",
          payment_status: "failed",
        });
      }
    } catch (error) {
      toast.error("Payment verification failed. Please contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  // Payment failure handler that accepts orderId as parameter
  const handlePaymentFailure = async (error, orderId) => {
    toast.error("Payment failed. Please try again.");
    if (orderId) {
      try {
        await API.put("/update-order-status", {
          orderId: orderId,
          status: "failed",
          payment_status: "failed",
        });
      } catch {}
    }
    setIsLoading(false);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!user.defaultAddressId) {
      toast.error("Please set a default delivery address in your profile.");
      return;
    }
    setIsLoading(true);
    try {
      const orderData = {
        user_id: user.userId || user.id,
        items: cartItems.map((item) => ({
          food_id: item.id,
          quantity: item.quantity,
          addons: (item.addons || []).map((ad) => ({ id: ad.id, price: ad.price })),
        })),
        delivery_address_id: user.defaultAddressId || 1,
      };
      const orderResponse = await API.post("/orders", orderData);
      const orderId = orderResponse.data.orderId;
      if (!orderId) {
        throw new Error("Failed to get order ID from server");
      }
      const razorpayOrderResponse = await API.post("/create-razorpay-order", {
        amount: finalTotal,
        orderId: orderId,
      });
      const { order } = razorpayOrderResponse.data;
      const key_id = order.key_id;
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Your Food Delivery App",
        description: "Food Order Payment",
        order_id: order.id,
        handler: (response) => handlePaymentSuccess(response, orderId),
        prefill: {
          name: user.name || "Customer",
          email: user.email || "customer@example.com",
          contact: user.phone || "9999999999",
        },
        notes: {
          order_id: orderId,
          customer_id: user.userId || user.id,
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: () =>
            handlePaymentFailure(
              { description: "Payment cancelled by user" },
              orderId
            ),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (error) => handlePaymentFailure(error, orderId));
      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed to initiate payment. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar2 />
      <div className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-8 text-center"
        >
          Your Cart
        </motion.h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl shadow-lg p-8 text-center"
                >
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add some delicious items to get started!
                  </p>
                  <button
                    onClick={() => navigate("/menu")}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-all"
                  >
                    Browse Menu
                  </button>
                </motion.div>
              ) : (
                <motion.div layout className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="flex">
                        <div className="w-1/3 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/assets/default-food.jpg";
                            }}
                          />
                        </div>
                        <div className="w-2/3 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{item.name}</p>
                              {item.addons && item.addons.length > 0 && (
                                <ul className="text-xs text-gray-500 list-disc ml-4 mt-1 space-y-0.5">
                                  {item.addons.map((ad) => (
                                    <li key={ad.id}>{ad.name} (+₹{ad.price})</li>
                                  ))}
                                </ul>
                              )}
                              <p className="text-gray-600 text-sm mt-1">
                                {item.description}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center border rounded-full overflow-hidden">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800"
                              >
                                -
                              </button>
                              <span className="px-4 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-800"
                              >
                                +
                              </button>
                            </div>
                            <span className="text-xl font-bold text-green-600">
                              Rs {item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Section */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-1/3"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">
                      {appliedCoupon?.code === "FREEDEL" ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `Rs ${deliveryFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">Rs {tax.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.description})</span>
                      <span>- Rs {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rs {finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                {/* Coupon Section */}
                <div className="mt-8">
                  {appliedCoupon ? (
                    <div className="bg-green-50 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-green-800">
                          {appliedCoupon.code} Applied
                        </p>
                        <p className="text-sm text-green-600">
                          {appliedCoupon.description}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : showCouponInput ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                          onClick={applyCoupon}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      onClick={() => setShowCouponInput(true)}
                      className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add coupon code
                    </button>
                  )}
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className={`mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing Payment...
                    </span>
                  ) : (
                    "Pay Now"
                  )}
                </button>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    🔒 Secure payment powered by Razorpay
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports UPI, Cards, Wallets & Net Banking
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
