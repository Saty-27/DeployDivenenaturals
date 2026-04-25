import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layout/admin-layout";
import { AlertTriangle } from "lucide-react";
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

export default function SubscriptionsAdmin() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    customerId: "",
    productId: "",
    quantity: "",
    frequency: "daily",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-subscriptions", statusFilter],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/subscriptions", { credentials: "include" });
        const data = res.ok ? await res.json() : [];
        return statusFilter ? data.filter((s: any) => s.status === statusFilter) : data;
      } catch {
        return [];
      }
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/customers", { credentials: "include" });
      return res.ok ? res.json() : [];
    },
  });

  const addSubscriptionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: data.customerId,
          productId: parseInt(data.productId),
          quantity: parseFloat(data.quantity),
          frequency: data.frequency,
          deliveryTime: "7-8 AM",
          startDate: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add subscription");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      toast({ title: "✅ Subscription added successfully!" });
      setShowForm(false);
      setFormData({ customerId: "", productId: "", quantity: "", frequency: "daily" });
      refetch();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete subscription");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
      toast({ title: "✅ Subscription deleted!" });
      refetch();
    },
    onError: (error: any) => {
      toast({ title: `❌ ${error.message}`, variant: "destructive" });
    },
  });

  const handleEditClick = (sub: any) => {
    setEditingId(sub.id);
    setFormData({
      customerId: sub.userId,
      productId: sub.productId.toString(),
      quantity: sub.quantity.toString(),
      frequency: sub.frequency,
    });
    setShowForm(true);
  };

  const totalSubs = subscriptions.length;
  const activeSubs = subscriptions.filter((s: any) => s.status === "ACTIVE").length;
  const pausedSubs = subscriptions.filter((s: any) => s.status === "PAUSED").length;
  const totalMilk = subscriptions.reduce((sum: number, s: any) => sum + parseFloat(s.quantity || "0"), 0);
  
  // Calculate daily totals by frequency
  const dailyTotal = subscriptions
    .filter((s: any) => s.status === "ACTIVE" && s.frequency === "daily")
    .reduce((sum: number, s: any) => sum + parseFloat(s.quantity || "0"), 0);
  const alternateDayTotal = subscriptions
    .filter((s: any) => s.status === "ACTIVE" && s.frequency === "alternate")
    .reduce((sum: number, s: any) => sum + parseFloat(s.quantity || "0"), 0);

  return (
    <AdminLayout>
      <div style={{ padding: "1.5rem" }}>
        {/* Header & Filters */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827", margin: 0 }}>
              🥛 Subscriptions Management
            </h2>
            <Button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: "0.5rem 1rem",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              ➕ Add Subscription
            </Button>
          </div>

          {/* Add/Edit Subscription Form */}
          {showForm && (
            <div style={{ background: "#f9fafb", border: "2px solid #16a34a", borderRadius: "0.5rem", padding: "1.5rem", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827", margin: "0 0 1rem 0" }}>
                {editingId ? "Edit Subscription" : "Add New Subscription"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Customer</label>
                  <select 
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "0.5rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Product</label>
                  <select 
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "0.5rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="">Select Product</option>
                    {products.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.price}/{p.unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Quantity (L)</label>
                  <Input 
                    type="number" 
                    step="0.5"
                    placeholder="1.5"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ fontSize: "0.875rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.875rem", color: "#6b7280", display: "block", marginBottom: "0.5rem" }}>Frequency</label>
                  <select 
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    style={{ 
                      width: "100%", 
                      padding: "0.5rem", 
                      border: "1px solid #d1d5db", 
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem"
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="alternate">Alternate Days</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button 
                  onClick={() => addSubscriptionMutation.mutate(formData)}
                  style={{ background: "#16a34a", color: "white", padding: "0.5rem 1rem" }}
                >
                  ✅ {editingId ? "Update" : "Add"} Subscription
                </Button>
                <Button 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ customerId: "", productId: "", quantity: "", frequency: "daily" });
                  }}
                  style={{ background: "#6b7280", color: "white", padding: "0.5rem 1rem" }}
                >
                  ✕ Cancel
                </Button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setStatusFilter("")}
              style={{
                padding: "0.5rem 1rem",
                background: !statusFilter ? "#16a34a" : "#e5e7eb",
                color: !statusFilter ? "white" : "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              All ({totalSubs})
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              style={{
                padding: "0.5rem 1rem",
                background: statusFilter === "ACTIVE" ? "#3b82f6" : "#e5e7eb",
                color: statusFilter === "ACTIVE" ? "white" : "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              ✅ Active ({activeSubs})
            </button>
            <button
              onClick={() => setStatusFilter("PAUSED")}
              style={{
                padding: "0.5rem 1rem",
                background: statusFilter === "PAUSED" ? "#f59e0b" : "#e5e7eb",
                color: statusFilter === "PAUSED" ? "white" : "#374151",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              ⏸ Paused ({pausedSubs})
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "white", border: "2px solid #3b82f6", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Subscriptions</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#3b82f6", margin: "0.5rem 0 0 0" }}>{totalSubs}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #10b981", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Active</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#10b981", margin: "0.5rem 0 0 0" }}>{activeSubs}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #f59e0b", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Paused</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f59e0b", margin: "0.5rem 0 0 0" }}>{pausedSubs}</p>
          </div>
          <div style={{ background: "white", border: "2px solid #ec4899", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Total Milk</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ec4899", margin: "0.5rem 0 0 0" }}>{totalMilk} L</p>
          </div>
          <div style={{ background: "white", border: "2px solid #8b5cf6", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Daily Requirement</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#8b5cf6", margin: "0.5rem 0 0 0" }}>{dailyTotal} L</p>
          </div>
          <div style={{ background: "white", border: "2px solid #06b6d4", borderRadius: "0.5rem", padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: 0 }}>Alternate Days</p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#06b6d4", margin: "0.5rem 0 0 0" }}>{alternateDayTotal} L</p>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div style={{ background: "white", borderRadius: "0.5rem", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflowX: "auto" }}>
          {isLoading ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Loading subscriptions...</p>
          ) : subscriptions.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>No subscriptions found</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#f3f4f6", borderBottom: "2px solid #e5e7eb" }}>
                <tr>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>ID</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Customer</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Product</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Quantity</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Frequency</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Status</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Started</th>
                  <th style={{ padding: "0.75rem", textAlign: "left", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontFamily: "monospace", color: "#3b82f6", fontWeight: "600" }}>
                      #{sub.id}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>
                      {sub.customer?.name || "Unknown"}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#374151" }}>
                      {sub.product?.name || "N/A"}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", fontWeight: "600", color: "#111827" }}>
                      {sub.quantity} L
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                      {sub.frequency}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "0.25rem",
                          background: sub.status === "ACTIVE" ? "#d1fae5" : "#fef3c7",
                          color: sub.status === "ACTIVE" ? "#065f46" : "#92400e",
                          fontWeight: "600",
                          fontSize: "0.75rem",
                        }}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", color: "#6b7280" }}>
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.875rem", display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEditClick(sub)}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600"
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(sub.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        style={{
                          padding: "0.25rem 0.75rem",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          fontSize: "0.75rem",
                          fontWeight: "600"
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-2 border-red-100 shadow-2xl rounded-3xl p-8">
          <AlertDialogHeader className="items-center text-center space-y-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <AlertTriangle className="w-10 h-10 text-red-600 animate-pulse" />
            </div>
            <AlertDialogTitle className="text-3xl font-black text-gray-900">Delete Subscription?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 text-lg font-medium">This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4 sm:justify-center">
            <AlertDialogCancel className="h-14 px-8 rounded-2xl border-2 border-gray-100 hover:bg-gray-50 font-bold text-gray-600 transition-all">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { if (itemToDelete) { deleteSubscriptionMutation.mutate(itemToDelete); setItemToDelete(null); } }}
              className="h-14 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black shadow-lg transition-all"
            >Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
