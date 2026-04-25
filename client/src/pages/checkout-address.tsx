import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import MainPageLayout from "@/components/layout/main-page-layout";
import { Banknote, CreditCard, Mail, Phone, MapPin } from "lucide-react";

interface CartItem {
  id: number;
  quantity: number;
  product?: {
    name: string;
    price: number;
  };
}

interface User {
  id?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: string;
}

export default function CheckoutAddressPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState<User>({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart items
  const { data: cartItems = [] } = useQuery({
    queryKey: ["cart_items"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : (data.items || []);
      } catch {
        return [];
      }
    },
  });

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/auth/current-user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const total = Array.isArray(cartItems)
    ? cartItems.reduce((sum: number, item: any) => {
        const itemPrice = item.product?.price || 0;
        return sum + itemPrice * (item.quantity || 1);
      }, 0)
    : 0;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!userInfo.phone || !userInfo.address) {
      toast({
        title: "Error",
        description: "Please fill in phone and address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total: total,
          paymentMethod: paymentMethod,
          paymentStatus: "pending",
          userInfo: userInfo,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        toast({
          title: "✅ Order Placed Successfully!",
          description: `Order ID: ${order.id}`,
        });
        
        await fetch("/api/cart", { method: "DELETE", credentials: "include" });
        setTimeout(() => setLocation("/orders"), 1500);
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <MainPageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </MainPageLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <MainPageLayout>
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Button
              onClick={() => setLocation("/shop")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </MainPageLayout>
    );
  }

  return (
    <MainPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Information</h2>
                  <Button
                    onClick={() => setEditMode(!editMode)}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    {editMode ? "Save" : "Edit"}
                  </Button>
                </div>

                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">First Name</label>
                        <input
                          type="text"
                          value={userInfo.firstName || ""}
                          onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-green-600 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Last Name</label>
                        <input
                          type="text"
                          value={userInfo.lastName || ""}
                          onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-green-600 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Email</label>
                      <input
                        type="email"
                        value={userInfo.email || ""}
                        disabled
                        className="w-full px-4 py-2 border border-gray-100 rounded-xl bg-gray-50 cursor-not-allowed text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Phone *</label>
                      <input
                        type="tel"
                        value={userInfo.phone || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-green-600 outline-none transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Delivery Address *</label>
                      <textarea
                        value={userInfo.address || ""}
                        onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-green-600 outline-none transition-all resize-none"
                        placeholder="Enter full delivery address with landmark"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                    <p className="text-xl font-bold text-gray-900">{userInfo.firstName || "Customer"} {userInfo.lastName || ""}</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span>{userInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-4 h-4 text-green-600" />
                        <span>{userInfo.phone || "No phone added"}</span>
                      </div>
                      <div className="flex items-start gap-3 text-gray-600">
                        <MapPin className="w-4 h-4 text-green-600 mt-1" />
                        <span className="flex-1">{userInfo.address || "No address added"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items Summary */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600 font-bold">
                          {item.quantity}x
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.product?.name}</p>
                          <p className="text-gray-500 text-xs">Fresh Quality Product</p>
                        </div>
                      </div>
                      <p className="font-bold text-gray-900">
                        ₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label 
                    className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === "cash" ? "border-green-600 bg-green-50/50 shadow-md" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 accent-green-600"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Banknote className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Cash on Delivery</p>
                        <p className="text-gray-500 text-xs">Pay at your doorstep</p>
                      </div>
                    </div>
                  </label>

                  <label 
                    className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === "razorpay" ? "border-green-600 bg-green-50/50 shadow-md" : "border-gray-100 hover:border-gray-200"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 accent-green-600"
                    />
                    <div className="ml-4 flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Razorpay</p>
                        <p className="text-gray-500 text-xs">Secure Online Payment</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 border-b border-gray-100 pb-6 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charge</span>
                    <span className="text-green-600 font-bold uppercase text-sm">Free</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="text-3xl font-black text-green-600">₹{total.toLocaleString()}</span>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || editMode || !userInfo.phone || !userInfo.address}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:bg-gray-200 disabled:transform-none"
                >
                  {isProcessing ? "Processing..." : "Confirm Order"}
                </Button>
                {(!userInfo.phone || !userInfo.address) && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-600 text-xs font-bold">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    Delivery details required
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
}
