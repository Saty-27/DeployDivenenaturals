import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MainPageLayout from "@/components/layout/main-page-layout";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        return products.find((p: Product) => p.id === parseInt(productId));
      } catch {
        return null;
      }
    },
    enabled: !!productId,
  });

  // Optimized add to cart with instant feedback
  const addToCartMutation = useMutation({
    mutationFn: async (qty: number) => {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product!.id, quantity: qty }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    },
    onMutate: async (qty) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);
      
      queryClient.setQueryData(["cart"], (old: any) => {
        const newItem = { id: Math.random(), cartId: 1, productId: product!.id, quantity: qty, price: product!.price, addedAt: new Date().toISOString() };
        return old ? [...old, newItem] : [newItem];
      });
      
      // Instant feedback
      toast({ title: "✅ Added!", description: `${product!.name} added to your cart` });
      setQuantity(1);
      
      return { previousCart };
    },
    onError: (_, __, context: any) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast({ title: "Error", description: "Please login to add items to cart", variant: "destructive" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const buyNowMutation = useMutation({
    mutationFn: async (qty: number) => {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product!.id, quantity: qty }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    },
    onMutate: () => {
      // Optimistic update
      const previousCart = queryClient.getQueryData(["cart"]);
      return { previousCart };
    },
    onError: (_, __, context: any) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSuccess: () => {
      setLocation("/checkout");
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate(quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    buyNowMutation.mutate(quantity);
  };

  if (isLoading) {
    return (
      <MainPageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-5xl mb-4">🥛</div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </MainPageLayout>
    );
  }

  if (!product) {
    return (
      <MainPageLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Product not found</p>
            <Button onClick={() => setLocation("/shop")}>← Back to Shop</Button>
          </div>
        </div>
      </MainPageLayout>
    );
  }

  return (
    <MainPageLayout>
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => setLocation("/shop")}
            variant="outline"
            className="mb-4"
          >
            ← Back to Shop
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center min-h-96">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <div className="text-8xl mb-4">🥛</div>
                <p className="text-gray-600">No image available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-semibold mb-2">
                {product.category.toUpperCase()}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-4xl font-bold text-green-600">₹{product.price}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description || "No description available"}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-2">
                Stock Available
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((product.stock / 100) * 100, 100)}%`,
                    }}
                  />
                </div>
                <p
                  className={`font-bold text-sm ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock} units
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-700 block mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1))
                      )
                    }
                    className="w-16 px-3 py-2 border border-gray-300 rounded text-center"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold text-lg"
              >
                🛒 Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold text-lg"
              >
                💳 Buy Now
              </Button>
            </div>

            {product.stock === 0 && (
              <p className="text-center text-red-600 font-bold mt-4">
                Out of Stock
              </p>
            )}
          </div>
        </div>
      </div>
    </MainPageLayout>
  );
}
