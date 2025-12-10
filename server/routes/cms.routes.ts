import { Router } from "express";
import { db } from "../db";
import { aboutUsSettings, contactSettings, termsOfServiceSettings, privacyPolicySettings } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Middleware to check if user is admin
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    if (req.session?.isAdminLoggedIn === true) return next();
    
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    
    if (req.session?.userRole === "admin") return next();
    
    const { users } = await import("@shared/schema");
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user?.role === "admin") {
      req.session.userRole = "admin";
      return next();
    }
    
    return res.status(403).json({ message: "Admin access required" });
  } catch (error) {
    return res.status(500).json({ message: "Error checking permissions" });
  }
};

// ============================================================================
// ABOUT US
// ============================================================================

// Public: Get About Us
router.get("/about-us/public", async (req, res) => {
  try {
    const [data] = await db.select().from(aboutUsSettings).where(eq(aboutUsSettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about us" });
  }
});

// Admin: Get About Us
router.get("/about-us", isAdmin, async (req, res) => {
  try {
    const [data] = await db.select().from(aboutUsSettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about us" });
  }
});

// Admin: Update About Us
router.put("/about-us", isAdmin, async (req, res) => {
  try {
    const { title, subtitle, content, imageUrl, mission, vision, values, isActive } = req.body;
    const [data] = await db.update(aboutUsSettings)
      .set({ title, subtitle, content, imageUrl, mission, vision, values, isActive, updatedAt: new Date() })
      .where(eq(aboutUsSettings.id, 1))
      .returning();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update about us" });
  }
});

// ============================================================================
// CONTACT
// ============================================================================

// Public: Get Contact
router.get("/contact/public", async (req, res) => {
  try {
    const [data] = await db.select().from(contactSettings).where(eq(contactSettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact info" });
  }
});

// Admin: Get Contact
router.get("/contact", isAdmin, async (req, res) => {
  try {
    const [data] = await db.select().from(contactSettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact info" });
  }
});

// Admin: Update Contact
router.put("/contact", isAdmin, async (req, res) => {
  try {
    const { title, subtitle, phone, email, address, businessHours, socialLinks, mapEmbedUrl, isActive } = req.body;
    const [data] = await db.update(contactSettings)
      .set({ title, subtitle, phone, email, address, businessHours, socialLinks, mapEmbedUrl, isActive, updatedAt: new Date() })
      .where(eq(contactSettings.id, 1))
      .returning();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update contact info" });
  }
});

// ============================================================================
// TERMS OF SERVICE
// ============================================================================

// Public: Get Terms of Service
router.get("/terms-of-service/public", async (req, res) => {
  try {
    const [data] = await db.select().from(termsOfServiceSettings).where(eq(termsOfServiceSettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch terms of service" });
  }
});

// Admin: Get Terms of Service
router.get("/terms-of-service", isAdmin, async (req, res) => {
  try {
    const [data] = await db.select().from(termsOfServiceSettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch terms of service" });
  }
});

// Admin: Update Terms of Service
router.put("/terms-of-service", isAdmin, async (req, res) => {
  try {
    const { title, content, sections, isActive } = req.body;
    const [data] = await db.update(termsOfServiceSettings)
      .set({ title, content, sections, isActive, updatedAt: new Date() })
      .where(eq(termsOfServiceSettings.id, 1))
      .returning();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update terms of service" });
  }
});

// ============================================================================
// PRIVACY POLICY
// ============================================================================

// Public: Get Privacy Policy
router.get("/privacy-policy/public", async (req, res) => {
  try {
    const [data] = await db.select().from(privacyPolicySettings).where(eq(privacyPolicySettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch privacy policy" });
  }
});

// Admin: Get Privacy Policy
router.get("/privacy-policy", isAdmin, async (req, res) => {
  try {
    const [data] = await db.select().from(privacyPolicySettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch privacy policy" });
  }
});

// Admin: Update Privacy Policy
router.put("/privacy-policy", isAdmin, async (req, res) => {
  try {
    const { title, content, sections, isActive } = req.body;
    const [data] = await db.update(privacyPolicySettings)
      .set({ title, content, sections, isActive, updatedAt: new Date() })
      .where(eq(privacyPolicySettings.id, 1))
      .returning();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update privacy policy" });
  }
});

export default router;
