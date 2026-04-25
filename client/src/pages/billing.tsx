import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import MainPageLayout from "@/components/layout/main-page-layout";
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  Package, 
  Settings, 
  History, 
  Inbox,
  Download,
  CreditCard as CreditCardIcon,
  ChevronDown,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

export default function BillingPage() {
  const [expandedSections, setExpandedSections] = useState({
    subscriptions: true,
    orders: false,
    adjustments: false,
  });
  const { toast } = useToast();

  // Mock current bill data
  const currentBill = {
    month: "December 2025",
    amount: 2690,
    penalty: 50,
    previousDue: 100,
    status: "PENDING", // PAID, PENDING, OVERDUE
    dueDate: "2025-01-05",
    daysLeft: 3,
    subscriptionItems: [
      { name: "Milk (Subscription)", quantity: 30, rate: 60, total: 1800 },
      { name: "Ghee (Order)", quantity: 1, rate: 350, total: 350 },
      { name: "Paneer (Order)", quantity: 2, rate: 220, total: 440 },
    ],
    adjustments: [
      { type: "Previous Dues", amount: 100 },
      { type: "Penalty", amount: 50 },
    ],
  };

  // Mock history data
  const billHistory = [
    {
      month: "November 2025",
      amount: 3120,
      paidDate: "2025-12-01",
      status: "PAID",
    },
    {
      month: "October 2025",
      amount: 2890,
      paidDate: "2025-11-02",
      status: "PAID",
    },
    {
      month: "September 2025",
      amount: 2650,
      paidDate: "2025-10-01",
      status: "PAID",
    },
    {
      month: "August 2025",
      amount: 2100,
      paidDate: "2025-09-01",
      status: "PAID",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return { bg: "#dcfce7", text: "#15803d", icon: <CheckCircle2 className="w-4 h-4" />, label: "PAID" };
      case "PENDING":
        return {
          bg: "#fef9c3",
          text: "#ca8a04",
          icon: <Clock className="w-4 h-4" />,
          label: "PENDING",
        };
      case "OVERDUE":
        return { bg: "#fee2e2", text: "#b91c1c", icon: <AlertCircle className="w-4 h-4" />, label: "OVERDUE" };
      default:
        return { bg: "#f3f4f6", text: "#6b7280", icon: <HelpCircle className="w-4 h-4" />, label: "UNKNOWN" };
    }
  };

  const statusStyle = getStatusBadge(currentBill.status);

  return (
    <MainPageLayout>
      <div style={{ backgroundColor: "#f3f4f6" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #16a34a 0%, #3b82f6 100%)",
            color: "white",
            padding: "24px",
            borderBottom: "none",
            borderRadius: "0 0 16px 16px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "12px" }}>
              <Receipt className="w-8 h-8" /> Monthly Billing
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.9)", margin: 0 }}>
              View and manage your dairy bills • Billing for: {currentBill.month}
            </p>
          </div>
        </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* CURRENT MONTH BILL CARD */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                {currentBill.month} Bill
              </h2>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                Status: {statusStyle.icon} {statusStyle.label}
              </p>
            </div>
            <div
              style={{
                background: statusStyle.bg,
                color: statusStyle.text,
                padding: "8px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {statusStyle.icon} {statusStyle.label}
            </div>
          </div>

          {/* Amount Display */}
          <div
            style={{
              background: "#f9fafb",
              padding: "20px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                fontWeight: "700",
                color: "#16a34a",
                margin: "0 0 8px 0",
              }}
            >
              ₹{currentBill.amount.toLocaleString()}
            </div>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Total Amount to Pay
            </p>
          </div>

          {/* Due Date & Days Left */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                Due Date
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: 0,
                }}
              >
                {new Date(currentBill.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                Remaining Days
              </p>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: currentBill.daysLeft <= 0 ? "#ef4444" : "#16a34a",
                  margin: 0,
                }}
              >
                {currentBill.daysLeft} days left
              </p>
            </div>
          </div>

          {/* Penalty Alert */}
          {currentBill.penalty > 0 && (
            <div
              style={{
                background: "#fef9c3",
                border: "1px solid #fcd34d",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              <p style={{ fontSize: "13px", color: "#ca8a04", margin: 0 }}>
                ⚠️ Late Fee Added: ₹{currentBill.penalty}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexDirection: "column",
            }}
          >
            <button
              onClick={() =>
                toast({
                  title: "Razorpay payment redirect would happen here",
                })
              }
              style={{
                width: "100%",
                padding: "14px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#15803d")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#16a34a")}
            >
              <CreditCardIcon className="w-5 h-5" /> Pay Now Online
            </button>
            <button
              onClick={() =>
                toast({ title: "PDF download initiated" })
              }
              style={{
                width: "100%",
                padding: "14px",
                background: "white",
                color: "#3b82f6",
                border: "2px solid #3b82f6",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.3s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#dbeafe";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "white";
              }}
            >
              <Download className="w-5 h-5" /> Download Invoice PDF
            </button>
          </div>

          {/* Payment Methods */}
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#f9fafb",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
              Accepted Payment Methods: UPI • Google Pay • PhonePe • Paytm • Card • Net Banking
            </p>
          </div>
        </div>

        {/* BILL BREAKDOWN SECTION */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "16px" }}>
            🧩 Bill Breakdown
          </h2>

          {/* Subscription Deliveries */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              marginBottom: "12px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() =>
                setExpandedSections({
                  ...expandedSections,
                  subscriptions: !expandedSections.subscriptions,
                })
              }
              style={{
                width: "100%",
                padding: "16px",
                background: "#f9fafb",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Package className="w-4 h-4 text-green-600" /> Subscription Deliveries
              </span>
              <span>{expandedSections.subscriptions ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
            </button>
            {expandedSections.subscriptions && (
              <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  <span>Item</span>
                  <span>Quantity</span>
                  <span>Rate</span>
                  <span>Total</span>
                </div>
                {currentBill.subscriptionItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "14px",
                      color: "#374151",
                      borderBottom:
                        idx < currentBill.subscriptionItems.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>₹{item.rate}</span>
                    <span style={{ fontWeight: "600" }}>₹{item.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Adjustments */}
          <div
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              marginBottom: "12px",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() =>
                setExpandedSections({
                  ...expandedSections,
                  adjustments: !expandedSections.adjustments,
                })
              }
              style={{
                width: "100%",
                padding: "16px",
                background: "#f9fafb",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Settings className="w-4 h-4 text-blue-600" /> Adjustments & Discounts
              </span>
              <span>{expandedSections.adjustments ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</span>
            </button>
            {expandedSections.adjustments && (
              <div style={{ padding: "16px", borderTop: "1px solid #e5e7eb" }}>
                {currentBill.adjustments.map((adj, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "14px",
                      color: "#374151",
                      borderBottom:
                        idx < currentBill.adjustments.length - 1
                          ? "1px solid #f3f4f6"
                          : "none",
                    }}
                  >
                    <span>{adj.type}</span>
                    <span
                      style={{
                        fontWeight: "600",
                        color: adj.type.includes("Discount") ? "#10b981" : "#ef4444",
                      }}
                    >
                      {adj.type.includes("Discount") ? "-" : "+"}₹{adj.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BILLING HISTORY TABLE */}
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <History className="w-5 h-5 text-gray-400" /> Previous Bills
          </h2>

          {billHistory.length === 0 ? (
            <div
              style={{
                background: "white",
                padding: "60px 40px",
                borderRadius: "12px",
                textAlign: "center",
                color: "#6b7280",
                border: "1px dashed #e5e7eb"
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <Inbox size={48} color="#cbd5e1" />
              </div>
              <p style={{ fontSize: "16px", margin: 0, fontWeight: "600" }}>
                No previous bills yet.
              </p>
              <p style={{ fontSize: "14px", margin: "8px 0 0 0" }}>
                You will see past bills here once generated.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                }}
              >
                <thead>
                  <tr style={{ background: "#f3f4f6" }}>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "2px solid #e5e7eb",
                      }}
                    >
                      Month
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "2px solid #e5e7eb",
                      }}
                    >
                      Bill Amount
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "2px solid #e5e7eb",
                      }}
                    >
                      Paid Date
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "2px solid #e5e7eb",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                        borderBottom: "2px solid #e5e7eb",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billHistory.map((bill, idx) => {
                    const badgeStyle = getStatusBadge(bill.status);
                    return (
                      <tr
                        key={idx}
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#f9fafb")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <td
                          style={{
                            padding: "12px 16px",
                            fontSize: "14px",
                            color: "#111827",
                            fontWeight: "500",
                          }}
                        >
                          {bill.month}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#16a34a",
                            textAlign: "right",
                          }}
                        >
                          ₹{bill.amount.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            fontSize: "13px",
                            color: "#6b7280",
                            textAlign: "center",
                          }}
                        >
                          {new Date(bill.paidDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          <span
                            style={{
                              background: badgeStyle.bg,
                              color: badgeStyle.text,
                              padding: "6px 10px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              width: "fit-content",
                              margin: "0 auto"
                            }}
                          >
                            {badgeStyle.icon} {bill.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            textAlign: "center",
                          }}
                        >
                          <button
                            onClick={() =>
                              toast({
                                title: `View bill for ${bill.month}`,
                              })
                            }
                            style={{
                              background: "none",
                              border: "none",
                              color: "#3b82f6",
                              fontSize: "13px",
                              fontWeight: "600",
                              cursor: "pointer",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              transition: "background 0.2s",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.background = "#dbeafe")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.background = "none")
                            }
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

        {/* Bottom Navigation */}
        <div
          style={{
            marginTop: "32px",
            padding: "20px",
            background: "white",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
          }}
        >
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px" }}>
            Need help with your bills?
          </p>
          <Link href="/home">
            <a style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "8px", 
              color: "#16a34a", 
              fontWeight: "600",
              textDecoration: "none"
            }}>
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </a>
          </Link>
        </div>
      </div>
    </MainPageLayout>
  );
}
