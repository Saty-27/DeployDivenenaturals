import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupAuthRoutes } from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import addressRoutes from "./routes/address.routes";
import orderRoutes from "./routes/order.routes";
import supportRoutes from "./routes/support.routes";
import offersRoutes from "./routes/offers.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import adminOrdersRoutes from "./routes/admin-orders.routes";
import adminSubscriptionsRoutes from "./routes/admin-subscriptions.routes";
import adminCustomersRoutes from "./routes/admin-customers.routes";
import billingRoutes from "./routes/billing.routes";
import adminBillingRoutes from "./routes/admin-billing.routes";
import rbacRoutes from "./routes/rbac.routes";
import bannersRoutes from "./routes/banners.routes";
import { requireAdminAccess } from "./middleware/auth";
import homepageRoutes from "./routes/homepage.routes";
import cmsRoutes from "./routes/cms.routes";
import { setupContactSubmissionsRoutes } from "./routes/contact-submissions.routes";
import { startDeliveryScheduler } from "./jobs/auto-delivery";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // Simple email/password auth routes (login/signup)
  setupAuthRoutes(app);
  
  // Contact submissions routes (public + admin)
  setupContactSubmissionsRoutes(app);

  // Start auto-delivery scheduler
  startDeliveryScheduler();

  // Domain-specific routes FIRST (before rbacRoutes catch-all)
  app.use('/api/cart', cartRoutes);
  app.use('/api/addresses', addressRoutes);
  app.use('/api/orders', orderRoutes);
  app.get('/api/admin/orders', requireAdminAccess, async (req: any, res) => {
    try {
      const { orders } = await import('@shared/schema');
      const { db } = await import('./db');
      const status = req.query.status as string;
      let allOrders = await db.select().from(orders);
      if (status) allOrders = allOrders.filter((o: any) => o.status === status);
      res.json(allOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post('/api/admin/orders/:id/update-status', requireAdminAccess, async (req: any, res) => {
    try {
      const { orders } = await import('@shared/schema');
      const { db } = await import('./db');
      const { eq } = await import('drizzle-orm');
      const orderId = parseInt(req.params.id);
      const { status, paymentStatus } = req.body;
      
      const updated = await storage.updateOrderStatus(orderId, status);
      
      if (paymentStatus) {
        await storage.updateOrderPayment(orderId, { paymentStatus });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete('/api/admin/orders/:id', requireAdminAccess, async (req: any, res) => {
    try {
      const { orders, orderItems } = await import('@shared/schema');
      const { db } = await import('./db');
      const { eq } = await import('drizzle-orm');
      const orderId = parseInt(req.params.id);
      await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
      const deleted = await db.delete(orders).where(eq(orders.id, orderId)).returning();
      if (!deleted.length) return res.status(404).json({ message: "Order not found" });
      res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order" });
    }
  });
  app.use('/api/admin/customers', adminCustomersRoutes);
  app.use('/api/admin/billing', adminBillingRoutes);
  app.use('/api/support', supportRoutes);
  app.use('/api/offers', offersRoutes);
  app.use('/api/subscriptions', subscriptionRoutes);
  app.use('/api/admin/subscriptions', adminSubscriptionsRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/banners', bannersRoutes);
  app.use('/api/homepage', homepageRoutes);
  app.use('/api/cms', cmsRoutes);

  // RBAC-protected routes LAST - catches remaining /api/* routes
  app.use('/api', rbacRoutes);

  // Auth user endpoint - returns real user data from database
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Notification routes - REAL DATABASE OPERATIONS
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // PDF invoice download route
  app.get('/api/bills/:billId/pdf', async (req: any, res) => {
    try {
      const billId = parseInt(req.params.billId);
      const { getBillInvoiceData, createInvoiceHTML } = await import('./utils/generateInvoice');
      
      const invoiceData = await getBillInvoiceData(billId);
      if (!invoiceData) {
        return res.status(404).json({ message: 'Bill not found' });
      }

      const html = createInvoiceHTML(invoiceData);
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="invoice_${billId}.html"`);
      res.send(html);
    } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).json({ message: 'Failed to generate invoice' });
    }
  });

  // Mark bill as paid (cash payment)
  app.post('/api/billing/:billId/mark-paid', async (req: any, res) => {
    try {
      const billId = parseInt(req.params.billId);
      const userId = req.session?.userId || req.user?.claims?.sub;
      
      const { bills } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      const { db } = await import('./db');
      const bill = await db.select().from(bills).where(eq(bills.id, billId));
      
      if (!bill.length || bill[0].userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const updated = await db.update(bills).set({
        status: 'paid',
        paymentDate: new Date(),
        paymentMethod: 'cash'
      }).where(eq(bills.id, billId)).returning();

      res.json(updated[0]);
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      res.status(500).json({ message: 'Failed to mark bill as paid' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
