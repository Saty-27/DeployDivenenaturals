import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Package, Plus, Trash2, Edit, X, AlertTriangle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/admin-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProductsAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    type: "DAIRY",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    unit: "L",
    redirectUrl: "",
    active: true,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [] } = useQuery({
    queryKey: ["admin_products_view"],
    queryFn: async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["admin_categories_list"],
    queryFn: async () => {
      const res = await fetch("/api/categories", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products_view"] });
      toast({ title: "✅ Product added successfully!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/admin/products/${editingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products_view"] });
      toast({ title: "✅ Product updated successfully!" });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_products_view"] });
      toast({ title: "✅ Product deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      type: "DAIRY",
      price: "",
      stock: "",
      description: "",
      imageUrl: "",
      unit: "L",
      redirectUrl: "",
      active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name || "",
      category: product.category || "",
      type: product.type || "DAIRY",
      price: product.price?.toString() || "",
      stock: product.stock?.toString() || "",
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      unit: product.unit || "L",
      redirectUrl: product.redirectUrl || "",
      active: product.isActive,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleGenerateAIImage = async () => {
    if (!formData.name) {
      toast({ title: "⚠️ Product name required", description: "Please enter a product name first to generate an image.", variant: "destructive" });
      return;
    }

    try {
      toast({ title: "✨ Generating Image...", description: "AI is creating a premium product image for you." });
      
      const res = await fetch("/api/admin/generate-ai-image", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Professional high-end studio photography of ${formData.name}. ${formData.description || ''}. Pure, clean, organic dairy product aesthetic, soft lighting, 4k, hyper-realistic.`,
          productName: formData.name
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      
      const data = await res.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      toast({ title: "✅ AI Image Generated!", description: "The image has been added to your product." });
    } catch (err) {
      toast({ title: "❌ Generation failed", description: "Please try again later.", variant: "destructive" });
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price || formData.stock === "" || !formData.unit) {
      toast({ title: "⚠️ Please fill all required fields", variant: "destructive" });
      return;
    }

    const payload = {
      name: formData.name,
      category: formData.category,
      type: formData.type,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      description: formData.description,
      imageUrl: formData.imageUrl,
      unit: formData.unit,
      redirectUrl: formData.redirectUrl,
      isActive: formData.active,
    };

    if (editingId) {
      updateProductMutation.mutate(payload);
    } else {
      addProductMutation.mutate(payload);
    }
  };

  const isLoading = addProductMutation.isPending || updateProductMutation.isPending || deleteProductMutation.isPending;

  return (
    <AdminLayout>
      {/* Add/Edit Product Form */}
      {showForm && (
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "2px solid #16a34a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              {editingId ? "✏️ Edit Product" : "➕ New Product"}
            </h3>
            <button onClick={resetForm} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem" }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Product Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Fresh Toned Milk"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) && categories.map((c: any) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Price (₹) *
              </label>
              <input
                type="number"
                placeholder="e.g. 50"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Stock Units *
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Product Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, unit: e.target.value === "MILK" ? "L" : "pack" })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              >
                <option value="MILK">🥛 Milk</option>
                <option value="DAIRY">🧀 Dairy</option>
                <option value="OIL">🫗 Oil</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Unit *
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              >
                <option value="L">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="pack">Pack</option>
                <option value="pc">Piece</option>
              </select>
            </div>
            
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Redirect Hyperlink (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. https://example.com/special-offer"
                value={formData.redirectUrl}
                onChange={(e) => setFormData({ ...formData, redirectUrl: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                If provided, clicking the product on the shop page will open this link instead of the product detail page.
              </p>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Product Image
              </label>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="e.g. https://... or /uploads/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  style={{ flex: 1, padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
                />
                <div style={{ position: "relative" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      if (file.size > 500 * 1024) {
                        toast({ title: "❌ File too large", description: "Image must be less than 500KB", variant: "destructive" });
                        return;
                      }

                      const formDataUpload = new FormData();
                      formDataUpload.append("image", file);

                      try {
                        toast({ title: "⏳ Uploading...", description: "Please wait while we upload your image" });
                        const res = await fetch("/api/admin/upload-product-image", {
                          method: "POST",
                          body: formDataUpload,
                        });
                        
                        if (!res.ok) throw new Error("Upload failed");
                        
                        const data = await res.json();
                        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
                        toast({ title: "✅ Uploaded!", description: "Image uploaded successfully" });
                      } catch (err) {
                        toast({ title: "❌ Upload failed", description: "Please try again", variant: "destructive" });
                      }
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                      width: "100%",
                      zIndex: 10
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    📁 Upload Local
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateAIImage}
                    disabled={isLoading}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      cursor: isLoading ? "not-allowed" : "pointer"
                    }}
                  >
                    <Sparkles size={16} /> ✨ Generate with AI
                  </button>
                </div>
              </div>
              {formData.imageUrl && (
                <div style={{ marginTop: "0.5rem", position: "relative", width: "100px", height: "100px" }}>
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} 
                  />
                  <button 
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "12px", display: "flex", alignItems: "center", justifyCenter: "center", cursor: "pointer" }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
                Status
              </label>
              <select
                value={formData.active ? "active" : "inactive"}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === "active" })}
                style={{ width: "100%", padding: "0.5rem", border: "1px solid #d1d5db", borderRadius: "0.5rem", fontSize: "0.875rem", boxSizing: "border-box" }}
              >
                <option value="active">✅ Active</option>
                <option value="inactive">❌ Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", color: "#374151" }}>
              Description
            </label>
            <textarea
              placeholder="Product details and benefits..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                minHeight: "100px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: "0.5rem 1.5rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Processing..." : editingId ? "💾 Update" : "✅ Add"}
            </button>
            <button
              onClick={resetForm}
              style={{
                padding: "0.5rem 1.5rem",
                background: "#e5e7eb",
                color: "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>📦 Products</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "0.5rem 1rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus size={18} /> Add Product
            </button>
          )}
        </div>

        {Array.isArray(products) && products.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Name</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Category</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Price</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Stock</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Status</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Active</th>
                  <th style={{ padding: "1rem", textAlign: "left", fontWeight: "bold", color: "#374151" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "1rem", fontWeight: "500" }}>{p.name}</td>
                    <td style={{ padding: "1rem", color: "#6b7280" }}>{p.category || "N/A"}</td>
                    <td style={{ padding: "1rem", color: "#16a34a", fontWeight: "600" }}>₹{p.price}</td>
                    <td style={{ padding: "1rem" }}>{p.stock} units</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700", background: p.stock > 50 ? "#dcfce7" : p.stock > 0 ? "#fef3c7" : "#fee2e2", color: p.stock > 50 ? "#166534" : p.stock > 0 ? "#92400e" : "#991b1b" }}>
                        {p.stock > 50 ? "✅ In Stock" : p.stock > 0 ? "⚠️ Low" : "❌ Out"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "700", background: p.isActive !== false ? "#dcfce7" : "#fee2e2", color: p.isActive !== false ? "#166534" : "#991b1b" }}>
                        {p.isActive !== false ? "✅ Active" : "❌ Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(p)}
                        disabled={isLoading}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#dbeafe",
                          color: "#1e40af",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(p.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        disabled={isLoading}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#fee2e2",
                          color: "#991b1b",
                          border: "none",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
            No products found. Click "Add Product" to create one.
          </p>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-red-100 shadow-2xl rounded-3xl p-8">
          <AlertDialogHeader className="items-center text-center space-y-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
            </div>
            <AlertDialogTitle className="text-3xl font-black text-gray-900">Delete Product?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-lg font-medium">This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4 sm:justify-center">
            <AlertDialogCancel className="h-14 px-8 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 font-bold text-gray-600 transition-all">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { if (itemToDelete) { deleteProductMutation.mutate(itemToDelete); setItemToDelete(null); } }}
              className="h-14 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg transition-all"
            >Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
