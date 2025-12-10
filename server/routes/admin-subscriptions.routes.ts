import { Router } from "express";
import { db } from "../db";
import { milkSubscriptions, subscriptionDeliveries, users, products } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Helper function to check admin session
async function checkAdminAuth(req: any, res: any): Promise<boolean> {
  if (req.session?.isAdminLoggedIn) {
    return true;
  }
  const userId = req.session?.userId || req.user?.claims?.sub;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (user?.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return false;
  }
  return true;
}

// Admin: Get all subscriptions
router.get("/", async (req: any, res) => {
  try {
    if (!(await checkAdminAuth(req, res))) return;

    const allSubs = await db.select().from(milkSubscriptions);
    
    const withDetails = await Promise.all(
      allSubs.map(async (sub) => {
        const customer = await db.query.users.findFirst({
          where: eq(users.id, sub.userId),
        });
        const product = await db.query.products.findFirst({
          where: eq(products.id, sub.productId),
        });
        return { ...sub, customer, product };
      })
    );

    res.json(withDetails);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});

// Admin: Get expected daily milk requirement
router.get("/today/requirement", async (req: any, res) => {
  try {
    if (!(await checkAdminAuth(req, res))) return;

    const today = new Date().toISOString().split("T")[0];
    const deliveries = await db
      .select()
      .from(subscriptionDeliveries)
      .where(eq(subscriptionDeliveries.deliveryDate, new Date(today)));

    const totalRequired = deliveries.reduce((sum, d) => sum + parseFloat(d.quantity.toString()), 0);

    res.json({
      date: today,
      totalRequired,
      deliveryCount: deliveries.length,
      deliveries,
    });
  } catch (error) {
    console.error("Error fetching daily requirement:", error);
    res.status(500).json({ message: "Failed to fetch daily requirement" });
  }
});

// Admin: Pause/Resume subscription
router.patch("/:id/status", async (req: any, res) => {
  try {
    if (!(await checkAdminAuth(req, res))) return;

    const subId = parseInt(req.params.id);
    const { status } = req.body;

    const updated = await db
      .update(milkSubscriptions)
      .set({ status })
      .where(eq(milkSubscriptions.id, subId))
      .returning();

    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});

// Admin: Create subscription for a customer
router.post("/", async (req: any, res) => {
  try {
    if (!(await checkAdminAuth(req, res))) return;

    const { userId, productId, quantity, frequency, deliveryTime, startDate } = req.body;
    
    if (!userId || !productId) {
      return res.status(400).json({ message: "Customer and Product are required" });
    }

    const productIdInt = parseInt(productId);
    const product = await db.query.products.findFirst({
      where: eq(products.id, productIdInt),
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newSub = await db.insert(milkSubscriptions).values({
      userId,
      productId: productIdInt,
      quantity: parseFloat(quantity || "1").toString(),
      frequency: frequency || "daily",
      deliveryTime: deliveryTime || "7-8 AM",
      startDate: startDate ? new Date(startDate) : new Date(),
      status: "ACTIVE",
      isActive: true,
      isPaused: false,
      pricePerL: product.price,
      nextDeliveryDate: startDate ? new Date(startDate) : new Date(),
    }).returning();

    res.status(201).json({ message: "Subscription created", subscription: newSub[0] });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// Admin: Delete subscription
router.delete("/:id", async (req: any, res) => {
  try {
    if (!(await checkAdminAuth(req, res))) return;

    const subId = parseInt(req.params.id);
    const deleted = await db.delete(milkSubscriptions).where(eq(milkSubscriptions.id, subId)).returning();

    if (!deleted.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json({ message: "Subscription deleted", subscription: deleted[0] });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).json({ message: "Failed to delete subscription" });
  }
});

export default router;
