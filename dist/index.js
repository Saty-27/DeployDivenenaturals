var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  aboutUsSettings: () => aboutUsSettings,
  addresses: () => addresses,
  addressesRelations: () => addressesRelations,
  admins: () => admins,
  adminsRelations: () => adminsRelations,
  banners: () => banners,
  bills: () => bills,
  billsRelations: () => billsRelations,
  cart: () => cart,
  cartItems: () => cartItems,
  cartItemsRelations: () => cartItemsRelations,
  cartRelations: () => cartRelations,
  categories: () => categories,
  contactSettings: () => contactSettings,
  contactSubmissions: () => contactSubmissions,
  delegationLogs: () => delegationLogs,
  deliveryAssignments: () => deliveryAssignments,
  deliveryPartners: () => deliveryPartners,
  deliveryPartnersRelations: () => deliveryPartnersRelations,
  drivers: () => drivers,
  driversRelations: () => driversRelations,
  ethosCards: () => ethosCards,
  faqs: () => faqs2,
  footerSettings: () => footerSettings,
  homepageSections: () => homepageSections,
  insertAddressSchema: () => insertAddressSchema,
  insertBannerSchema: () => insertBannerSchema,
  insertContactSubmissionSchema: () => insertContactSubmissionSchema,
  insertHomepageSectionSchema: () => insertHomepageSectionSchema,
  insertMilkSubscriptionSchema: () => insertMilkSubscriptionSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  insertSiteSettingsSchema: () => insertSiteSettingsSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertSupportTicketSchema: () => insertSupportTicketSchema,
  insertTicketMessageSchema: () => insertTicketMessageSchema,
  milkSubscriptions: () => milkSubscriptions,
  newsletterSettings: () => newsletterSettings,
  notifications: () => notifications,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  privacyPolicySettings: () => privacyPolicySettings,
  productDeals: () => productDeals,
  productVendors: () => productVendors,
  productVendorsRelations: () => productVendorsRelations,
  products: () => products,
  sessions: () => sessions,
  siteSettings: () => siteSettings,
  statsCounters: () => statsCounters,
  subscriptionDeliveries: () => subscriptionDeliveries,
  subscriptionDeliveriesRelations: () => subscriptionDeliveriesRelations,
  subscriptionsRelations: () => subscriptionsRelations,
  supportTickets: () => supportTickets,
  termsOfServiceSettings: () => termsOfServiceSettings,
  ticketMessages: () => ticketMessages,
  users: () => users2,
  vendors: () => vendors,
  vendorsRelations: () => vendorsRelations
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var sessions, users2, categories, products, vendors, deliveryPartners, deliveryAssignments, drivers, admins, delegationLogs, orders, orderItems, milkSubscriptions, subscriptionDeliveries, cart, cartItems, addresses, supportTickets, ticketMessages, productVendors, notifications, bills, subscriptionsRelations, subscriptionDeliveriesRelations, ordersRelations, orderItemsRelations, vendorsRelations, deliveryPartnersRelations, driversRelations, adminsRelations, cartRelations, cartItemsRelations, addressesRelations, productVendorsRelations, billsRelations, banners, homepageSections, ethosCards, productDeals, statsCounters, faqs2, newsletterSettings, footerSettings, aboutUsSettings, contactSettings, termsOfServiceSettings, privacyPolicySettings, siteSettings, contactSubmissions, insertAddressSchema, insertOrderSchema, insertSubscriptionSchema, insertMilkSubscriptionSchema, insertSupportTicketSchema, insertTicketMessageSchema, insertProductSchema, insertBannerSchema, insertHomepageSectionSchema, insertContactSubmissionSchema, insertSiteSettingsSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users2 = pgTable("users", {
      id: varchar("id").primaryKey().notNull(),
      email: varchar("email").unique(),
      passwordHash: varchar("password_hash"),
      // For simple email/password auth
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      profileImageUrl: varchar("profile_image_url"),
      phone: varchar("phone"),
      address: text("address"),
      gender: varchar("gender"),
      // male, female, other
      dob: date("dob"),
      // date of birth for STAGE 1
      role: varchar("role").notNull().default("customer"),
      // customer, admin, vendor, delivery, marketing_staff
      isActive: boolean("is_active").default(true),
      walletBalance: decimal("wallet_balance", { precision: 10, scale: 2 }).default("0"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    categories = pgTable("categories", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull().unique(),
      description: text("description"),
      icon: varchar("icon"),
      // emoji or icon name - kept for compatibility, can store image URLs too
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    products = pgTable("products", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      sku: varchar("sku").unique(),
      description: text("description"),
      category: varchar("category").notNull(),
      // References categories.name
      type: varchar("type").notNull(),
      // MILK, DAIRY
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      unit: varchar("unit").notNull(),
      // L, kg, g, piece
      stock: integer("stock").default(0),
      expiryDate: date("expiry_date"),
      imageUrl: varchar("image_url"),
      isActive: boolean("is_active").default(true),
      isNew: boolean("is_new").default(false),
      // Flag for "Newly Launched" section
      isFeatured: boolean("is_featured").default(false),
      // Flag for featured products
      launchedAt: timestamp("launched_at"),
      // When product was launched (for sorting new products)
      redirectUrl: varchar("redirect_url"),
      createdAt: timestamp("created_at").defaultNow()
    });
    vendors = pgTable("vendors", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id),
      businessName: varchar("business_name").notNull(),
      licenseNumber: varchar("license_number"),
      locationName: varchar("location_name").notNull(),
      // Borivali, Santa Cruz, Andheri etc.
      vendorType: varchar("vendor_type").notNull().default("SUB_VENDOR"),
      // HEAD_VENDOR, VENDOR, SUB_VENDOR
      headVendorId: integer("head_vendor_id"),
      // self-reference, will add constraint later
      parentVendorId: integer("parent_vendor_id"),
      // self-reference, will add constraint later
      dailyCapacity: integer("daily_capacity"),
      // in liters
      currentQuota: integer("current_quota").default(0),
      requirementToday: integer("requirement_today").default(0),
      requirementTomorrowForecast: integer("requirement_tomorrow_forecast").default(0),
      circulatedLiters: integer("circulated_liters").default(0),
      revenueToday: decimal("revenue_today", { precision: 10, scale: 2 }).default("0"),
      revenueTotal: decimal("revenue_total", { precision: 10, scale: 2 }).default("0"),
      paymentsPending: decimal("payments_pending", { precision: 10, scale: 2 }).default("0"),
      weeklyEarnings: decimal("weekly_earnings", { precision: 10, scale: 2 }).default("0"),
      monthlyEarnings: decimal("monthly_earnings", { precision: 10, scale: 2 }).default("0"),
      zone: varchar("zone"),
      isVerified: boolean("is_verified").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    deliveryPartners = pgTable("delivery_partners", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id),
      fullName: varchar("full_name").notNull(),
      email: varchar("email"),
      phone: varchar("phone").notNull().unique(),
      username: varchar("username").unique(),
      passwordHash: varchar("password_hash"),
      initialPassword: varchar("initial_password"),
      // Plain password for display only (admin use)
      aadhaarNumber: varchar("aadhaar_number"),
      panNumber: varchar("pan_number"),
      dob: date("dob"),
      vehicleType: varchar("vehicle_type"),
      licenseNumber: varchar("license_number"),
      address: text("address"),
      zone: varchar("zone"),
      status: varchar("status").default("active"),
      // active, blocked, suspended, pending_verification
      isVerified: boolean("is_verified").default(false),
      isAvailable: boolean("is_available").default(true),
      createdAt: timestamp("created_at").defaultNow()
    });
    deliveryAssignments = pgTable("delivery_assignments", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id),
      subscriptionId: integer("subscription_id").references(() => milkSubscriptions.id),
      partnerId: integer("partner_id").references(() => deliveryPartners.id),
      assignmentDate: date("assignment_date"),
      status: varchar("status").default("pending"),
      // pending, out_for_delivery, delivered, failed
      codAmount: decimal("cod_amount", { precision: 10, scale: 2 }).default("0"),
      collectionStatus: varchar("collection_status").default("pending"),
      // pending, received, not_received
      collectedCash: decimal("collected_cash", { precision: 10, scale: 2 }).default("0"),
      failedReason: varchar("failed_reason"),
      failedPhoto: text("failed_photo"),
      timeStarted: timestamp("time_started"),
      timeDelivered: timestamp("time_delivered"),
      customerInstructions: text("customer_instructions"),
      createdAt: timestamp("created_at").defaultNow()
    });
    drivers = pgTable("drivers", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      age: integer("age").notNull(),
      phone: varchar("phone").notNull(),
      aadharUrl: varchar("aadhar_url"),
      // optional KYC document
      panUrl: varchar("pan_url"),
      // optional KYC document
      vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    admins = pgTable("admins", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      name: varchar("name").notNull(),
      phone: varchar("phone").notNull(),
      role: varchar("role").notNull(),
      // SUPER, HEAD, SUB
      locationScope: jsonb("location_scope"),
      // array of location strings
      permissions: jsonb("permissions").notNull(),
      // permission flags object
      createdByUserId: varchar("created_by_user_id").references(() => users2.id),
      createdAt: timestamp("created_at").defaultNow()
    });
    delegationLogs = pgTable("delegation_logs", {
      id: serial("id").primaryKey(),
      fromVendorId: integer("from_vendor_id").references(() => vendors.id).notNull(),
      toVendorId: integer("to_vendor_id").references(() => vendors.id).notNull(),
      orderIds: jsonb("order_ids").notNull(),
      // array of order IDs
      delegatedByAdminId: integer("delegated_by_admin_id").references(() => admins.id).notNull(),
      reason: text("reason").notNull(),
      timestamp: timestamp("timestamp").defaultNow()
    });
    orders = pgTable("orders", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id),
      vendorId: integer("vendor_id").references(() => vendors.id),
      deliveryPartnerId: integer("delivery_partner_id").references(() => deliveryPartners.id),
      totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
      liters: integer("liters").default(0),
      // total milk liters in order
      status: varchar("status").notNull().default("PLACED"),
      // PLACED, PREPARING, OUT, DELIVERED, FAILED
      deliverySlot: varchar("delivery_slot"),
      // morning, evening etc.
      deliveryDate: date("delivery_date").notNull(),
      deliveryTime: varchar("delivery_time"),
      deliveryAddress: text("delivery_address").notNull(),
      paymentStatus: varchar("payment_status").default("pending"),
      // pending, paid, failed
      paymentMethod: varchar("payment_method").default("cash_on_delivery"),
      // cash_on_delivery, online, wallet, upi
      paymentDate: timestamp("payment_date"),
      // when payment was received
      delegationLogId: integer("delegation_log_id").references(() => delegationLogs.id),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow()
    });
    orderItems = pgTable("order_items", {
      id: serial("id").primaryKey(),
      orderId: integer("order_id").references(() => orders.id),
      productId: integer("product_id").references(() => products.id),
      quantity: integer("quantity").notNull(),
      price: decimal("price", { precision: 10, scale: 2 }).notNull(),
      totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull()
    });
    milkSubscriptions = pgTable("milk_subscriptions", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id),
      productId: integer("product_id").references(() => products.id),
      quantity: integer("quantity").notNull(),
      frequency: varchar("frequency").notNull(),
      // daily, weekly, alternate
      deliveryTime: varchar("delivery_time"),
      startDate: date("start_date"),
      endDate: date("end_date"),
      pricePerL: decimal("price_per_l", { precision: 10, scale: 2 }),
      status: varchar("status").notNull().default("ACTIVE"),
      // ACTIVE, PAUSED, CANCELLED
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    subscriptionDeliveries = pgTable("subscription_deliveries", {
      id: serial("id").primaryKey(),
      subscriptionId: integer("subscription_id").references(() => milkSubscriptions.id),
      userId: varchar("user_id").references(() => users2.id),
      deliveryDate: date("delivery_date"),
      quantity: integer("quantity"),
      status: varchar("status").default("pending"),
      // pending, delivered, missed, cancelled
      createdAt: timestamp("created_at").defaultNow()
    });
    cart = pgTable("cart", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id).unique(),
      createdAt: timestamp("created_at").defaultNow()
    });
    cartItems = pgTable("cart_items", {
      id: serial("id").primaryKey(),
      cartId: integer("cart_id").references(() => cart.id),
      productId: integer("product_id").references(() => products.id),
      quantity: integer("quantity"),
      price: decimal("price", { precision: 10, scale: 2 }),
      addedAt: timestamp("added_at").defaultNow()
    });
    addresses = pgTable("addresses", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id),
      type: varchar("type").notNull(),
      // home, work, other
      address: text("address").notNull(),
      landmark: varchar("landmark"),
      city: varchar("city"),
      state: varchar("state"),
      pincode: varchar("pincode"),
      phone: varchar("phone"),
      isDefault: boolean("is_default").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    supportTickets = pgTable("support_tickets", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id),
      subject: varchar("subject").notNull(),
      description: text("description").notNull(),
      status: varchar("status").default("open"),
      // open, in_progress, resolved, closed
      priority: varchar("priority").default("normal"),
      // low, normal, high
      category: varchar("category"),
      // billing, delivery, product, general
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    ticketMessages = pgTable("ticket_messages", {
      id: serial("id").primaryKey(),
      ticketId: integer("ticket_id").references(() => supportTickets.id),
      userId: varchar("user_id").references(() => users2.id),
      message: text("message").notNull(),
      createdAt: timestamp("created_at").defaultNow()
    });
    productVendors = pgTable("product_vendors", {
      id: serial("id").primaryKey(),
      productId: integer("product_id").references(() => products.id),
      vendorId: integer("vendor_id").references(() => vendors.id),
      createdAt: timestamp("created_at").defaultNow()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id),
      type: varchar("type").notNull(),
      // order, subscription, billing, etc
      title: varchar("title").notNull(),
      message: text("message").notNull(),
      isRead: boolean("is_read").default(false),
      createdAt: timestamp("created_at").defaultNow()
    });
    bills = pgTable("bills", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").references(() => users2.id).notNull(),
      month: integer("month").notNull(),
      // 1-12
      year: integer("year").notNull(),
      // 2025
      items: jsonb("items").notNull(),
      // Array of billing items
      subscriptionTotal: decimal("subscription_total", { precision: 10, scale: 2 }).default("0"),
      ordersTotal: decimal("orders_total", { precision: 10, scale: 2 }).default("0"),
      previousPending: decimal("previous_pending", { precision: 10, scale: 2 }).default("0"),
      penalty: decimal("penalty", { precision: 10, scale: 2 }).default("0"),
      discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
      finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
      dueDate: date("due_date").notNull(),
      status: varchar("status").notNull().default("unpaid"),
      // unpaid, paid, overdue
      paymentDate: timestamp("payment_date"),
      paymentMethod: varchar("payment_method"),
      notes: text("notes"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    subscriptionsRelations = relations(milkSubscriptions, ({ many, one }) => ({
      deliveries: many(subscriptionDeliveries),
      user: one(users2, {
        fields: [milkSubscriptions.userId],
        references: [users2.id]
      }),
      product: one(products, {
        fields: [milkSubscriptions.productId],
        references: [products.id]
      })
    }));
    subscriptionDeliveriesRelations = relations(subscriptionDeliveries, ({ one }) => ({
      subscription: one(milkSubscriptions, {
        fields: [subscriptionDeliveries.subscriptionId],
        references: [milkSubscriptions.id]
      }),
      user: one(users2, {
        fields: [subscriptionDeliveries.userId],
        references: [users2.id]
      })
    }));
    ordersRelations = relations(orders, ({ many, one }) => ({
      items: many(orderItems),
      user: one(users2, {
        fields: [orders.userId],
        references: [users2.id]
      })
    }));
    orderItemsRelations = relations(orderItems, ({ one }) => ({
      order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id]
      }),
      product: one(products, {
        fields: [orderItems.productId],
        references: [products.id]
      })
    }));
    vendorsRelations = relations(vendors, ({ many, one }) => ({
      orders: many(orders),
      productVendors: many(productVendors),
      subscriptions: many(milkSubscriptions)
    }));
    deliveryPartnersRelations = relations(deliveryPartners, ({ one }) => ({
      user: one(users2, {
        fields: [deliveryPartners.userId],
        references: [users2.id]
      })
    }));
    driversRelations = relations(drivers, ({ one }) => ({
      vendor: one(vendors, {
        fields: [drivers.vendorId],
        references: [vendors.id]
      })
    }));
    adminsRelations = relations(admins, ({ one }) => ({
      user: one(users2, {
        fields: [admins.userId],
        references: [users2.id]
      })
    }));
    cartRelations = relations(cart, ({ many }) => ({
      items: many(cartItems)
    }));
    cartItemsRelations = relations(cartItems, ({ one }) => ({
      cart: one(cart, {
        fields: [cartItems.cartId],
        references: [cart.id]
      }),
      product: one(products, {
        fields: [cartItems.productId],
        references: [products.id]
      })
    }));
    addressesRelations = relations(addresses, ({ one }) => ({
      user: one(users2, {
        fields: [addresses.userId],
        references: [users2.id]
      })
    }));
    productVendorsRelations = relations(productVendors, ({ one }) => ({
      product: one(products, {
        fields: [productVendors.productId],
        references: [products.id]
      }),
      vendor: one(vendors, {
        fields: [productVendors.vendorId],
        references: [vendors.id]
      })
    }));
    billsRelations = relations(bills, ({ one }) => ({
      user: one(users2, {
        fields: [bills.userId],
        references: [users2.id]
      })
    }));
    banners = pgTable("banners", {
      id: serial("id").primaryKey(),
      title: varchar("title"),
      subtitle: text("subtitle"),
      imageUrl: varchar("image_url"),
      // Desktop image (default/fallback)
      imageUrlTablet: varchar("image_url_tablet"),
      // Tablet image (768px-1024px)
      imageUrlMobile: varchar("image_url_mobile"),
      // Mobile image (<768px)
      ctaText: varchar("cta_text"),
      // "Shop Now", "Order Today", etc.
      ctaLink: varchar("cta_link"),
      // Link to navigate on CTA click
      badgeText: varchar("badge_text"),
      // "25% OFF", "New", "Best Seller"
      displayOrder: integer("display_order").default(0),
      isActive: boolean("is_active").default(true),
      showOverlay: boolean("show_overlay").default(false),
      startDate: timestamp("start_date"),
      endDate: timestamp("end_date"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    homepageSections = pgTable("homepage_sections", {
      id: serial("id").primaryKey(),
      sectionType: varchar("section_type").notNull(),
      // hero_stats, ethos, deals, new_launches, stats, faq, newsletter
      title: varchar("title"),
      subtitle: text("subtitle"),
      content: jsonb("content"),
      // Flexible JSON for section-specific data
      displayOrder: integer("display_order").default(0),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    ethosCards = pgTable("ethos_cards", {
      id: serial("id").primaryKey(),
      title: varchar("title").notNull(),
      description: text("description").notNull(),
      icon: varchar("icon").notNull(),
      // Icon name like "Leaf", "Heart", "Users", "Recycle"
      displayOrder: integer("display_order").default(0),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    productDeals = pgTable("product_deals", {
      id: serial("id").primaryKey(),
      productId: integer("product_id").references(() => products.id).notNull(),
      dealType: varchar("deal_type").notNull().default("PERCENT"),
      // PERCENT or FIXED
      dealValue: decimal("deal_value", { precision: 10, scale: 2 }).notNull(),
      // e.g., 25 for 25% or 50 for ₹50 off
      badgeText: varchar("badge_text"),
      // "25% OFF", "New", etc.
      priority: integer("priority").default(0),
      startsAt: timestamp("starts_at"),
      endsAt: timestamp("ends_at"),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    statsCounters = pgTable("stats_counters", {
      id: serial("id").primaryKey(),
      label: varchar("label").notNull(),
      // "Happy Customers", "Products", etc.
      value: integer("value").notNull(),
      // The number
      suffix: varchar("suffix"),
      // "+", "K", etc.
      icon: varchar("icon"),
      // Icon name
      displayOrder: integer("display_order").default(0),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    faqs2 = pgTable("faqs", {
      id: serial("id").primaryKey(),
      category: varchar("category").notNull().default("General"),
      question: varchar("question").notNull(),
      answer: text("answer").notNull(),
      order: integer("order").default(0),
      displayOrder: integer("display_order").default(0),
      isActive: boolean("is_active").default(true),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    newsletterSettings = pgTable("newsletter_settings", {
      id: serial("id").primaryKey(),
      title: varchar("title").notNull().default("Join Our Newsletter"),
      subtitle: text("subtitle"),
      ctaText: varchar("cta_text").default("Subscribe"),
      placeholderText: varchar("placeholder_text").default("Enter your email address"),
      isActive: boolean("is_active").default(true),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    footerSettings = pgTable("footer_settings", {
      id: serial("id").primaryKey(),
      companyName: varchar("company_name").default("Divine Naturals"),
      tagline: varchar("tagline").default("Pure. Fresh. Daily."),
      description: text("description"),
      phone: varchar("phone"),
      email: varchar("email"),
      address: text("address"),
      socialLinks: jsonb("social_links"),
      // { facebook: "url", instagram: "url", twitter: "url" }
      footerLinks: jsonb("footer_links"),
      // { shop: [...], account: [...], company: [...] }
      copyrightText: varchar("copyright_text"),
      isActive: boolean("is_active").default(true),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    aboutUsSettings = pgTable("about_us_settings", {
      id: serial("id").primaryKey(),
      // Section 1: Hero
      heroTitle: varchar("hero_title").default("Our Story"),
      heroSubtitle: text("hero_subtitle"),
      heroImageUrl: varchar("hero_image_url"),
      heroCtaText: varchar("hero_cta_text"),
      heroCtaLink: varchar("hero_cta_link"),
      // Section 2: Story
      storyHeading: varchar("story_heading"),
      storyDescription: text("story_description"),
      // Rich text
      storyImageUrl: varchar("story_image_url"),
      // Section 3: Values
      valuesTitle: varchar("values_title").default("Our Core Values"),
      values: jsonb("values"),
      // Array of { icon, title, description }
      // Section 4: Process
      processTitle: varchar("process_title").default("How It Works"),
      processSteps: jsonb("process_steps"),
      // Array of { icon, title, description }
      // Section 5: CTA
      ctaHeading: varchar("cta_heading"),
      ctaSubheading: text("cta_subheading"),
      ctaButtonText: varchar("cta_button_text"),
      ctaButtonLink: varchar("cta_button_link"),
      isActive: boolean("is_active").default(true),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    contactSettings = pgTable("contact_settings", {
      id: serial("id").primaryKey(),
      // Section 1: Hero
      heroTitle: varchar("hero_title").default("Contact Us"),
      heroSubtitle: text("hero_subtitle"),
      heroImageUrl: varchar("hero_image_url"),
      // Section 2: Info
      phone: varchar("phone"),
      email: varchar("email"),
      address: text("address"),
      businessHours: text("business_hours"),
      socialLinks: jsonb("social_links"),
      mapEmbedUrl: text("map_embed_url"),
      // Use text for long iframe links
      isActive: boolean("is_active").default(true),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    termsOfServiceSettings = pgTable("terms_of_service_settings", {
      id: serial("id").primaryKey(),
      title: varchar("title").default("Terms of Service"),
      lastUpdated: timestamp("last_updated").defaultNow(),
      content: text("content"),
      sections: jsonb("sections"),
      // Array of { title, content }
      isActive: boolean("is_active").default(true),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    privacyPolicySettings = pgTable("privacy_policy_settings", {
      id: serial("id").primaryKey(),
      title: varchar("title").default("Privacy Policy"),
      lastUpdated: timestamp("last_updated").defaultNow(),
      content: text("content"),
      sections: jsonb("sections"),
      // Array of { title, content }
      isActive: boolean("is_active").default(true),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    siteSettings = pgTable("site_settings", {
      id: serial("id").primaryKey(),
      brandName: varchar("brand_name").notNull().default("Divine Naturals"),
      logoUrl: varchar("logo_url"),
      faviconUrl: varchar("favicon_url"),
      primaryColor: varchar("primary_color").default("#16A34A"),
      secondaryColor: varchar("secondary_color").default("#FFF9F2"),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    contactSubmissions = pgTable("contact_submissions", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      email: varchar("email").notNull(),
      phone: varchar("phone"),
      message: text("message").notNull(),
      status: varchar("status").default("new"),
      // new, read, replied
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertAddressSchema = createInsertSchema(addresses);
    insertOrderSchema = createInsertSchema(orders);
    insertSubscriptionSchema = createInsertSchema(milkSubscriptions);
    insertMilkSubscriptionSchema = createInsertSchema(milkSubscriptions);
    insertSupportTicketSchema = createInsertSchema(supportTickets);
    insertTicketMessageSchema = createInsertSchema(ticketMessages);
    insertProductSchema = createInsertSchema(products);
    insertBannerSchema = createInsertSchema(banners);
    insertHomepageSectionSchema = createInsertSchema(homepageSections);
    insertContactSubmissionSchema = createInsertSchema(contactSubmissions);
    insertSiteSettingsSchema = createInsertSchema(siteSettings);
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  db: () => db,
  pool: () => pool
});
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import pkg from "pg";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import ws from "ws";
var PgPool, isNeon, pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    ({ Pool: PgPool } = pkg);
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    isNeon = process.env.DATABASE_URL.includes("neon.tech");
    pool = isNeon ? new NeonPool({ connectionString: process.env.DATABASE_URL }) : new PgPool({ connectionString: process.env.DATABASE_URL });
    if (isNeon) {
      neonConfig.webSocketConstructor = ws;
    }
    db = isNeon ? neonDrizzle({ client: pool, schema: schema_exports }) : pgDrizzle({ client: pool, schema: schema_exports });
  }
});

// server/utils/generateInvoice.ts
var generateInvoice_exports = {};
__export(generateInvoice_exports, {
  createInvoiceHTML: () => createInvoiceHTML,
  getBillInvoiceData: () => getBillInvoiceData
});
import { eq as eq18 } from "drizzle-orm";
function createInvoiceHTML(data) {
  const createdDate = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const monthYear = `${data.month} ${data.year}`;
  const itemsHTML = data.items.map(
    (item) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: left;">${item.date}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: left;">${item.description}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: center;">${item.quantity}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: right;">\u20B9${item.price.toLocaleString()}</td>
      <td style="padding: 0.75rem; font-size: 0.875rem; text-align: right; font-weight: 600;">\u20B9${item.total.toLocaleString()}</td>
    </tr>
  `
  ).join("");
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Divine Naturals Invoice</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f9fafb;
            padding: 2rem;
        }
        .invoice-container {
            background: white;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
            border-bottom: 3px solid #10b981;
            padding-bottom: 1.5rem;
        }
        .company-name {
            font-size: 1.75rem;
            font-weight: 700;
            color: #10b981;
            margin-bottom: 0.25rem;
        }
        .company-tagline {
            font-size: 0.875rem;
            color: #6b7280;
            font-style: italic;
        }
        .invoice-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }
        .info-section h3 {
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
        }
        .info-section p {
            font-size: 0.875rem;
            color: #6b7280;
            line-height: 1.6;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .summary-card {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            border-left: 4px solid #3b82f6;
        }
        .summary-card.success {
            border-left-color: #10b981;
        }
        .summary-card.warning {
            border-left-color: #f59e0b;
        }
        .summary-card label {
            display: block;
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 600;
            margin-bottom: 0.25rem;
            text-transform: uppercase;
        }
        .summary-card .value {
            font-size: 1.5rem;
            font-weight: 700;
            color: #111827;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2rem;
            margin-top: 2rem;
        }
        .items-table thead {
            background: #f3f4f6;
            border-bottom: 2px solid #e5e7eb;
        }
        .items-table th {
            padding: 0.75rem;
            text-align: left;
            font-size: 0.875rem;
            font-weight: 600;
            color: #374151;
        }
        .items-table td {
            padding: 0.75rem;
            font-size: 0.875rem;
            color: #6b7280;
        }
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 2rem;
        }
        .totals-box {
            width: 300px;
            border: 2px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            font-size: 0.875rem;
            color: #6b7280;
            border-bottom: 1px solid #e5e7eb;
        }
        .total-row.grand {
            border: none;
            padding: 1rem 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: #111827;
            margin-top: 0.5rem;
        }
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 1rem;
        }
        .status-badge.paid {
            background: #d1fae5;
            color: #065f46;
        }
        .status-badge.unpaid {
            background: #fef3c7;
            color: #92400e;
        }
        .status-badge.overdue {
            background: #fee2e2;
            color: #991b1b;
        }
        .footer {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #e5e7eb;
            font-size: 0.75rem;
            color: #9ca3af;
        }
        @media print {
            body {
                padding: 0;
                background: white;
            }
            .invoice-container {
                box-shadow: none;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="company-name">\u{1F95B} DIVINE NATURALS</div>
            <div class="company-tagline">Pure. Fresh. Daily.</div>
        </div>

        <!-- Invoice Info -->
        <div class="invoice-info">
            <div class="info-section">
                <h3>\u{1F4CB} Bill Details</h3>
                <p><strong>Bill ID:</strong> #${data.billId}</p>
                <p><strong>Month:</strong> ${monthYear}</p>
                <p><strong>Generated:</strong> ${createdDate}</p>
                <p><strong>Due Date:</strong> ${new Date(data.dueDate).toLocaleDateString("en-IN")}</p>
            </div>
            <div class="info-section">
                <h3>\u{1F464} Customer Details</h3>
                <p><strong>${data.customerName}</strong></p>
                <p>${data.address}</p>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="summary-cards">
            <div class="summary-card">
                <label>Subscriptions</label>
                <div class="value">\u20B9${data.subscriptionTotal.toLocaleString()}</div>
            </div>
            <div class="summary-card">
                <label>Orders</label>
                <div class="value">\u20B9${data.ordersTotal.toLocaleString()}</div>
            </div>
            <div class="summary-card success">
                <label>Total Amount</label>
                <div class="value">\u20B9${data.finalAmount.toLocaleString()}</div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Rate</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-box">
                <div class="total-row">
                    <span>Subscriptions:</span>
                    <span>\u20B9${data.subscriptionTotal.toLocaleString()}</span>
                </div>
                <div class="total-row">
                    <span>Orders:</span>
                    <span>\u20B9${data.ordersTotal.toLocaleString()}</span>
                </div>
                ${data.previousPending > 0 ? `
                <div class="total-row">
                    <span>Previous Due:</span>
                    <span>\u20B9${data.previousPending.toLocaleString()}</span>
                </div>
                ` : ""}
                ${data.penalty > 0 ? `
                <div class="total-row warning">
                    <span>\u26A0\uFE0F Penalty:</span>
                    <span>\u20B9${data.penalty.toLocaleString()}</span>
                </div>
                ` : ""}
                ${data.discount > 0 ? `
                <div class="total-row success">
                    <span>\u2705 Discount:</span>
                    <span>-\u20B9${data.discount.toLocaleString()}</span>
                </div>
                ` : ""}
                <div class="total-row grand">
                    <span>Grand Total:</span>
                    <span>\u20B9${data.finalAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <!-- Status Badge -->
        <div>
            <span class="status-badge ${data.status === "paid" ? "paid" : data.status === "overdue" ? "overdue" : "unpaid"}">
                ${data.status === "paid" ? "\u2705 PAID" : data.status === "overdue" ? "\u26A0\uFE0F OVERDUE" : "\u{1F7E7} UNPAID"}
            </span>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This is an automatically generated invoice. Please retain for your records.</p>
            <p>For queries, contact Divine Naturals customer support.</p>
        </div>
    </div>
</body>
</html>
  `;
  return html;
}
async function getBillInvoiceData(billId) {
  const bill = await db.select().from(bills).where(eq18(bills.id, billId));
  if (!bill.length) return null;
  const billRecord = bill[0];
  const user = await db.select().from(users2).where(eq18(users2.id, billRecord.userId));
  if (!user.length) return null;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const items = typeof billRecord.items === "string" ? JSON.parse(billRecord.items) : billRecord.items;
  const dueDateStr = typeof billRecord.dueDate === "string" ? billRecord.dueDate : billRecord.dueDate instanceof Date ? billRecord.dueDate.toISOString() : new Date(billRecord.dueDate).toISOString();
  const createdAtStr = billRecord.createdAt instanceof Date ? billRecord.createdAt.toISOString() : new Date(billRecord.createdAt).toISOString();
  return {
    billId: billRecord.id,
    customerName: `${user[0].firstName || ""} ${user[0].lastName || ""}`.trim() || "N/A",
    address: user[0].address || "N/A",
    month: monthNames[billRecord.month - 1],
    year: billRecord.year,
    items: items || [],
    subscriptionTotal: Number(billRecord.subscriptionTotal || 0),
    ordersTotal: Number(billRecord.ordersTotal || 0),
    previousPending: Number(billRecord.previousPending || 0),
    penalty: Number(billRecord.penalty || 0),
    discount: Number(billRecord.discount || 0),
    finalAmount: Number(billRecord.finalAmount || 0),
    dueDate: dueDateStr,
    status: billRecord.status,
    generatedDate: createdAtStr
  };
}
var init_generateInvoice = __esm({
  "server/utils/generateInvoice.ts"() {
    "use strict";
    init_db();
    init_schema();
  }
});

// server/index.ts
import "dotenv/config";
import express2 from "express";
import fileUpload from "express-fileupload";
import cron from "node-cron";
import path4 from "path";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
init_schema();
init_db();
import { eq, and, desc, asc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations - mandatory for Replit Auth
  async getUser(id) {
    const [user] = await db.select().from(users2).where(eq(users2.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users2).values(userData).onConflictDoUpdate({
      target: users2.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUser(id, userData) {
    const [user] = await db.update(users2).set({
      ...userData,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users2.id, id)).returning();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  // Get user by email
  async getUserByEmail(email) {
    const [user] = await db.select().from(users2).where(eq(users2.email, email));
    return user;
  }
  // Create user with password (for simple auth)
  async createUserWithPassword(userData) {
    const [user] = await db.insert(users2).values(userData).returning();
    return user;
  }
  // Category operations
  async getCategories() {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name));
  }
  async createCategory(category) {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }
  async updateCategory(id, category) {
    const result = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    if (!result || result.length === 0) {
      throw new Error("Category not found");
    }
    return result[0];
  }
  async deleteCategory(id) {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  }
  // Product operations
  async getProducts() {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(asc(products.name));
  }
  async getProductsByCategory(category) {
    return await db.select().from(products).where(and(eq(products.category, category), eq(products.isActive, true))).orderBy(asc(products.name));
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  async updateProduct(id, product) {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    if (!result || result.length === 0) {
      throw new Error("Product not found");
    }
    return result[0];
  }
  // Order operations
  async getOrdersByUser(userId) {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }
  async getOrderById(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async createOrder(order) {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  async updateOrderStatus(id, status) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    const [updatedOrder] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    if (status.toUpperCase() === "DELIVERED" && order && order.status.toUpperCase() !== "DELIVERED") {
      const items = await this.getOrderItemsByOrder(id);
      for (const item of items) {
        await this.decrementProductStock(item.productId, item.quantity);
        await this.recordStockMovement({
          productId: item.productId,
          type: "OUT",
          reason: "ORDER_DELIVERED",
          quantity: item.quantity,
          previousStock: 0,
          // Would need more queries to get exact
          newStock: 0,
          notes: `Order #${id} delivered`
        });
      }
    }
    return updatedOrder;
  }
  async decrementProductStock(productId, quantity) {
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (product) {
      const newStock = Math.max(0, (product.stock || 0) - quantity);
      await db.update(products).set({ stock: newStock }).where(eq(products.id, productId));
    }
  }
  async updateVendorRequirement(vendorId, liters) {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, vendorId));
    if (vendor) {
      const currentCirculated = vendor.circulatedLiters || 0;
      const currentRequirement = vendor.requirementToday || 0;
      const newCirculated = currentCirculated + liters;
      const newRequirement = Math.max(0, currentRequirement - liters);
      await db.update(vendors).set({
        circulatedLiters: newCirculated,
        requirementToday: newRequirement
      }).where(eq(vendors.id, vendorId));
    }
  }
  async recordStockMovement(movement) {
    console.log("\u{1F4E6} Stock Movement Recorded:", movement);
  }
  async getOrdersForDelivery(deliveryPartnerId) {
    return await db.select().from(orders).where(eq(orders.deliveryPartnerId, deliveryPartnerId)).orderBy(asc(orders.deliveryDate));
  }
  // Order items operations
  async getOrderItemsByOrder(orderId) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  async createOrderItem(orderItem) {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }
  // Milk subscription operations
  async getMilkSubscriptionByUser(userId) {
    const [subscription] = await db.select().from(milkSubscriptions).where(and(eq(milkSubscriptions.userId, userId), eq(milkSubscriptions.isActive, true)));
    return subscription;
  }
  async createMilkSubscription(subscription) {
    const [newSubscription] = await db.insert(milkSubscriptions).values(subscription).returning();
    return newSubscription;
  }
  async updateMilkSubscription(id, subscription) {
    const [updatedSubscription] = await db.update(milkSubscriptions).set(subscription).where(eq(milkSubscriptions.id, id)).returning();
    return updatedSubscription;
  }
  // Vendor operations
  async getVendors() {
    return await db.select().from(vendors).orderBy(asc(vendors.businessName));
  }
  async getVendorByUser(userId) {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.userId, userId));
    return vendor;
  }
  async createVendor(vendor) {
    const [newVendor] = await db.insert(vendors).values(vendor).returning();
    return newVendor;
  }
  // Delivery partner operations
  async getDeliveryPartners() {
    return await db.select().from(deliveryPartners);
  }
  async getDeliveryPartnerByUser(userId) {
    const [partner] = await db.select().from(deliveryPartners).where(eq(deliveryPartners.userId, userId));
    return partner;
  }
  async createDeliveryPartner(partner) {
    const [newPartner] = await db.insert(deliveryPartners).values(partner).returning();
    return newPartner;
  }
  // Notification operations
  async getNotificationsByUser(userId) {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }
  async createNotification(notification) {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }
  async markNotificationAsRead(id) {
    const [updatedNotification] = await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
    return updatedNotification;
  }
  // Cart operations
  async addToCart(userId, productId, quantity) {
    let userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    let cartId;
    if (userCart.length === 0) {
      const [newCart] = await db.insert(cart).values({ userId }).returning();
      cartId = newCart.id;
    } else {
      cartId = userCart[0].id;
    }
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) {
      throw new Error("Product not found");
    }
    const existingItem = await db.select().from(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId))).limit(1);
    if (existingItem.length > 0) {
      const [updatedItem] = await db.update(cartItems).set({ quantity: existingItem[0].quantity + quantity }).where(eq(cartItems.id, existingItem[0].id)).returning();
      return updatedItem;
    } else {
      const [newItem] = await db.insert(cartItems).values({ cartId, productId, quantity, price: product.price }).returning();
      return newItem;
    }
  }
  async getCartItems(userId) {
    const userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    if (userCart.length === 0) {
      return [];
    }
    const items = await db.select({
      id: cartItems.id,
      cartId: cartItems.cartId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      price: cartItems.price,
      productName: products.name,
      productImage: products.imageUrl,
      productUnit: products.unit
    }).from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).where(eq(cartItems.cartId, userCart[0].id));
    return items;
  }
  async clearCart(userId) {
    const userCart = await db.select().from(cart).where(eq(cart.userId, userId)).limit(1);
    if (userCart.length > 0) {
      await db.delete(cartItems).where(eq(cartItems.cartId, userCart[0].id));
    }
  }
  // Inward log operations (deprecated - table removed from schema)
  async createInwardLog(inwardLog) {
    return {};
  }
  // Vendor approval
  async approveVendor(vendorId) {
    const [updatedVendor] = await db.update(vendors).set({ isVerified: true }).where(eq(vendors.id, vendorId)).returning();
    return updatedVendor;
  }
  // Admin order management
  async getAllOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  async assignDeliveryPartner(orderId, deliveryPartnerId) {
    const [partner] = await db.select().from(deliveryPartners).where(
      and(eq(deliveryPartners.id, deliveryPartnerId), eq(deliveryPartners.isAvailable, true))
    );
    if (!partner) {
      throw new Error("Delivery partner not found or not available");
    }
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    const result = await db.update(orders).set({ deliveryPartnerId }).where(eq(orders.id, orderId)).returning();
    if (!result || result.length === 0) {
      throw new Error("Failed to update order");
    }
    return result[0];
  }
  async updateOrderPayment(orderId, paymentData) {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    if (!order) {
      throw new Error("Order not found");
    }
    if (paymentData.paymentStatus) {
      const validStatuses = ["pending", "paid", "failed", "refunded"];
      if (!validStatuses.includes(paymentData.paymentStatus)) {
        throw new Error("Invalid payment status");
      }
    }
    const result = await db.update(orders).set(paymentData).where(eq(orders.id, orderId)).returning();
    if (!result || result.length === 0) {
      throw new Error("Failed to update order payment");
    }
    return result[0];
  }
  // Driver management
  async addDriver(driver) {
    const [newDriver] = await db.insert(drivers).values(driver).returning();
    return newDriver;
  }
  async getDriversByVendor(vendorId) {
    return await db.select().from(drivers).where(eq(drivers.vendorId, vendorId)).orderBy(desc(drivers.createdAt));
  }
  // Customer management - get all customers
  async getAllCustomers() {
    return await db.select().from(users2).where(eq(users2.role, "customer")).orderBy(desc(users2.createdAt));
  }
  // Subscription management - get all subscriptions
  async getAllSubscriptions() {
    const allSubscriptions = await db.select().from(milkSubscriptions).orderBy(desc(milkSubscriptions.createdAt));
    const enrichedSubscriptions = await Promise.all(
      allSubscriptions.map(async (sub) => {
        const user = await this.getUser(sub.userId);
        return { ...sub, user };
      })
    );
    return enrichedSubscriptions;
  }
  // Admin stats
  async getAdminStats() {
    const allOrders = await db.select().from(orders);
    const allProducts = await db.select().from(products);
    const allVendors = await db.select().from(vendors);
    const allDeliveryPartners = await db.select().from(deliveryPartners);
    const allCustomers = await db.select().from(users2).where(eq(users2.role, "customer"));
    const totalRevenue = allOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.totalAmount) || 0);
    }, 0);
    const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
    const completedOrders = allOrders.filter((o) => o.status === "completed").length;
    const lowStockProducts = allProducts.filter((p) => p.stock && p.stock <= 50).length;
    return {
      totalOrders: allOrders.length,
      pendingOrders,
      completedOrders,
      totalRevenue: Math.round(totalRevenue),
      totalCustomers: allCustomers.length,
      totalProducts: allProducts.length,
      totalVendors: allVendors.length,
      totalDeliveryPartners: allDeliveryPartners.length,
      lowStockProducts
    };
  }
  // Banner operations
  async getBanners() {
    const { banners: banners2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    return await db.select().from(banners2).orderBy(asc(banners2.displayOrder));
  }
  async getActiveBanners() {
    const { banners: banners2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const now = /* @__PURE__ */ new Date();
    return await db.select().from(banners2).where(
      and(
        eq(banners2.isActive, true),
        or(isNull(banners2.startDate), lte(banners2.startDate, now)),
        or(isNull(banners2.endDate), gte(banners2.endDate, now))
      )
    ).orderBy(asc(banners2.displayOrder));
  }
  async createBanner(bannerData) {
    const { banners: banners2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [banner] = await db.insert(banners2).values(bannerData).returning();
    return banner;
  }
  async updateBanner(id, bannerData) {
    const { banners: banners2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [banner] = await db.update(banners2).set({ ...bannerData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(banners2.id, id)).returning();
    return banner;
  }
  async deleteBanner(id) {
    const { banners: banners2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    await db.delete(banners2).where(eq(banners2.id, id));
  }
  // Homepage CMS operations
  async getEthosCards() {
    const { ethosCards: ethosCards2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    return await db.select().from(ethosCards2).orderBy(asc(ethosCards2.displayOrder));
  }
  async getActiveEthosCards() {
    const { ethosCards: ethosCards2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    return await db.select().from(ethosCards2).where(eq(ethosCards2.isActive, true)).orderBy(asc(ethosCards2.displayOrder));
  }
  async getStatsCounters() {
    const { statsCounters: statsCounters2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    return await db.select().from(statsCounters2).orderBy(asc(statsCounters2.displayOrder));
  }
  async getActiveStatsCounters() {
    const { statsCounters: statsCounters2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    return await db.select().from(statsCounters2).where(eq(statsCounters2.isActive, true)).orderBy(asc(statsCounters2.displayOrder));
  }
  async getFAQs() {
    const { faqs: faqs3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    return await db.select().from(faqs3).orderBy(asc(faqs3.displayOrder));
  }
  async getActiveFAQs() {
    const { faqs: faqs3 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    return await db.select().from(faqs3).where(eq(faqs3.isActive, true)).orderBy(asc(faqs3.displayOrder));
  }
  async getNewsletterSettings() {
    const { newsletterSettings: newsletterSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [settings] = await db.select().from(newsletterSettings2).limit(1);
    return settings || null;
  }
  async getFooterSettings() {
    const { footerSettings: footerSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [settings] = await db.select().from(footerSettings2).limit(1);
    return settings || null;
  }
  async updateNewsletterSettings(settingsData) {
    const { newsletterSettings: newsletterSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existing = await this.getNewsletterSettings();
    if (existing) {
      const [updated] = await db.update(newsletterSettings2).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(newsletterSettings2.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(newsletterSettings2).values(settingsData).returning();
      return created;
    }
  }
  async updateFooterSettings(settingsData) {
    const { footerSettings: footerSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existing = await this.getFooterSettings();
    if (existing) {
      const [updated] = await db.update(footerSettings2).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(footerSettings2.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(footerSettings2).values(settingsData).returning();
      return created;
    }
  }
  // CMS Settings operations
  async getAboutUsSettings() {
    const { aboutUsSettings: aboutUsSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [settings] = await db.select().from(aboutUsSettings2).limit(1);
    return settings || null;
  }
  async getContactSettings() {
    const { contactSettings: contactSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [settings] = await db.select().from(contactSettings2).limit(1);
    return settings || null;
  }
  async getTermsOfServiceSettings() {
    const { termsOfServiceSettings: termsOfServiceSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [settings] = await db.select().from(termsOfServiceSettings2).limit(1);
    return settings || null;
  }
  async getPrivacyPolicySettings() {
    const { privacyPolicySettings: privacyPolicySettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [settings] = await db.select().from(privacyPolicySettings2).limit(1);
    return settings || null;
  }
  async updateAboutUsSettings(settingsData) {
    const { aboutUsSettings: aboutUsSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existing = await this.getAboutUsSettings();
    if (existing) {
      const [updated] = await db.update(aboutUsSettings2).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(aboutUsSettings2.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(aboutUsSettings2).values(settingsData).returning();
      return created;
    }
  }
  async updateContactSettings(settingsData) {
    const { contactSettings: contactSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existing = await this.getContactSettings();
    if (existing) {
      const [updated] = await db.update(contactSettings2).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(contactSettings2.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(contactSettings2).values(settingsData).returning();
      return created;
    }
  }
  async updateTermsOfServiceSettings(settingsData) {
    const { termsOfServiceSettings: termsOfServiceSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existing = await this.getTermsOfServiceSettings();
    if (existing) {
      const [updated] = await db.update(termsOfServiceSettings2).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(termsOfServiceSettings2.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(termsOfServiceSettings2).values(settingsData).returning();
      return created;
    }
  }
  async updatePrivacyPolicySettings(settingsData) {
    const { privacyPolicySettings: privacyPolicySettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existing = await this.getPrivacyPolicySettings();
    if (existing) {
      const [updated] = await db.update(privacyPolicySettings2).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(privacyPolicySettings2.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(privacyPolicySettings2).values(settingsData).returning();
      return created;
    }
  }
  async getSiteSettings() {
    const { siteSettings: siteSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const [settings] = await db.select().from(siteSettings2).limit(1);
    return settings || null;
  }
  async updateSiteSettings(settingsData) {
    const { siteSettings: siteSettings2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
    const existing = await this.getSiteSettings();
    if (existing) {
      const [updated] = await db.update(siteSettings2).set({ ...settingsData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteSettings2.id, existing.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(siteSettings2).values(settingsData).returning();
      return created;
    }
  }
};
var storage = new DatabaseStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  console.warn("REPLIT_DOMAINS not provided, OIDC auth will be disabled");
}
var getOidcConfig = memoize(
  async () => {
    if (!process.env.REPLIT_DOMAINS) return null;
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || "dev-secret-replace-in-production-1bbb8dc397432601dbfd287a827825dfa4b44f0dca956dd83527bd6f94e0cbac5c144424ec2c2819725d1abe72d2894d72f0086fcc23f2a87bf28e235348cddb",
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
      sameSite: "lax",
      path: "/"
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  const sessionMiddleware = getSession();
  app2.use((req, res, next) => {
    const path5 = req.path;
    if (!path5.startsWith("/api")) {
      return next();
    }
    sessionMiddleware(req, res, next);
  });
  app2.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
      return next();
    }
    passport.initialize()(req, res, next);
  });
  app2.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
      return next();
    }
    passport.session()(req, res, next);
  });
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    const claims = tokens.claims();
    if (claims && claims["sub"]) {
      const dbUser = await storage.getUser(claims["sub"]);
      if (dbUser) {
        user.role = dbUser.role;
        user.id = dbUser.id;
      }
    }
    verified(null, user);
  };
  if (process.env.REPLIT_DOMAINS) {
    for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
      const strategy = new Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`
        },
        verify
      );
      passport.use(strategy);
    }
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  const user = req.user;
  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized - Please log in" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes/auth.routes.ts
import { nanoid } from "nanoid";
import bcryptjs from "bcryptjs";
function setupAuthRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: "User not found. Please sign up first.",
          code: "USER_NOT_FOUND"
        });
      }
      const passwordMatch = await bcryptjs.compare(
        password,
        user.passwordHash || ""
      );
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.userEmail = user.email;
      console.log("\u{1F4DD} Setting session:", {
        sessionId: req.sessionID,
        userId: user.id,
        email: user.email
      });
      req.session.save((err) => {
        if (err) {
          console.error("\u274C Session save error:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        console.log("\u2705 Session saved successfully:", {
          sessionId: req.sessionID,
          userId: req.session.userId
        });
        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role
          }
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone, address } = req.body;
      const profilePhoto = req.files?.profilePhoto;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters"
        });
      }
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "Email already registered. Please login instead.",
          code: "USER_EXISTS"
        });
      }
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(password, salt);
      let profileImageUrl = void 0;
      if (profilePhoto) {
        profileImageUrl = `/uploads/${profilePhoto.name}`;
      }
      const newUser = await storage.createUserWithPassword({
        id: nanoid(),
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        address,
        profileImageUrl,
        role: "customer"
      });
      req.session.userId = newUser.id;
      req.session.userRole = newUser.role;
      req.session.userEmail = newUser.email;
      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to create session" });
        }
        res.status(201).json({
          message: "Signup successful",
          user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
          }
        });
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  });
  app2.get("/api/auth/current-user", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        profileImageUrl: user.profileImageUrl,
        role: user.role
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const adminUsername = process.env.ADMIN_USERNAME || "DivineNaturalsMDKauldeepRao";
      const adminPassword = process.env.ADMIN_PASSWORD || "DivineNaturals@2025";
      if (username !== adminUsername || password !== adminPassword) {
        console.log("\u274C Admin login failed: Invalid credentials for", username);
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      req.session.isAdminLoggedIn = true;
      req.session.adminUsername = username;
      req.session.save((err) => {
        if (err) {
          console.error("\u274C Admin session save error:", err);
          return res.status(500).json({ message: "Failed to create session" });
        }
        console.log("\u2705 Admin session created:", {
          sessionId: req.sessionID,
          admin: username
        });
        res.json({
          message: "Admin login successful",
          admin: {
            username
          }
        });
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });
  app2.get("/api/admin/current-admin", (req, res) => {
    console.log("\u{1F50D} Checking admin session:", {
      sessionId: req.sessionID,
      isAdminLoggedIn: req.session?.isAdminLoggedIn,
      username: req.session?.adminUsername
    });
    if (!req.session?.isAdminLoggedIn) {
      return res.status(401).json({ message: "Not authenticated as admin" });
    }
    res.json({
      username: req.session.adminUsername
    });
  });
  app2.post("/api/admin/logout", (req, res) => {
    req.session.isAdminLoggedIn = false;
    req.session.adminUsername = null;
    req.session.save(() => {
      res.json({ message: "Admin logged out" });
    });
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });
}

// server/routes/cart.routes.ts
import { Router } from "express";

// server/storage/cart.repository.ts
init_db();
init_schema();
import { eq as eq2, and as and2 } from "drizzle-orm";
var CartRepository = class {
  async getOrCreateCart(userId) {
    const existing = await db.query.cart.findFirst({
      where: eq2(cart.userId, userId)
    });
    if (existing) {
      return existing;
    }
    const [newCart] = await db.insert(cart).values({ userId }).returning();
    return newCart;
  }
  async getCartWithItems(userId) {
    const userCart = await this.getOrCreateCart(userId);
    const items = await db.query.cartItems.findMany({
      where: eq2(cartItems.cartId, userCart.id),
      with: {
        product: true
      }
    });
    return {
      cart: userCart,
      items
    };
  }
  async addOrUpdateItem(userId, productId, quantity) {
    const userCart = await this.getOrCreateCart(userId);
    const product = await db.query.products.findFirst({
      where: eq2(products.id, productId)
    });
    if (!product) {
      throw new Error("Product not found");
    }
    const existingItem = await db.query.cartItems.findFirst({
      where: and2(
        eq2(cartItems.cartId, userCart.id),
        eq2(cartItems.productId, productId)
      )
    });
    if (existingItem) {
      const [updated] = await db.update(cartItems).set({ quantity: existingItem.quantity + quantity }).where(eq2(cartItems.id, existingItem.id)).returning();
      return updated;
    }
    const [newItem] = await db.insert(cartItems).values({
      cartId: userCart.id,
      productId,
      quantity,
      price: product.price
    }).returning();
    return newItem;
  }
  async updateItemQuantity(userId, cartItemId, quantity) {
    const userCart = await this.getOrCreateCart(userId);
    if (quantity <= 0) {
      await this.removeItem(userId, cartItemId);
      return null;
    }
    const [updated] = await db.update(cartItems).set({ quantity }).where(
      and2(eq2(cartItems.id, cartItemId), eq2(cartItems.cartId, userCart.id))
    ).returning();
    return updated;
  }
  async removeItem(userId, cartItemId) {
    const userCart = await this.getOrCreateCart(userId);
    await db.delete(cartItems).where(
      and2(eq2(cartItems.id, cartItemId), eq2(cartItems.cartId, userCart.id))
    );
  }
  async clearCart(userId) {
    const userCart = await this.getOrCreateCart(userId);
    await db.delete(cartItems).where(eq2(cartItems.cartId, userCart.id));
  }
  async getCartSummary(userId) {
    const { items } = await this.getCartWithItems(userId);
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = parseFloat(item.price) * item.quantity;
      return sum + itemTotal;
    }, 0);
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee;
    return {
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }
};
var cartRepository = new CartRepository();

// server/routes/cart.routes.ts
import { z } from "zod";
var router = Router();
router.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    const result = await cartRepository.getCartWithItems(userId);
    res.json(result.items || []);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});
router.get("/summary", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const summary = await cartRepository.getCartSummary(userId);
    res.json(summary);
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    res.status(500).json({ message: "Failed to fetch cart summary" });
  }
});
var addItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().positive().default(1)
});
router.post("/items", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { productId, quantity } = addItemSchema.parse(req.body);
    const item = await cartRepository.addOrUpdateItem(userId, productId, quantity);
    res.json(item);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});
var updateItemSchema = z.object({
  quantity: z.number().min(0)
});
router.patch("/items/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const itemId = parseInt(req.params.id);
    const { quantity } = updateItemSchema.parse(req.body);
    const item = await cartRepository.updateItemQuantity(userId, itemId, quantity);
    res.json(item);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});
router.delete("/items/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const itemId = parseInt(req.params.id);
    await cartRepository.removeItem(userId, itemId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ message: "Failed to remove cart item" });
  }
});
router.delete("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await cartRepository.clearCart(userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});
var cart_routes_default = router;

// server/routes/address.routes.ts
import { Router as Router2 } from "express";

// server/storage/address.repository.ts
init_db();
init_schema();
import { eq as eq3, and as and3 } from "drizzle-orm";
var AddressRepository = class {
  async getAddressesByUser(userId) {
    return await db.query.addresses.findMany({
      where: eq3(addresses.userId, userId),
      orderBy: (addresses3, { desc: desc5 }) => [desc5(addresses3.isDefault)]
    });
  }
  async getAddressById(addressId) {
    return await db.query.addresses.findFirst({
      where: eq3(addresses.id, addressId)
    });
  }
  async createAddress(data) {
    if (data.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq3(addresses.userId, data.userId));
    }
    const [address] = await db.insert(addresses).values(data).returning();
    return address;
  }
  async updateAddress(addressId, userId, data) {
    if (data.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq3(addresses.userId, userId));
    }
    const [updated] = await db.update(addresses).set(data).where(and3(eq3(addresses.id, addressId), eq3(addresses.userId, userId))).returning();
    return updated;
  }
  async deleteAddress(addressId, userId) {
    await db.delete(addresses).where(and3(eq3(addresses.id, addressId), eq3(addresses.userId, userId)));
  }
  async setDefaultAddress(addressId, userId) {
    await db.update(addresses).set({ isDefault: false }).where(eq3(addresses.userId, userId));
    const [updated] = await db.update(addresses).set({ isDefault: true }).where(and3(eq3(addresses.id, addressId), eq3(addresses.userId, userId))).returning();
    return updated;
  }
  async getDefaultAddress(userId) {
    return await db.query.addresses.findFirst({
      where: and3(eq3(addresses.userId, userId), eq3(addresses.isDefault, true))
    });
  }
};
var addressRepository = new AddressRepository();

// server/routes/address.routes.ts
init_schema();
var router2 = Router2();
router2.use(isAuthenticated);
router2.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addresses3 = await addressRepository.getAddressesByUser(userId);
    res.json(addresses3);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
});
router2.get("/:id", async (req, res) => {
  try {
    const addressId = parseInt(req.params.id);
    const address = await addressRepository.getAddressById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Failed to fetch address" });
  }
});
router2.post("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressData = insertAddressSchema.parse({ ...req.body, userId });
    const address = await addressRepository.createAddress(addressData);
    res.json(address);
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Failed to create address" });
  }
});
router2.patch("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    const addressData = req.body;
    const address = await addressRepository.updateAddress(addressId, userId, addressData);
    res.json(address);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
});
router2.delete("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    await addressRepository.deleteAddress(addressId, userId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
});
router2.patch("/:id/set-default", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const addressId = parseInt(req.params.id);
    const address = await addressRepository.setDefaultAddress(addressId, userId);
    res.json(address);
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ message: "Failed to set default address" });
  }
});
var address_routes_default = router2;

// server/routes/order.routes.ts
init_db();
init_schema();
import { Router as Router3 } from "express";
import { eq as eq4, and as and4 } from "drizzle-orm";
import { z as z2 } from "zod";
var router3 = Router3();
var createOrderSchema = z2.object({
  items: z2.array(z2.any()).optional(),
  total: z2.number(),
  paymentMethod: z2.enum(["cash", "razorpay", "cod", "upi", "card", "netbanking"]).default("cod"),
  paymentStatus: z2.string().default("pending"),
  userInfo: z2.object({
    firstName: z2.string().optional(),
    lastName: z2.string().optional(),
    phone: z2.string(),
    address: z2.string(),
    email: z2.string().optional()
  }).optional()
});
router3.post("/", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const payload = createOrderSchema.parse(req.body);
    const userCart = await db.query.cart.findFirst({
      where: eq4(cart.userId, userId)
    });
    if (!userCart) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const cartItemsList = await db.query.cartItems.findMany({
      where: eq4(cartItems.cartId, userCart.id)
    });
    if (cartItemsList.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let totalAmount = 0;
    for (const item of cartItemsList) {
      totalAmount += parseFloat(item.price) * item.quantity;
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    let paymentMethod = payload.paymentMethod;
    if (paymentMethod === "cash") paymentMethod = "cod";
    const deliveryAddress = payload.userInfo?.address || "Delivery Address";
    const [newOrder] = await db.insert(orders).values({
      userId,
      totalAmount: totalAmount.toString(),
      deliveryAddress,
      paymentMethod,
      paymentStatus: payload.paymentStatus,
      status: "PLACED",
      deliveryDate: today,
      liters: cartItemsList.reduce((sum, item) => sum + item.quantity, 0)
    }).returning();
    for (const item of cartItemsList) {
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (parseFloat(item.price) * item.quantity).toString()
      });
      const product = await db.query.products.findFirst({
        where: eq4(products.id, item.productId)
      });
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await db.update(products).set({ stock: newStock }).where(eq4(products.id, item.productId));
      }
    }
    await db.delete(cartItems).where(eq4(cartItems.cartId, userCart.id));
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid order data" });
    }
    res.status(500).json({ message: "Failed to create order" });
  }
});
router3.get("/", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userOrders = await db.select().from(orders).where(eq4(orders.userId, userId));
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db.select().from(orderItems).where(eq4(orderItems.orderId, order.id));
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const product = await db.query.products.findFirst({
              where: eq4(products.id, item.productId)
            });
            return { ...item, product };
          })
        );
        return { ...order, items: itemsWithProducts };
      })
    );
    res.json(ordersWithItems);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
router3.get("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId;
    const orderId = parseInt(req.params.id);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [order] = await db.select().from(orders).where(and4(eq4(orders.id, orderId), eq4(orders.userId, userId)));
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const items = await db.select().from(orderItems).where(eq4(orderItems.orderId, orderId));
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await db.query.products.findFirst({
          where: eq4(products.id, item.productId)
        });
        return { ...item, product };
      })
    );
    res.json({ ...order, items: itemsWithProducts });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});
var order_routes_default = router3;

// server/routes/support.routes.ts
import { Router as Router4 } from "express";

// server/storage/support.repository.ts
init_db();
init_schema();
import { eq as eq5, desc as desc2 } from "drizzle-orm";
var SupportRepository = class {
  async getTicketsByUser(userId) {
    return await db.query.supportTickets.findMany({
      where: eq5(supportTickets.userId, userId),
      orderBy: [desc2(supportTickets.createdAt)]
    });
  }
  async getTicketById(ticketId) {
    const ticket = await db.query.supportTickets.findFirst({
      where: eq5(supportTickets.id, ticketId)
    });
    if (!ticket) return null;
    const messages = await db.query.ticketMessages.findMany({
      where: eq5(ticketMessages.ticketId, ticketId),
      orderBy: (ticketMessages2, { asc: asc4 }) => [asc4(ticketMessages2.createdAt)]
    });
    return { ticket, messages };
  }
  async createTicket(data) {
    const [ticket] = await db.insert(supportTickets).values(data).returning();
    return ticket;
  }
  async addMessage(data) {
    const [message] = await db.insert(ticketMessages).values(data).returning();
    await db.update(supportTickets).set({ updatedAt: /* @__PURE__ */ new Date() }).where(eq5(supportTickets.id, data.ticketId));
    return message;
  }
  async updateTicketStatus(ticketId, status) {
    const [updated] = await db.update(supportTickets).set({
      status,
      updatedAt: /* @__PURE__ */ new Date(),
      ...status === "resolved" || status === "closed" ? { resolvedAt: /* @__PURE__ */ new Date() } : {}
    }).where(eq5(supportTickets.id, ticketId)).returning();
    return updated;
  }
  async getFaqs(category) {
    if (category) {
      return await db.query.faqs.findMany({
        where: eq5(faqs.category, category),
        orderBy: (faqs3, { asc: asc4 }) => [asc4(faqs3.order)]
      });
    }
    return await db.query.faqs.findMany({
      where: eq5(faqs.isActive, true),
      orderBy: (faqs3, { asc: asc4 }) => [asc4(faqs3.order)]
    });
  }
};
var supportRepository = new SupportRepository();

// server/routes/support.routes.ts
init_schema();
var router4 = Router4();
var requireAuth = (req, res, next) => {
  if (req.path.startsWith("/faqs")) {
    return next();
  }
  return isAuthenticated(req, res, next);
};
router4.use(requireAuth);
router4.get("/tickets", async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const tickets = await supportRepository.getTicketsByUser(userId);
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch support tickets" });
  }
});
router4.get("/tickets/:id", async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const result = await supportRepository.getTicketById(ticketId);
    if (!result) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Failed to fetch ticket" });
  }
});
router4.post("/tickets", async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const ticketData = insertSupportTicketSchema.parse({ ...req.body, userId });
    const ticket = await supportRepository.createTicket(ticketData);
    res.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Failed to create support ticket" });
  }
});
router4.post("/tickets/:id/messages", async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const ticketId = parseInt(req.params.id);
    const messageData = insertTicketMessageSchema.parse({
      ...req.body,
      ticketId,
      userId,
      isStaff: false
    });
    const message = await supportRepository.addMessage(messageData);
    res.json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Failed to add message" });
  }
});
router4.get("/faqs", async (req, res) => {
  try {
    const category = req.query.category;
    const faqs3 = await supportRepository.getFaqs(category);
    res.json(faqs3);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});
var support_routes_default = router4;

// server/routes/offers.routes.ts
import { Router as Router5 } from "express";

// server/storage/offers.repository.ts
init_db();
import { eq as eq6, and as and5, sql } from "drizzle-orm";
var OffersRepository = class {
  async getActiveOffers() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return await db.query.offers.findMany({
      where: and5(
        eq6(offers.isActive, true),
        sql`${offers.validFrom} <= ${today}`,
        sql`${offers.validTo} >= ${today}`
      ),
      orderBy: (offers2, { desc: desc5 }) => [desc5(offers2.createdAt)]
    });
  }
  async getOfferById(offerId) {
    return await db.query.offers.findFirst({
      where: eq6(offers.id, offerId)
    });
  }
  async validateCoupon(code) {
    const coupon = await db.query.coupons.findFirst({
      where: eq6(coupons.code, code.toUpperCase())
    });
    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }
    if (!coupon.isActive) {
      return { valid: false, message: "This coupon is no longer active" };
    }
    const today = /* @__PURE__ */ new Date();
    if (today < new Date(coupon.validFrom) || today > new Date(coupon.validTo)) {
      return { valid: false, message: "This coupon has expired" };
    }
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return { valid: false, message: "This coupon has reached its usage limit" };
    }
    return { valid: true, coupon };
  }
  async applyCoupon(code, orderAmount) {
    const validation = await this.validateCoupon(code);
    if (!validation.valid || !validation.coupon) {
      throw new Error(validation.message || "Invalid coupon");
    }
    const coupon = validation.coupon;
    if (coupon.minOrderValue && orderAmount < parseFloat(coupon.minOrderValue)) {
      throw new Error(`Minimum order value of \u20B9${coupon.minOrderValue} required`);
    }
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = orderAmount * parseFloat(coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = parseFloat(coupon.discountValue);
    }
    return { discount, coupon };
  }
  async incrementCouponUsage(couponId) {
    await db.update(coupons).set({ usageCount: sql`${coupons.usageCount} + 1` }).where(eq6(coupons.id, couponId));
  }
};
var offersRepository = new OffersRepository();

// server/routes/offers.routes.ts
import { z as z3 } from "zod";
var router5 = Router5();
router5.get("/", async (req, res) => {
  try {
    const offers2 = await offersRepository.getActiveOffers();
    res.json(offers2);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});
router5.get("/:id", async (req, res) => {
  try {
    const offerId = parseInt(req.params.id);
    const offer = await offersRepository.getOfferById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.json(offer);
  } catch (error) {
    console.error("Error fetching offer:", error);
    res.status(500).json({ message: "Failed to fetch offer" });
  }
});
var validateCouponSchema = z3.object({
  code: z3.string()
});
router5.post("/validate-coupon", async (req, res) => {
  try {
    const { code } = validateCouponSchema.parse(req.body);
    const result = await offersRepository.validateCoupon(code);
    res.json(result);
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});
var applyCouponSchema = z3.object({
  code: z3.string(),
  orderAmount: z3.number().positive()
});
router5.post("/apply-coupon", async (req, res) => {
  try {
    const { code, orderAmount } = applyCouponSchema.parse(req.body);
    const result = await offersRepository.applyCoupon(code, orderAmount);
    res.json(result);
  } catch (error) {
    console.error("Error applying coupon:", error);
    res.status(400).json({ message: error.message || "Failed to apply coupon" });
  }
});
var offers_routes_default = router5;

// server/routes/subscription.routes.ts
init_db();
init_schema();
import { Router as Router6 } from "express";
import { eq as eq7, and as and6 } from "drizzle-orm";
var router6 = Router6();
router6.use(isAuthenticated);
router6.post("/", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { productId, quantity, frequency, deliveryTime, startDate } = req.body;
    const productIdInt = parseInt(productId);
    const product = await db.query.products.findFirst({
      where: eq7(products.id, productIdInt)
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const newSub = await db.insert(milkSubscriptions).values({
      userId,
      productId: productIdInt,
      quantity: parseFloat(quantity).toString(),
      frequency,
      deliveryTime,
      startDate: new Date(startDate),
      status: "ACTIVE",
      isActive: true,
      isPaused: false,
      pricePerL: product.price,
      nextDeliveryDate: new Date(startDate)
    }).returning();
    res.status(201).json({ message: "Subscription created", subscription: newSub[0] });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});
router6.get("/me", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptions = await db.select().from(milkSubscriptions).where(eq7(milkSubscriptions.userId, userId));
    const subscriptionsWithProducts = await Promise.all(
      subscriptions.map(async (sub) => {
        const product = await db.query.products.findFirst({
          where: eq7(products.id, sub.productId)
        });
        return { ...sub, product };
      })
    );
    res.json(subscriptionsWithProducts || []);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});
router6.put("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const { quantity, frequency, deliveryTime } = req.body;
    const updated = await db.update(milkSubscriptions).set({ quantity: parseFloat(quantity), frequency, deliveryTime }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});
router6.put("/:id/pause", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const updated = await db.update(milkSubscriptions).set({ status: "PAUSED", isPaused: true }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error pausing subscription:", error);
    res.status(500).json({ message: "Failed to pause subscription" });
  }
});
router6.put("/:id/resume", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const updated = await db.update(milkSubscriptions).set({ status: "ACTIVE", isPaused: false }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error resuming subscription:", error);
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});
router6.put("/:id/skip-tomorrow", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await db.insert(subscriptionDeliveries).values({
      subscriptionId,
      userId,
      deliveryDate: tomorrow,
      quantity: 0,
      status: "SKIPPED"
    });
    res.json({ message: "Tomorrow's delivery skipped" });
  } catch (error) {
    console.error("Error skipping delivery:", error);
    res.status(500).json({ message: "Failed to skip delivery" });
  }
});
router6.delete("/:id", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const subscriptionId = parseInt(req.params.id);
    const updated = await db.update(milkSubscriptions).set({ status: "CANCELLED" }).where(and6(eq7(milkSubscriptions.id, subscriptionId), eq7(milkSubscriptions.userId, userId))).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json({ message: "Subscription cancelled" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
});
router6.get("/me/history", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.claims?.sub;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const deliveries = await db.select().from(subscriptionDeliveries).where(eq7(subscriptionDeliveries.userId, userId));
    res.json(deliveries);
  } catch (error) {
    console.error("Error fetching delivery history:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});
var subscription_routes_default = router6;

// server/routes/admin-subscriptions.routes.ts
init_db();
init_schema();
import { Router as Router7 } from "express";
import { eq as eq8 } from "drizzle-orm";

// server/middleware/auth.ts
function checkRole(allowedRoles) {
  return async (req, res, next) => {
    if (req.session?.isAdminLoggedIn && allowedRoles.includes("admin")) {
      return next();
    }
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - Please log in" });
    }
    try {
      const freshUser = await storage.getUser(req.user.id);
      const userRole = freshUser?.role || req.user.role;
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Forbidden - This endpoint requires one of these roles: ${allowedRoles.join(", ")}`,
          yourRole: userRole
        });
      }
      req.user.role = userRole;
      next();
    } catch (error) {
      console.error("Error checking user role:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
async function requireAdminAccess(req, res, next) {
  if (req.session?.isAdminLoggedIn) {
    console.log(`\u2705 Authorized ${req.method} ${req.originalUrl} via Admin Session`);
    return next();
  }
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized - Please log in" });
  }
  try {
    const freshUser = await storage.getUser(req.user.id);
    const userRole = freshUser?.role || req.user.role;
    if (userRole !== "admin") {
      console.log(`\u{1F6AB} 403 Forbidden - Admin access required for ${req.method} ${req.originalUrl}. userRole:`, userRole);
      return res.status(403).json({
        message: "Admin access required (middleware/auth)",
        yourRole: userRole
      });
    }
    req.user.role = userRole;
    console.log(`\u2705 Authorized ${req.method} ${req.originalUrl} for user:`, freshUser?.id);
    next();
  } catch (error) {
    console.error("Error checking user role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
var requireCustomer = checkRole(["customer"]);
var requireVendor = checkRole(["vendor"]);
var requireDelivery = checkRole(["delivery"]);
var requireAdmin = checkRole(["admin"]);
var requireCustomerOrAdmin = checkRole(["customer", "admin"]);
var requireVendorOrAdmin = checkRole(["vendor", "admin"]);

// server/routes/admin-subscriptions.routes.ts
var router7 = Router7();
router7.get("/", requireAdminAccess, async (req, res) => {
  try {
    const allSubs = await db.select().from(milkSubscriptions);
    const withDetails = await Promise.all(
      allSubs.map(async (sub) => {
        const customer = await db.query.users.findFirst({
          where: eq8(users2.id, sub.userId)
        });
        const product = await db.query.products.findFirst({
          where: eq8(products.id, sub.productId)
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
router7.get("/today/requirement", requireAdminAccess, async (req, res) => {
  try {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const deliveries = await db.select().from(subscriptionDeliveries).where(eq8(subscriptionDeliveries.deliveryDate, new Date(today)));
    const totalRequired = deliveries.reduce((sum, d) => sum + parseFloat(d.quantity.toString()), 0);
    res.json({
      date: today,
      totalRequired,
      deliveryCount: deliveries.length,
      deliveries
    });
  } catch (error) {
    console.error("Error fetching daily requirement:", error);
    res.status(500).json({ message: "Failed to fetch daily requirement" });
  }
});
router7.patch("/:id/status", requireAdminAccess, async (req, res) => {
  try {
    const subId = parseInt(req.params.id);
    const { status } = req.body;
    const updated = await db.update(milkSubscriptions).set({ status }).where(eq8(milkSubscriptions.id, subId)).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json(updated[0]);
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});
router7.post("/", requireAdminAccess, async (req, res) => {
  try {
    const { userId, productId, quantity, frequency, deliveryTime, startDate } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "Customer and Product are required" });
    }
    const productIdInt = parseInt(productId);
    const product = await db.query.products.findFirst({
      where: eq8(products.id, productIdInt)
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
      startDate: startDate ? new Date(startDate) : /* @__PURE__ */ new Date(),
      status: "ACTIVE",
      isActive: true,
      isPaused: false,
      pricePerL: product.price,
      nextDeliveryDate: startDate ? new Date(startDate) : /* @__PURE__ */ new Date()
    }).returning();
    res.status(201).json({ message: "Subscription created", subscription: newSub[0] });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});
router7.delete("/:id", requireAdminAccess, async (req, res) => {
  try {
    const subId = parseInt(req.params.id);
    const deleted = await db.delete(milkSubscriptions).where(eq8(milkSubscriptions.id, subId)).returning();
    if (!deleted.length) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.json({ message: "Subscription deleted", subscription: deleted[0] });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(500).json({ message: "Failed to delete subscription" });
  }
});
var admin_subscriptions_routes_default = router7;

// server/routes/admin-customers.routes.ts
init_db();
init_schema();
import { Router as Router8 } from "express";
import { eq as eq9 } from "drizzle-orm";
var router8 = Router8();
router8.get("/", async (req, res) => {
  try {
    const allCustomers = await db.query.users.findMany({
      where: (table, { ne }) => ne(table.role, "admin")
    });
    const customersWithStats = await Promise.all(
      allCustomers.map(async (customer) => {
        const customerOrders = await db.select().from(orders).where(eq9(orders.userId, customer.id));
        const customerSubs = await db.select().from(milkSubscriptions).where(eq9(milkSubscriptions.userId, customer.id));
        let totalSpending = "0";
        if (customerOrders.length > 0) {
          const total = customerOrders.reduce((sum, order) => {
            return sum + parseFloat(order.totalAmount || "0");
          }, 0);
          totalSpending = total.toString();
        }
        return {
          id: customer.id,
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown",
          phone: customer.phone || "N/A",
          email: customer.email || "N/A",
          orderCount: customerOrders.length,
          subscriptionCount: customerSubs.length,
          totalSpending,
          joinedDate: customer.createdAt
        };
      })
    );
    res.json(customersWithStats);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});
router8.get("/:id/orders", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerOrders = await db.select().from(orders).where(eq9(orders.userId, customerId));
    res.json(customerOrders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Failed to fetch customer orders" });
  }
});
router8.get("/:id/subscriptions", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customerSubs = await db.select().from(milkSubscriptions).where(eq9(milkSubscriptions.userId, customerId));
    res.json(customerSubs);
  } catch (error) {
    console.error("Error fetching customer subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch customer subscriptions" });
  }
});
var admin_customers_routes_default = router8;

// server/routes/billing.routes.ts
init_db();
init_schema();
import { Router as Router9 } from "express";
import { eq as eq10, and as and7, gte as gte3, lte as lte3 } from "drizzle-orm";
import Razorpay from "razorpay";
var router9 = Router9();
var razorpayInstance = null;
var getRazorpayInstance = () => {
  if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayInstance;
};
router9.get("/today-requirements", async (req, res) => {
  try {
    const today = /* @__PURE__ */ new Date();
    const todayStr = today.toISOString().split("T")[0];
    const dayOfWeek = today.getDay();
    const activeSubscriptions = await db.select().from(milkSubscriptions).where(eq10(milkSubscriptions.status, "ACTIVE"));
    let totalLiters = 0;
    let totalDeliveries = 0;
    const subscriptionMap = /* @__PURE__ */ new Map();
    for (const sub of activeSubscriptions) {
      const startDate = sub.startDate ? new Date(sub.startDate) : null;
      const endDate = sub.endDate ? new Date(sub.endDate) : null;
      if (startDate && startDate > today) continue;
      if (endDate && endDate < today) continue;
      let isDeliveryDay = false;
      if (sub.frequency === "daily") {
        isDeliveryDay = true;
      } else if (sub.frequency === "weekly") {
        if (startDate) {
          const startDayOfWeek = startDate.getDay();
          isDeliveryDay = dayOfWeek === startDayOfWeek;
        }
      } else if (sub.frequency === "alternate") {
        if (startDate) {
          const daysDiff = Math.floor((today.getTime() - startDate.getTime()) / (1e3 * 60 * 60 * 24));
          isDeliveryDay = daysDiff % 2 === 0;
        }
      }
      if (!isDeliveryDay) continue;
      const user = await db.query.users.findFirst({
        where: eq10(users2.id, sub.userId)
      });
      const product = await db.query.products.findFirst({
        where: eq10(products.id, sub.productId)
      });
      if (user && product) {
        let defaultAddr = null;
        try {
          const addrs = await db.select().from(addresses).where(and7(eq10(addresses.userId, sub.userId), eq10(addresses.isDefault, true))).limit(1);
          defaultAddr = addrs[0] || null;
        } catch (err) {
          console.error("Error fetching address:", err);
        }
        const quantity = Number(sub.quantity || 0);
        totalLiters += quantity;
        totalDeliveries += 1;
        if (!subscriptionMap.has(sub.productId)) {
          subscriptionMap.set(sub.productId, {
            productId: sub.productId,
            productName: product.name || "Unknown",
            totalLiters: 0,
            byArea: /* @__PURE__ */ new Map()
            // Group by area
          });
        }
        const mapEntry = subscriptionMap.get(sub.productId);
        mapEntry.totalLiters += quantity;
        const area = defaultAddr?.city || "Mumbai";
        if (!mapEntry.byArea.has(area)) {
          mapEntry.byArea.set(area, []);
        }
        mapEntry.byArea.get(area).push({
          userId: user.id,
          customerName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          liters: quantity,
          deliveryTime: sub.deliveryTime || "Not specified",
          address: defaultAddr?.address || "Awaiting address details",
          landmark: defaultAddr?.landmark || "",
          city: defaultAddr?.city || "Mumbai",
          state: defaultAddr?.state || "Maharashtra",
          pincode: defaultAddr?.pincode || "",
          phone: defaultAddr?.phone || user.phone || ""
        });
      }
    }
    const requirements = Array.from(subscriptionMap.values()).map((req2) => ({
      productId: req2.productId,
      productName: req2.productName,
      totalLiters: req2.totalLiters,
      byArea: Object.fromEntries(req2.byArea)
    }));
    res.json({
      date: todayStr,
      totalLitersNeeded: totalLiters,
      totalDeliveries,
      requirements
    });
  } catch (error) {
    console.error("Error fetching today's requirements:", error);
    res.status(500).json({ message: "Failed to fetch requirements" });
  }
});
router9.get("/current", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const currentDate = /* @__PURE__ */ new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const subscriptions = await db.select().from(milkSubscriptions).where(and7(eq10(milkSubscriptions.userId, userId), eq10(milkSubscriptions.status, "ACTIVE")));
    const startDate = new Date(currentYear, currentMonth, 1);
    const endDate = new Date(currentYear, currentMonth + 1, 0);
    const monthOrders = await db.select().from(orders).where(
      and7(
        eq10(orders.userId, userId),
        gte3(orders.createdAt, startDate),
        lte3(orders.createdAt, endDate)
      )
    );
    let subscriptionTotal = 0;
    const subscriptionItems = [];
    for (const sub of subscriptions) {
      const product = await db.query.products.findFirst({
        where: eq10(products.id, sub.productId)
      });
      if (product) {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        let deliveryDays = daysInMonth;
        if (sub.frequency === "weekly") {
          deliveryDays = Math.ceil(daysInMonth / 7);
        } else if (sub.frequency === "alternate") {
          deliveryDays = Math.ceil(daysInMonth / 2);
        }
        const total = Number(sub.quantity || 0) * Number(sub.pricePerL || product.price) * deliveryDays;
        subscriptionTotal += total;
        subscriptionItems.push({
          name: `${product.name} (Subscription)`,
          quantity: deliveryDays,
          rate: Number(sub.pricePerL || product.price),
          total: Math.round(total)
        });
      }
    }
    let orderTotal = 0;
    for (const order of monthOrders) {
      orderTotal += Number(order.totalAmount || 0);
    }
    const adjustments = [];
    let penalty = 0;
    const dueDate = new Date(currentYear, currentMonth + 1, 5);
    if (/* @__PURE__ */ new Date() > dueDate) {
      penalty = 50;
      adjustments.push({ type: "Penalty", amount: penalty });
    }
    const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    });
    const totalAmount = subscriptionTotal + orderTotal + penalty;
    res.json({
      month: monthName,
      amount: Math.round(totalAmount),
      penalty,
      previousDue: 0,
      status: "PENDING",
      dueDate: new Date(currentYear, currentMonth + 1, 5).toISOString(),
      daysLeft: Math.max(0, Math.ceil((new Date(currentYear, currentMonth + 1, 5).getTime() - (/* @__PURE__ */ new Date()).getTime()) / (1e3 * 60 * 60 * 24))),
      subscriptionItems,
      orderItems: monthOrders.map((o) => ({
        name: `Order #${o.id}`,
        quantity: 1,
        rate: Number(o.totalAmount || 0),
        total: Math.round(Number(o.totalAmount || 0))
      })),
      adjustments
    });
  } catch (error) {
    console.error("Error fetching billing:", error);
    res.status(500).json({ message: "Failed to fetch billing data" });
  }
});
router9.get("/history", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const sixMonthsAgo = /* @__PURE__ */ new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const historyOrders = await db.select().from(orders).where(
      and7(
        eq10(orders.userId, userId),
        gte3(orders.createdAt, sixMonthsAgo)
      )
    );
    const monthlyBills = {};
    historyOrders.forEach((order) => {
      const monthKey = new Date(order.createdAt).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric"
      });
      if (!monthlyBills[monthKey]) {
        monthlyBills[monthKey] = {
          month: monthKey,
          amount: 0,
          status: order.paymentStatus === "paid" ? "PAID" : "PENDING",
          paidDate: order.paymentDate?.toISOString() || ""
        };
      }
      monthlyBills[monthKey].amount += Number(order.totalAmount || 0);
    });
    res.json(Object.values(monthlyBills));
  } catch (error) {
    console.error("Error fetching billing history:", error);
    res.status(500).json({ message: "Failed to fetch billing history" });
  }
});
router9.post("/pay", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { amount, currency = "INR" } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    const options = {
      amount: Math.round(amount * 100),
      // Convert to paise
      currency,
      receipt: `bill_${userId}_${Date.now()}`,
      payment_capture: 1
    };
    const instance = getRazorpayInstance();
    if (!instance) {
      return res.status(500).json({ message: "Payment service not configured" });
    }
    const response = await instance.orders.create(options);
    res.json({
      orderId: response.id,
      amount,
      currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});
router9.post("/verify-payment", async (req, res) => {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const crypto = __require("crypto");
    const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (generated_signature === razorpay_signature) {
      const currentDate = /* @__PURE__ */ new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const startDate = new Date(currentYear, currentMonth, 1);
      const endDate = new Date(currentYear, currentMonth + 1, 0);
      await db.update(orders).set({
        paymentStatus: "paid",
        paymentDate: /* @__PURE__ */ new Date()
      }).where(
        and7(
          eq10(orders.userId, userId),
          eq10(orders.paymentStatus, "pending"),
          gte3(orders.createdAt, startDate),
          lte3(orders.createdAt, endDate)
        )
      );
      res.json({
        success: true,
        message: "Payment verified successfully",
        orderId: razorpay_order_id
      });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
});
var billing_routes_default = router9;

// server/routes/admin-billing.routes.ts
init_db();
init_schema();
import { Router as Router10 } from "express";
import { eq as eq11, and as and8, gte as gte4, lte as lte4, sql as sql3 } from "drizzle-orm";
var router10 = Router10();
router10.get("/", async (req, res) => {
  try {
    const status = req.query.status;
    const userId = req.query.userId;
    let whereConditions = [];
    if (status && status !== "all") {
      whereConditions.push(eq11(bills.status, status));
    }
    if (userId) {
      whereConditions.push(eq11(bills.userId, userId));
    }
    let query = db.select().from(bills);
    if (whereConditions.length > 0) {
      query = query.where(and8(...whereConditions));
    }
    const allBills = await query;
    const billsWithUsers = await Promise.all(
      allBills.map(async (bill) => {
        const user = await db.query.users.findFirst({
          where: eq11(users2.id, bill.userId)
        });
        return { ...bill, user };
      })
    );
    res.json(billsWithUsers);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Failed to fetch bills" });
  }
});
router10.get("/:id", async (req, res) => {
  try {
    const billId = parseInt(req.params.id);
    const bill = await db.query.bills.findFirst({
      where: eq11(bills.id, billId)
    });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    const user = await db.query.users.findFirst({
      where: eq11(users2.id, bill.userId)
    });
    res.json({ ...bill, user });
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Failed to fetch bill" });
  }
});
router10.patch("/:id/mark-paid", async (req, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { paymentMethod } = req.body;
    const updated = await db.update(bills).set({
      status: "paid",
      paymentDate: sql3`now()`,
      paymentMethod: paymentMethod || "manual",
      updatedAt: sql3`now()`
    }).where(eq11(bills.id, billId)).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.json({ success: true, bill: updated[0], message: "Bill marked as paid" });
  } catch (error) {
    console.error("Error marking bill as paid:", error);
    res.status(500).json({ message: "Failed to mark bill as paid" });
  }
});
router10.patch("/:id/extend-due", async (req, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { newDueDate } = req.body;
    if (!newDueDate) {
      return res.status(400).json({ message: "New due date is required" });
    }
    const updated = await db.update(bills).set({
      dueDate: new Date(newDueDate).toISOString().split("T")[0],
      updatedAt: sql3`now()`
    }).where(eq11(bills.id, billId)).returning();
    if (!updated.length) {
      return res.status(404).json({ message: "Bill not found" });
    }
    res.json({ success: true, bill: updated[0], message: "Due date extended" });
  } catch (error) {
    console.error("Error extending due date:", error);
    res.status(500).json({ message: "Failed to extend due date" });
  }
});
router10.patch("/:id/penalty", async (req, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { penaltyAmount } = req.body;
    if (!penaltyAmount || penaltyAmount <= 0) {
      return res.status(400).json({ message: "Invalid penalty amount" });
    }
    const bill = await db.query.bills.findFirst({
      where: eq11(bills.id, billId)
    });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    const newPenalty = Number(bill.penalty || 0) + Number(penaltyAmount);
    const newFinal = Number(bill.finalAmount) - Number(bill.penalty || 0) + newPenalty;
    const updated = await db.update(bills).set({
      penalty: newPenalty,
      finalAmount: newFinal,
      updatedAt: sql3`now()`
    }).where(eq11(bills.id, billId)).returning();
    res.json({ success: true, bill: updated[0], message: `Penalty of \u20B9${penaltyAmount} added` });
  } catch (error) {
    console.error("Error adding penalty:", error);
    res.status(500).json({ message: "Failed to add penalty" });
  }
});
router10.patch("/:id/discount", async (req, res) => {
  try {
    const billId = parseInt(req.params.id);
    const { discountAmount } = req.body;
    if (!discountAmount || discountAmount < 0) {
      return res.status(400).json({ message: "Invalid discount amount" });
    }
    const bill = await db.query.bills.findFirst({
      where: eq11(bills.id, billId)
    });
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }
    const newDiscount = Number(bill.discount || 0) + Number(discountAmount);
    const newFinal = Number(bill.finalAmount) - Number(bill.discount || 0) + newDiscount;
    const updated = await db.update(bills).set({
      discount: newDiscount,
      finalAmount: Math.max(0, newFinal),
      updatedAt: sql3`now()`
    }).where(eq11(bills.id, billId)).returning();
    res.json({ success: true, bill: updated[0], message: `Discount of \u20B9${discountAmount} applied` });
  } catch (error) {
    console.error("Error adding discount:", error);
    res.status(500).json({ message: "Failed to add discount" });
  }
});
router10.post("/generate", async (req, res) => {
  try {
    const { userId, month, year } = req.body;
    if (!userId || !month || !year) {
      return res.status(400).json({ message: "userId, month, and year are required" });
    }
    const existingBill = await db.select().from(bills).where(
      and8(
        eq11(bills.userId, userId),
        eq11(bills.month, month),
        eq11(bills.year, year)
      )
    );
    if (existingBill.length > 0) {
      return res.status(400).json({ message: "Bill already exists for this month" });
    }
    const userSubs = await db.select().from(milkSubscriptions).where(eq11(milkSubscriptions.userId, userId));
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const monthOrders = await db.select().from(orders).where(
      and8(
        eq11(orders.userId, userId),
        gte4(orders.createdAt, startDate),
        lte4(orders.createdAt, endDate)
      )
    );
    let subscriptionTotal = 0;
    const billItems = [];
    for (const sub of userSubs) {
      const product = await db.query.products.findFirst({
        where: eq11(products.id, sub.productId)
      });
      if (product && sub.status === "ACTIVE") {
        const daysInMonth = new Date(year, month, 0).getDate();
        let deliveries = daysInMonth;
        if (sub.frequency === "weekly") {
          deliveries = Math.ceil(daysInMonth / 7);
        } else if (sub.frequency === "alternate") {
          deliveries = Math.ceil(daysInMonth / 2);
        }
        const total = Number(sub.quantity || 0) * Number(sub.pricePerL || product.price) * deliveries;
        subscriptionTotal += total;
        billItems.push({
          type: "subscription",
          productId: sub.productId,
          productName: product.name,
          quantity: deliveries,
          pricePerUnit: sub.pricePerL || product.price,
          total: Math.round(total)
        });
      }
    }
    let ordersTotal = 0;
    for (const order of monthOrders) {
      ordersTotal += Number(order.totalAmount || 0);
      billItems.push({
        type: "order",
        orderId: order.id,
        productName: `Order #${order.id}`,
        quantity: 1,
        pricePerUnit: Number(order.totalAmount || 0),
        total: Math.round(Number(order.totalAmount || 0))
      });
    }
    const dueDate = new Date(year, month - 1, 5);
    const finalAmount = subscriptionTotal + ordersTotal;
    const newBill = await db.insert(bills).values({
      userId,
      month,
      year,
      items: billItems,
      subscriptionTotal,
      ordersTotal,
      previousPending: 0,
      penalty: 0,
      discount: 0,
      finalAmount,
      dueDate: dueDate.toISOString().split("T")[0],
      status: "unpaid"
    }).returning();
    res.json({ success: true, bill: newBill[0], message: "Bill generated successfully" });
  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({ message: "Failed to generate bill" });
  }
});
var admin_billing_routes_default = router10;

// server/routes/rbac.routes.ts
import { Router as Router11 } from "express";
init_schema();
init_db();
import { eq as eq12 } from "drizzle-orm";
import path from "path";
import fs from "fs";
var router11 = Router11();
router11.post("/auth/verify-phone", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    if (otp !== "1234") {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    const userId = `user_${phone.replace(/\D/g, "").slice(-10)}`;
    let user = await storage.getUser(userId);
    if (!user) {
      user = await storage.upsertUser({
        id: userId,
        phone,
        role: "customer"
      });
    }
    req.session.userId = userId;
    req.session.user = { id: userId, phone };
    req.session.userRole = user.role || "customer";
    req.session.userEmail = user.email || null;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session save failed" });
      }
      res.json({ success: true, userId });
    });
  } catch (error) {
    console.error("Error verifying phone:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});
router11.post("/auth/register", async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    if (otp !== "1234") {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    const userId = `user_${phone.replace(/\D/g, "").slice(-10)}`;
    const user = await storage.upsertUser({
      id: userId,
      phone,
      role: "customer"
    });
    req.session.userId = userId;
    req.session.user = { id: userId, phone };
    req.session.userRole = user.role || "customer";
    req.session.userEmail = user.email || null;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Session save failed" });
      }
      res.json({ success: true, userId, redirectTo: "/auth/personal-details" });
    });
  } catch (error) {
    console.error("Error registering:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});
router11.get("/auth/user", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user.id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      profileImageUrl: user.profileImageUrl,
      walletBalance: user.walletBalance,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});
router11.put("/user/profile", async (req, res) => {
  try {
    const userId = req.session?.userId || req.user?.id || req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { firstName, lastName, email, phone, address, gender, dob } = req.body;
    const updatedUser = await storage.updateUser(userId, {
      firstName,
      lastName,
      email,
      phone,
      address,
      gender,
      dob: dob ? new Date(dob) : void 0
    });
    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address
      }
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});
router11.get("/products", async (_req, res) => {
  try {
    const allProducts = await storage.getProducts();
    res.json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});
router11.get("/site-settings", async (_req, res) => {
  try {
    const settings = await storage.getSiteSettings();
    res.json(settings || { brandName: "Divine Naturals" });
  } catch (error) {
    console.error("Error fetching site settings:", error);
    res.status(500).json({ message: "Failed to fetch site settings" });
  }
});
router11.get("/categories", async (req, res) => {
  try {
    const categories2 = await storage.getCategories();
    res.json(categories2);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});
router11.put("/categories/:id", requireAdminAccess, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const updates = req.body;
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const category = await storage.updateCategory(categoryId, updates);
    res.json({ success: true, category, message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
});
router11.delete("/categories/:id", requireAdminAccess, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    await storage.deleteCategory(categoryId);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});
router11.post("/cart", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }
    const cartItem = await storage.addToCart(userId, productId, quantity);
    res.json({ success: true, cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});
router11.get("/cart", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const cartItems2 = await storage.getCartItems(userId);
    res.json(cartItems2);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});
router11.post("/orders", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { deliveryAddress, deliveryDate } = req.body;
    if (!deliveryAddress || !deliveryDate) {
      return res.status(400).json({ message: "Delivery address and date are required" });
    }
    const cartItems2 = await storage.getCartItems(userId);
    if (!cartItems2 || cartItems2.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const totalAmount = cartItems2.reduce((sum, item) => {
      return sum + parseFloat(item.price) * item.quantity;
    }, 0);
    const orderData = {
      userId,
      totalAmount: totalAmount.toFixed(2),
      deliveryAddress,
      deliveryDate,
      status: "pending"
    };
    const order = await storage.createOrder(orderData);
    for (const item of cartItems2) {
      await storage.createOrderItem({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalPrice: (parseFloat(item.price) * item.quantity).toFixed(2)
      });
    }
    await storage.clearCart(userId);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});
router11.get("/milk-subscription", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    res.json(subscription || null);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Failed to fetch subscription" });
  }
});
router11.post("/milk-subscription", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const subscriptionData = insertMilkSubscriptionSchema.parse({ ...req.body, userId });
    const subscription = await storage.createMilkSubscription(subscriptionData);
    res.json({ success: true, subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});
router11.patch("/milk-subscription/:id/pause", requireCustomer, async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const userId = req.user.claims.sub;
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    if (!subscription || subscription.id !== subscriptionId) {
      return res.status(403).json({ message: "Not authorized to pause this subscription" });
    }
    const updated = await storage.updateMilkSubscription(subscriptionId, {
      isPaused: true,
      status: "PAUSED"
    });
    res.json({ success: true, subscription: updated, message: "Subscription paused successfully" });
  } catch (error) {
    console.error("Error pausing subscription:", error);
    res.status(500).json({ message: "Failed to pause subscription" });
  }
});
router11.patch("/milk-subscription/:id/resume", requireCustomer, async (req, res) => {
  try {
    const subscriptionId = parseInt(req.params.id);
    const userId = req.user.claims.sub;
    const subscription = await storage.getMilkSubscriptionByUser(userId);
    if (!subscription || subscription.id !== subscriptionId) {
      return res.status(403).json({ message: "Not authorized to resume this subscription" });
    }
    const updated = await storage.updateMilkSubscription(subscriptionId, {
      isPaused: false,
      status: "ACTIVE"
    });
    res.json({ success: true, subscription: updated, message: "Subscription resumed successfully" });
  } catch (error) {
    console.error("Error resuming subscription:", error);
    res.status(500).json({ message: "Failed to resume subscription" });
  }
});
router11.put("/personal-details", requireCustomer, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { firstName, lastName, email, gender, dob } = req.body;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "First name, last name, and email are required" });
    }
    const updated = await storage.upsertUser({
      id: userId,
      firstName,
      lastName,
      email,
      gender: gender || void 0,
      dob: dob || void 0
    });
    res.json({
      success: true,
      user: {
        id: updated.id,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email
      },
      message: "Personal details saved successfully"
    });
  } catch (error) {
    console.error("Error saving personal details:", error);
    res.status(500).json({ message: "Failed to save personal details" });
  }
});
router11.get(["/vendors/dashboard", "/vendor/dashboard", "/vendor/me/dashboard"], requireVendor, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    const metrics = {
      dailyRequirement: vendor.requirementToday || 0,
      weeklyRevenue: vendor.weeklyEarnings || "0.00",
      fulfillmentRate: vendor.requirementToday > 0 ? (vendor.circulatedLiters / vendor.requirementToday * 100).toFixed(2) : "0.00",
      circulatedLiters: vendor.circulatedLiters || 0,
      revenueToday: vendor.revenueToday || "0.00",
      businessName: vendor.businessName,
      locationName: vendor.locationName,
      isVerified: vendor.isVerified
    };
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching vendor dashboard:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});
router11.post(["/vendors/inward", "/vendor/inward"], requireVendor, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { litersArrived, litersDelivered, litersPending, driverInfo } = req.body;
    if (!litersArrived || !litersDelivered || litersPending === void 0 || !driverInfo) {
      return res.status(400).json({ message: "All inward entry fields are required" });
    }
    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    const inwardEntry = await storage.createInwardLog({
      vendorId: vendor.id,
      litersArrived,
      litersDelivered,
      litersPending,
      driverInfo,
      reportedByUserId: userId,
      sentToAdmin: true,
      status: "PENDING"
    });
    if (litersDelivered > 0) {
      await storage.updateVendorRequirement(vendor.id, litersDelivered);
    }
    res.json({ success: true, inwardEntry });
  } catch (error) {
    console.error("Error logging inward entry:", error);
    res.status(500).json({ message: "Failed to log inward entry" });
  }
});
router11.post("/vendors/driver", requireVendor, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const { name, age, phone, aadharUrl, panUrl } = req.body;
    if (!name || !age || !phone) {
      return res.status(400).json({ message: "Driver name, age, and phone are required" });
    }
    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    const driver = await storage.addDriver({
      name,
      age,
      phone,
      aadharUrl,
      panUrl,
      vendorId: vendor.id
    });
    res.json({ success: true, driver, message: "Driver added successfully" });
  } catch (error) {
    console.error("Error adding driver:", error);
    res.status(500).json({ message: "Failed to add driver" });
  }
});
router11.get("/vendors/drivers", requireVendor, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const vendor = await storage.getVendorByUser(userId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor profile not found" });
    }
    const drivers2 = await storage.getDriversByVendor(vendor.id);
    res.json(drivers2);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
});
router11.get("/delivery/assignments", requireDelivery, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const deliveryPartner = await storage.getDeliveryPartnerByUser(userId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner profile not found" });
    }
    const assignments = await storage.getOrdersForDelivery(deliveryPartner.id);
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching delivery assignments:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
});
router11.put("/delivery/status/:id", requireDelivery, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    const userId = req.user.claims.sub;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const validStatuses = ["pending", "processing", "out_for_delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const deliveryPartner = await storage.getDeliveryPartnerByUser(userId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner profile not found" });
    }
    const order = await storage.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.deliveryPartnerId !== deliveryPartner.id) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }
    const updatedOrder = await storage.updateOrderStatus(orderId, status);
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});
router11.get("/admin/vendors", requireAdmin, async (req, res) => {
  try {
    const vendors2 = await storage.getVendors();
    const vendorList = vendors2.map((vendor) => ({
      id: vendor.id,
      businessName: vendor.businessName,
      locationName: vendor.locationName,
      licenseNumber: vendor.licenseNumber,
      vendorType: vendor.vendorType,
      isApproved: vendor.isVerified,
      // isVerified serves as isApproved
      requirementToday: vendor.requirementToday,
      circulatedLiters: vendor.circulatedLiters,
      revenueToday: vendor.revenueToday,
      createdAt: vendor.createdAt
    }));
    res.json(vendorList);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});
router11.post("/admin/vendors/approve/:id", requireAdmin, async (req, res) => {
  try {
    const vendorId = parseInt(req.params.id);
    if (isNaN(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }
    const vendor = await storage.approveVendor(vendorId);
    res.json({ success: true, vendor, message: "Vendor approved successfully" });
  } catch (error) {
    console.error("Error approving vendor:", error);
    res.status(500).json({ message: "Failed to approve vendor" });
  }
});
router11.post("/admin/update-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const user = await db.query.users.findFirst({
      where: eq12(users.email, email)
    });
    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    await storage.updateUser(user.id, { password: newPassword });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Failed to update password" });
  }
});
router11.post("/admin/categories", requireAdminAccess, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await storage.createCategory({
      name,
      description,
      icon,
      isActive: true
    });
    res.json({ success: true, category, message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Failed to add category" });
  }
});
router11.put("/admin/categories/:id", requireAdminAccess, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const updates = req.body;
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const category = await storage.updateCategory(categoryId, updates);
    res.json({ success: true, category, message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
});
router11.delete("/admin/categories/:id", requireAdminAccess, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    await storage.deleteCategory(categoryId);
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
});
router11.post("/admin/generate-ai-image", requireAdminAccess, async (req, res) => {
  try {
    const { prompt, productName } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required for generation" });
    }
    console.log(`AI Image generation requested for: ${productName}`);
    console.log(`Prompt: ${prompt}`);
    const fileName = `ai_${Date.now()}_${productName.toLowerCase().replace(/\s+/g, "_")}.png`;
    const publicPath = `/images/products/${fileName}`;
    res.json({
      success: true,
      url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800",
      // High-quality milk placeholder
      message: "AI image generated successfully (Demo Mode)"
    });
  } catch (error) {
    console.error("Error generating AI image:", error);
    res.status(500).json({ message: "AI generation failed" });
  }
});
router11.post("/admin/upload-product-image", requireAdminAccess, async (req, res) => {
  try {
    console.log("Upload request received");
    if (!req.files || !req.files.image) {
      console.log("No files in request:", req.files);
      return res.status(400).json({ message: "No image file provided" });
    }
    const image = req.files.image;
    console.log("Received image:", image.name, "Size:", image.size);
    const sanitizedName = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_${sanitizedName}`;
    const uploadPath = path.join(process.cwd(), "public", "products", fileName);
    console.log("Uploading to:", uploadPath);
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      console.log("Creating directory:", dir);
      fs.mkdirSync(dir, { recursive: true });
    }
    await image.mv(uploadPath);
    console.log("File moved successfully");
    const imageUrl = `/products/${fileName}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading product image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});
router11.post("/admin/upload-banner-image", requireAdminAccess, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const image = req.files.image;
    const sanitizedName = image.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}_banner_${sanitizedName}`;
    const uploadPath = path.join(process.cwd(), "public", "banners", fileName);
    const dir = path.dirname(uploadPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await image.mv(uploadPath);
    const imageUrl = `/banners/${fileName}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading banner image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
});
router11.post("/admin/products", requireAdminAccess, async (req, res) => {
  try {
    const { name, description, category, type, price, unit, stock, imageUrl } = req.body;
    if (!name || !category || !type || !price || !unit) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const product = await storage.createProduct({
      name,
      description,
      category,
      type,
      price,
      unit,
      stock: stock || 0,
      imageUrl,
      isActive: true
    });
    res.json({ success: true, product, message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
});
router11.put("/admin/products/:id", requireAdminAccess, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const currentProduct = await storage.getProducts();
    const existingProduct = currentProduct.find((p) => p.id === productId);
    const product = await storage.updateProduct(productId, updates);
    if (updates.stock !== void 0 && existingProduct && existingProduct.stock !== updates.stock) {
      const userId = req.user?.claims?.sub;
      const quantityDiff = updates.stock - existingProduct.stock;
      await storage.recordStockMovement({
        productId,
        type: quantityDiff > 0 ? "IN" : "OUT",
        reason: "ADMIN_ADJUST",
        quantity: quantityDiff,
        previousStock: existingProduct.stock,
        newStock: updates.stock,
        createdBy: userId,
        notes: "Manual stock adjustment by admin"
      });
    }
    res.json({ success: true, product, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});
router11.delete("/admin/products/:id", requireAdminAccess, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await storage.updateProduct(productId, { isActive: false });
    res.json({ success: true, product, message: "Product deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating product:", error);
    res.status(500).json({ message: "Failed to deactivate product" });
  }
});
router11.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const orders2 = await storage.getAllOrders();
    res.json(orders2);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});
router11.put("/admin/orders/:id/assign-delivery", requireAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { deliveryPartnerId } = req.body;
    if (isNaN(orderId) || !deliveryPartnerId) {
      return res.status(400).json({ message: "Order ID and delivery partner ID required" });
    }
    const order = await storage.assignDeliveryPartner(orderId, deliveryPartnerId);
    res.json({ success: true, order, message: "Delivery partner assigned successfully" });
  } catch (error) {
    console.error("Error assigning delivery partner:", error);
    res.status(500).json({ message: "Failed to assign delivery partner" });
  }
});
router11.put("/admin/orders/:id/payment", requireAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { paymentStatus, paymentMethod, paymentDate } = req.body;
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const order = await storage.updateOrderPayment(orderId, {
      paymentStatus,
      paymentMethod,
      paymentDate: paymentDate ? new Date(paymentDate) : /* @__PURE__ */ new Date()
    });
    res.json({ success: true, order, message: "Payment status updated successfully" });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Failed to update payment" });
  }
});
router11.get("/admin/customers", requireAdmin, async (req, res) => {
  try {
    const customers = await storage.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
});
router11.get("/admin/subscriptions", requireAdmin, async (req, res) => {
  try {
    const subscriptions = await storage.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
});
router11.get("/admin/vendors", requireAdmin, async (req, res) => {
  try {
    const vendors2 = await storage.getVendors();
    res.json(vendors2);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
});
router11.post("/admin/cms/privacy-policy", requireAdminAccess, async (req, res) => {
  const updated = await storage.updatePrivacyPolicySettings(req.body);
  res.json(updated);
});
router11.get("/admin/site-settings", requireAdminAccess, async (_req, res) => {
  const settings = await storage.getSiteSettings();
  res.json(settings || { brandName: "Divine Naturals" });
});
router11.post("/admin/site-settings", requireAdminAccess, async (req, res) => {
  const updated = await storage.updateSiteSettings(req.body);
  res.json(updated);
});
router11.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const stats = await storage.getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});
router11.put("/admin/orders/:id", requireAdmin, async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    if (isNaN(orderId) || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }
    const order = await storage.updateOrderStatus(orderId, status);
    res.json({ success: true, order, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});
router11.get("/admin/stock-movements", requireAdmin, async (req, res) => {
  try {
    const movements = await storage.getAllStockMovements();
    res.json(movements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
});
router11.get("/admin/stock-movements/:productId", requireAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const movements = await storage.getStockMovementsByProduct(productId);
    res.json(movements);
  } catch (error) {
    console.error("Error fetching stock movements:", error);
    res.status(500).json({ message: "Failed to fetch stock movements" });
  }
});
router11.post("/storage/upload", requireAdmin, async (req, res) => {
  try {
    const { file, path: path5, data, dataUrl } = req.body;
    if (dataUrl) {
      const timestamp2 = Date.now();
      const uniquePath = `${path5}-${timestamp2}`.replace(/\s+/g, "-");
      return res.json({ url: dataUrl });
    }
    if (data) {
      const timestamp2 = Date.now();
      const uniquePath = `${path5}-${timestamp2}`.replace(/\s+/g, "-");
      const dataURLPrefix = "data:image/jpeg;base64,";
      return res.json({ url: `${dataURLPrefix}${data}` });
    }
    return res.status(400).json({ message: "Please upload via URL or try again" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});
var rbac_routes_default = router11;

// server/routes/banners.routes.ts
init_db();
init_schema();
import { Router as Router12 } from "express";
import { eq as eq13, asc as asc2, and as and9, lte as lte5, gte as gte5, isNull as isNull2, or as or2 } from "drizzle-orm";
var router12 = Router12();
router12.get("/public", async (req, res) => {
  try {
    const now = /* @__PURE__ */ new Date();
    const activeBanners = await db.select().from(banners).where(
      and9(
        eq13(banners.isActive, true),
        or2(
          isNull2(banners.startDate),
          lte5(banners.startDate, now)
        ),
        or2(
          isNull2(banners.endDate),
          gte5(banners.endDate, now)
        )
      )
    ).orderBy(asc2(banners.displayOrder));
    res.json(activeBanners);
  } catch (error) {
    console.error("Error fetching public banners:", error);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
});
router12.get("/", requireAdminAccess, async (req, res) => {
  try {
    const allBanners = await db.select().from(banners).orderBy(asc2(banners.displayOrder));
    res.json(allBanners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
});
router12.post("/", requireAdminAccess, async (req, res) => {
  try {
    const { title, subtitle, imageUrl, imageUrlTablet, imageUrlMobile, ctaText, ctaLink, badgeText, displayOrder, isActive, showOverlay, startDate, endDate } = req.body;
    const [newBanner] = await db.insert(banners).values({
      title,
      subtitle,
      imageUrl,
      imageUrlTablet: imageUrlTablet || null,
      imageUrlMobile: imageUrlMobile || null,
      ctaText,
      ctaLink,
      badgeText,
      displayOrder: displayOrder || 0,
      isActive: isActive !== false,
      showOverlay: showOverlay !== false,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    }).returning();
    res.status(201).json(newBanner);
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({ message: "Failed to create banner" });
  }
});
router12.put("/:id", requireAdminAccess, async (req, res) => {
  try {
    const bannerId = parseInt(req.params.id);
    const { title, subtitle, imageUrl, imageUrlTablet, imageUrlMobile, ctaText, ctaLink, badgeText, displayOrder, isActive, showOverlay, startDate, endDate } = req.body;
    const [updatedBanner] = await db.update(banners).set({
      title,
      subtitle,
      imageUrl,
      imageUrlTablet: imageUrlTablet || null,
      imageUrlMobile: imageUrlMobile || null,
      ctaText,
      ctaLink,
      badgeText,
      displayOrder,
      isActive,
      showOverlay,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq13(banners.id, bannerId)).returning();
    if (!updatedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json(updatedBanner);
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({ message: "Failed to update banner" });
  }
});
router12.delete("/:id", requireAdminAccess, async (req, res) => {
  try {
    const bannerId = parseInt(req.params.id);
    const [deletedBanner] = await db.delete(banners).where(eq13(banners.id, bannerId)).returning();
    if (!deletedBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Failed to delete banner" });
  }
});
router12.get("/sections/public", async (req, res) => {
  try {
    const activeSections = await db.select().from(homepageSections).where(eq13(homepageSections.isActive, true)).orderBy(asc2(homepageSections.displayOrder));
    res.json(activeSections);
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
    res.status(500).json({ message: "Failed to fetch sections" });
  }
});
router12.get("/sections", requireAdminAccess, async (req, res) => {
  try {
    const allSections = await db.select().from(homepageSections).orderBy(asc2(homepageSections.displayOrder));
    res.json(allSections);
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ message: "Failed to fetch sections" });
  }
});
router12.post("/sections", requireAdminAccess, async (req, res) => {
  try {
    const { sectionType, title, subtitle, content, displayOrder, isActive } = req.body;
    if (!sectionType) {
      return res.status(400).json({ message: "Section type is required" });
    }
    const [newSection] = await db.insert(homepageSections).values({
      sectionType,
      title,
      subtitle,
      content,
      displayOrder: displayOrder || 0,
      isActive: isActive !== false
    }).returning();
    res.status(201).json(newSection);
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ message: "Failed to create section" });
  }
});
var banners_routes_default = router12;

// server/routes/homepage.routes.ts
init_db();
init_schema();
import { Router as Router13 } from "express";
import { eq as eq14, asc as asc3, desc as desc3, and as and10, lte as lte6, gte as gte6, isNull as isNull3, or as or3 } from "drizzle-orm";
var router13 = Router13();
router13.get("/ethos/public", async (req, res) => {
  try {
    const cards = await db.select().from(ethosCards).where(eq14(ethosCards.isActive, true)).orderBy(asc3(ethosCards.displayOrder));
    res.json(cards);
  } catch (error) {
    console.error("Error fetching ethos cards:", error);
    res.status(500).json({ message: "Failed to fetch ethos cards" });
  }
});
router13.get("/ethos", requireAdminAccess, async (req, res) => {
  try {
    const cards = await db.select().from(ethosCards).orderBy(asc3(ethosCards.displayOrder));
    res.json(cards);
  } catch (error) {
    console.error("Error fetching ethos cards:", error);
    res.status(500).json({ message: "Failed to fetch ethos cards" });
  }
});
router13.post("/ethos", requireAdminAccess, async (req, res) => {
  try {
    const { title, description, icon, displayOrder, isActive } = req.body;
    const [card] = await db.insert(ethosCards).values({
      title,
      description,
      icon,
      displayOrder: displayOrder || 0,
      isActive: isActive !== false
    }).returning();
    res.status(201).json(card);
  } catch (error) {
    console.error("Error creating ethos card:", error);
    res.status(500).json({ message: "Failed to create ethos card" });
  }
});
router13.put("/ethos/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, icon, displayOrder, isActive } = req.body;
    const [card] = await db.update(ethosCards).set({ title, description, icon, displayOrder, isActive, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(ethosCards.id, id)).returning();
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json(card);
  } catch (error) {
    console.error("Error updating ethos card:", error);
    res.status(500).json({ message: "Failed to update ethos card" });
  }
});
router13.delete("/ethos/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [card] = await db.delete(ethosCards).where(eq14(ethosCards.id, id)).returning();
    if (!card) return res.status(404).json({ message: "Card not found" });
    res.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting ethos card:", error);
    res.status(500).json({ message: "Failed to delete ethos card" });
  }
});
router13.get("/stats/public", async (req, res) => {
  try {
    const counters = await db.select().from(statsCounters).where(eq14(statsCounters.isActive, true)).orderBy(asc3(statsCounters.displayOrder));
    res.json(counters);
  } catch (error) {
    console.error("Error fetching stats counters:", error);
    res.status(500).json({ message: "Failed to fetch stats counters" });
  }
});
router13.get("/stats", requireAdminAccess, async (req, res) => {
  try {
    const counters = await db.select().from(statsCounters).orderBy(asc3(statsCounters.displayOrder));
    res.json(counters);
  } catch (error) {
    console.error("Error fetching stats counters:", error);
    res.status(500).json({ message: "Failed to fetch stats counters" });
  }
});
router13.post("/stats", requireAdminAccess, async (req, res) => {
  try {
    const { label, value, suffix, icon, displayOrder, isActive } = req.body;
    const [counter] = await db.insert(statsCounters).values({
      label,
      value,
      suffix,
      icon,
      displayOrder: displayOrder || 0,
      isActive: isActive !== false
    }).returning();
    res.status(201).json(counter);
  } catch (error) {
    console.error("Error creating stats counter:", error);
    res.status(500).json({ message: "Failed to create stats counter" });
  }
});
router13.put("/stats/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { label, value, suffix, icon, displayOrder, isActive } = req.body;
    const [counter] = await db.update(statsCounters).set({ label, value, suffix, icon, displayOrder, isActive, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(statsCounters.id, id)).returning();
    if (!counter) return res.status(404).json({ message: "Counter not found" });
    res.json(counter);
  } catch (error) {
    console.error("Error updating stats counter:", error);
    res.status(500).json({ message: "Failed to update stats counter" });
  }
});
router13.delete("/stats/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [counter] = await db.delete(statsCounters).where(eq14(statsCounters.id, id)).returning();
    if (!counter) return res.status(404).json({ message: "Counter not found" });
    res.json({ message: "Counter deleted successfully" });
  } catch (error) {
    console.error("Error deleting stats counter:", error);
    res.status(500).json({ message: "Failed to delete stats counter" });
  }
});
router13.get("/faqs/public", async (req, res) => {
  try {
    const faqList = await db.select().from(faqs2).where(eq14(faqs2.isActive, true)).orderBy(asc3(faqs2.displayOrder));
    res.json(faqList);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});
router13.get("/faqs", requireAdminAccess, async (req, res) => {
  try {
    const faqList = await db.select().from(faqs2).orderBy(asc3(faqs2.displayOrder));
    res.json(faqList);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
});
router13.post("/faqs", requireAdminAccess, async (req, res) => {
  try {
    const { question, answer, category, displayOrder, isActive } = req.body;
    const [faq] = await db.insert(faqs2).values({
      question,
      answer,
      category: category || "General",
      displayOrder: displayOrder || 0,
      isActive: isActive !== false
    }).returning();
    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "Failed to create FAQ" });
  }
});
router13.put("/faqs/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { question, answer, category, displayOrder, isActive } = req.body;
    const [faq] = await db.update(faqs2).set({ question, answer, category, displayOrder, isActive, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(faqs2.id, id)).returning();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json(faq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ message: "Failed to update FAQ" });
  }
});
router13.delete("/faqs/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [faq] = await db.delete(faqs2).where(eq14(faqs2.id, id)).returning();
    if (!faq) return res.status(404).json({ message: "FAQ not found" });
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
});
router13.get("/deals/public", async (req, res) => {
  try {
    const now = /* @__PURE__ */ new Date();
    const deals = await db.select({
      id: productDeals.id,
      productId: productDeals.productId,
      dealType: productDeals.dealType,
      dealValue: productDeals.dealValue,
      badgeText: productDeals.badgeText,
      priority: productDeals.priority,
      product: products
    }).from(productDeals).innerJoin(products, eq14(productDeals.productId, products.id)).where(
      and10(
        eq14(productDeals.isActive, true),
        eq14(products.isActive, true),
        or3(isNull3(productDeals.startsAt), lte6(productDeals.startsAt, now)),
        or3(isNull3(productDeals.endsAt), gte6(productDeals.endsAt, now))
      )
    ).orderBy(asc3(productDeals.priority));
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
});
router13.get("/deals", requireAdminAccess, async (req, res) => {
  try {
    const deals = await db.select({
      id: productDeals.id,
      productId: productDeals.productId,
      dealType: productDeals.dealType,
      dealValue: productDeals.dealValue,
      badgeText: productDeals.badgeText,
      priority: productDeals.priority,
      startsAt: productDeals.startsAt,
      endsAt: productDeals.endsAt,
      isActive: productDeals.isActive,
      product: products
    }).from(productDeals).leftJoin(products, eq14(productDeals.productId, products.id)).orderBy(asc3(productDeals.priority));
    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Failed to fetch deals" });
  }
});
router13.post("/deals", requireAdminAccess, async (req, res) => {
  try {
    const { productId, dealType, dealValue, badgeText, priority, startsAt, endsAt, isActive } = req.body;
    const [deal] = await db.insert(productDeals).values({
      productId,
      dealType: dealType || "PERCENT",
      dealValue,
      badgeText,
      priority: priority || 0,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      isActive: isActive !== false
    }).returning();
    res.status(201).json(deal);
  } catch (error) {
    console.error("Error creating deal:", error);
    res.status(500).json({ message: "Failed to create deal" });
  }
});
router13.put("/deals/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { productId, dealType, dealValue, badgeText, priority, startsAt, endsAt, isActive } = req.body;
    const [deal] = await db.update(productDeals).set({
      productId,
      dealType,
      dealValue,
      badgeText,
      priority,
      startsAt: startsAt ? new Date(startsAt) : null,
      endsAt: endsAt ? new Date(endsAt) : null,
      isActive,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq14(productDeals.id, id)).returning();
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json(deal);
  } catch (error) {
    console.error("Error updating deal:", error);
    res.status(500).json({ message: "Failed to update deal" });
  }
});
router13.delete("/deals/:id", requireAdminAccess, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [deal] = await db.delete(productDeals).where(eq14(productDeals.id, id)).returning();
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    res.status(500).json({ message: "Failed to delete deal" });
  }
});
router13.get("/new-products/public", async (req, res) => {
  try {
    const newProducts = await db.select().from(products).where(and10(eq14(products.isActive, true), eq14(products.isNew, true))).orderBy(desc3(products.launchedAt), desc3(products.createdAt)).limit(8);
    res.json(newProducts);
  } catch (error) {
    console.error("Error fetching new products:", error);
    res.status(500).json({ message: "Failed to fetch new products" });
  }
});
router13.get("/newsletter/public", async (req, res) => {
  try {
    const [settings] = await db.select().from(newsletterSettings).where(eq14(newsletterSettings.isActive, true)).limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching newsletter settings:", error);
    res.status(500).json({ message: "Failed to fetch newsletter settings" });
  }
});
router13.get("/newsletter", requireAdminAccess, async (req, res) => {
  try {
    const [settings] = await db.select().from(newsletterSettings).limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching newsletter settings:", error);
    res.status(500).json({ message: "Failed to fetch newsletter settings" });
  }
});
router13.put("/newsletter", requireAdminAccess, async (req, res) => {
  try {
    const { title, subtitle, ctaText, placeholderText, isActive } = req.body;
    const [existing] = await db.select().from(newsletterSettings).limit(1);
    if (existing) {
      const [updated] = await db.update(newsletterSettings).set({ title, subtitle, ctaText, placeholderText, isActive, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(newsletterSettings.id, existing.id)).returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(newsletterSettings).values({ title, subtitle, ctaText, placeholderText, isActive }).returning();
      res.status(201).json(created);
    }
  } catch (error) {
    console.error("Error updating newsletter settings:", error);
    res.status(500).json({ message: "Failed to update newsletter settings" });
  }
});
router13.get("/footer/public", async (req, res) => {
  try {
    const [settings] = await db.select().from(footerSettings).where(eq14(footerSettings.isActive, true)).limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    res.status(500).json({ message: "Failed to fetch footer settings" });
  }
});
router13.get("/footer", requireAdminAccess, async (req, res) => {
  try {
    const [settings] = await db.select().from(footerSettings).limit(1);
    res.json(settings || null);
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    res.status(500).json({ message: "Failed to fetch footer settings" });
  }
});
router13.put("/footer", requireAdminAccess, async (req, res) => {
  try {
    const { companyName, tagline, description, phone, email, address, socialLinks, footerLinks, copyrightText, isActive } = req.body;
    const [existing] = await db.select().from(footerSettings).limit(1);
    if (existing) {
      const [updated] = await db.update(footerSettings).set({ companyName, tagline, description, phone, email, address, socialLinks, footerLinks, copyrightText, isActive, updatedAt: /* @__PURE__ */ new Date() }).where(eq14(footerSettings.id, existing.id)).returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(footerSettings).values({ companyName, tagline, description, phone, email, address, socialLinks, footerLinks, copyrightText, isActive }).returning();
      res.status(201).json(created);
    }
  } catch (error) {
    console.error("Error updating footer settings:", error);
    res.status(500).json({ message: "Failed to update footer settings" });
  }
});
var homepage_routes_default = router13;

// server/routes/cms.routes.ts
init_db();
init_schema();
import { Router as Router14 } from "express";
import { eq as eq15 } from "drizzle-orm";
var router14 = Router14();
router14.get("/about-us/public", async (req, res) => {
  try {
    const [data] = await db.select().from(aboutUsSettings).where(eq15(aboutUsSettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about us" });
  }
});
router14.get("/about-us", requireAdminAccess, async (req, res) => {
  try {
    const [data] = await db.select().from(aboutUsSettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch about us" });
  }
});
router14.put("/about-us", requireAdminAccess, async (req, res) => {
  try {
    const {
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      heroCtaText,
      heroCtaLink,
      storyHeading,
      storyDescription,
      storyImageUrl,
      valuesTitle,
      values,
      processTitle,
      processSteps,
      ctaHeading,
      ctaSubheading,
      ctaButtonText,
      ctaButtonLink,
      isActive
    } = req.body;
    const [data] = await db.update(aboutUsSettings).set({
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      heroCtaText,
      heroCtaLink,
      storyHeading,
      storyDescription,
      storyImageUrl,
      valuesTitle,
      values,
      processTitle,
      processSteps,
      ctaHeading,
      ctaSubheading,
      ctaButtonText,
      ctaButtonLink,
      isActive,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq15(aboutUsSettings.id, 1)).returning();
    res.json(data);
  } catch (error) {
    console.error("Update About Us error:", error);
    res.status(500).json({ message: "Failed to update about us" });
  }
});
router14.get("/contact/public", async (req, res) => {
  try {
    const [data] = await db.select().from(contactSettings).where(eq15(contactSettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact info" });
  }
});
router14.get("/contact", requireAdminAccess, async (req, res) => {
  try {
    const [data] = await db.select().from(contactSettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contact info" });
  }
});
router14.put("/contact", requireAdminAccess, async (req, res) => {
  try {
    const {
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      phone,
      email,
      address,
      businessHours,
      socialLinks,
      mapEmbedUrl,
      isActive
    } = req.body;
    const [data] = await db.update(contactSettings).set({
      heroTitle,
      heroSubtitle,
      heroImageUrl,
      phone,
      email,
      address,
      businessHours,
      socialLinks,
      mapEmbedUrl,
      isActive,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq15(contactSettings.id, 1)).returning();
    res.json(data);
  } catch (error) {
    console.error("Update Contact error:", error);
    res.status(500).json({ message: "Failed to update contact info" });
  }
});
router14.get("/terms-of-service/public", async (req, res) => {
  try {
    const [data] = await db.select().from(termsOfServiceSettings).where(eq15(termsOfServiceSettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch terms of service" });
  }
});
router14.get("/terms-of-service", requireAdminAccess, async (req, res) => {
  try {
    const [data] = await db.select().from(termsOfServiceSettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch terms of service" });
  }
});
router14.put("/terms-of-service", requireAdminAccess, async (req, res) => {
  try {
    const { title, content, sections, isActive } = req.body;
    const [data] = await db.update(termsOfServiceSettings).set({ title, content, sections, isActive, updatedAt: /* @__PURE__ */ new Date() }).where(eq15(termsOfServiceSettings.id, 1)).returning();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update terms of service" });
  }
});
router14.get("/privacy-policy/public", async (req, res) => {
  try {
    const [data] = await db.select().from(privacyPolicySettings).where(eq15(privacyPolicySettings.isActive, true));
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch privacy policy" });
  }
});
router14.get("/privacy-policy", requireAdminAccess, async (req, res) => {
  try {
    const [data] = await db.select().from(privacyPolicySettings);
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch privacy policy" });
  }
});
router14.put("/privacy-policy", requireAdminAccess, async (req, res) => {
  try {
    const { title, content, sections, isActive } = req.body;
    const [data] = await db.update(privacyPolicySettings).set({ title, content, sections, isActive, updatedAt: /* @__PURE__ */ new Date() }).where(eq15(privacyPolicySettings.id, 1)).returning();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to update privacy policy" });
  }
});
var cms_routes_default = router14;

// server/routes/contact-submissions.routes.ts
init_db();
init_schema();
import { eq as eq16, desc as desc4 } from "drizzle-orm";
function setupContactSubmissionsRoutes(app2) {
  app2.post("/api/contact-submissions", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Name, email and message are required" });
      }
      const [submission] = await db.insert(contactSubmissions).values({ name, email, phone, message, status: "new" }).returning();
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });
  app2.get("/api/admin/contact-submissions", async (req, res) => {
    try {
      const submissions = await db.select().from(contactSubmissions).orderBy(desc4(contactSubmissions.createdAt));
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });
  app2.put("/api/admin/contact-submissions/:id/read", async (req, res) => {
    try {
      const [submission] = await db.update(contactSubmissions).set({ status: "read", updatedAt: /* @__PURE__ */ new Date() }).where(eq16(contactSubmissions.id, parseInt(req.params.id))).returning();
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to update submission" });
    }
  });
  app2.delete("/api/admin/contact-submissions/:id", async (req, res) => {
    try {
      await db.delete(contactSubmissions).where(eq16(contactSubmissions.id, parseInt(req.params.id)));
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete submission" });
    }
  });
}

// server/jobs/auto-delivery.ts
init_db();
init_schema();
import { eq as eq17 } from "drizzle-orm";
async function generateDailyDeliveries() {
  try {
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    const activeSubscriptions = await db.select().from(milkSubscriptions).where(eq17(milkSubscriptions.status, "ACTIVE"));
    for (const sub of activeSubscriptions) {
      if (sub.frequency === "daily") {
        await db.insert(subscriptionDeliveries).values({
          subscriptionId: sub.id,
          userId: sub.userId,
          deliveryDate: new Date(tomorrowStr),
          quantity: sub.quantity,
          status: "UPCOMING"
        }).catch(() => null);
      } else if (sub.frequency === "weekly") {
        const dayOfWeek = tomorrow.getDay();
        if (dayOfWeek === 0) {
          await db.insert(subscriptionDeliveries).values({
            subscriptionId: sub.id,
            userId: sub.userId,
            deliveryDate: new Date(tomorrowStr),
            quantity: sub.quantity,
            status: "UPCOMING"
          }).catch(() => null);
        }
      } else if (sub.frequency === "alternate") {
        const lastDelivery = await db.select().from(subscriptionDeliveries).where(eq17(subscriptionDeliveries.subscriptionId, sub.id));
        if (lastDelivery.length === 0) {
          await db.insert(subscriptionDeliveries).values({
            subscriptionId: sub.id,
            userId: sub.userId,
            deliveryDate: new Date(tomorrowStr),
            quantity: sub.quantity,
            status: "UPCOMING"
          }).catch(() => null);
        }
      }
    }
    console.log(`\u2705 Generated deliveries for ${tomorrow.toDateString()}`);
  } catch (error) {
    console.error("\u274C Error generating daily deliveries:", error);
  }
}
function startDeliveryScheduler() {
  const midnight = () => {
    const now = /* @__PURE__ */ new Date();
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0);
    return tomorrow.getTime() - now.getTime();
  };
  setInterval(generateDailyDeliveries, midnight());
}

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  setupAuthRoutes(app2);
  setupContactSubmissionsRoutes(app2);
  startDeliveryScheduler();
  app2.use("/api/cart", cart_routes_default);
  app2.use("/api/addresses", address_routes_default);
  app2.use("/api/orders", order_routes_default);
  app2.get("/api/admin/orders", requireAdminAccess, async (req, res) => {
    try {
      const { orders: orders2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const status = req.query.status;
      let allOrders = await db2.select().from(orders2);
      if (status) allOrders = allOrders.filter((o) => o.status === status);
      res.json(allOrders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.post("/api/admin/orders/:id/update-status", requireAdminAccess, async (req, res) => {
    try {
      const { orders: orders2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { eq: eq23 } = await import("drizzle-orm");
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
  app2.delete("/api/admin/orders/:id", requireAdminAccess, async (req, res) => {
    try {
      const { orders: orders2, orderItems: orderItems4 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const { eq: eq23 } = await import("drizzle-orm");
      const orderId = parseInt(req.params.id);
      await db2.delete(orderItems4).where(eq23(orderItems4.orderId, orderId));
      const deleted = await db2.delete(orders2).where(eq23(orders2.id, orderId)).returning();
      if (!deleted.length) return res.status(404).json({ message: "Order not found" });
      res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order" });
    }
  });
  app2.use("/api/admin/customers", admin_customers_routes_default);
  app2.use("/api/admin/billing", admin_billing_routes_default);
  app2.use("/api/support", support_routes_default);
  app2.use("/api/offers", offers_routes_default);
  app2.use("/api/subscriptions", subscription_routes_default);
  app2.use("/api/admin/subscriptions", admin_subscriptions_routes_default);
  app2.use("/api/billing", billing_routes_default);
  app2.use("/api/banners", banners_routes_default);
  app2.use("/api/homepage", homepage_routes_default);
  app2.use("/api/cms", cms_routes_default);
  app2.use("/api", rbac_routes_default);
  app2.get("/api/auth/user", async (req, res) => {
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
  app2.get("/api/notifications", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications2 = await storage.getNotificationsByUser(userId);
      res.json(notifications2);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  app2.patch("/api/notifications/:id/read", isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(notificationId);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });
  app2.get("/api/bills/:billId/pdf", async (req, res) => {
    try {
      const billId = parseInt(req.params.billId);
      const { getBillInvoiceData: getBillInvoiceData2, createInvoiceHTML: createInvoiceHTML2 } = await Promise.resolve().then(() => (init_generateInvoice(), generateInvoice_exports));
      const invoiceData = await getBillInvoiceData2(billId);
      if (!invoiceData) {
        return res.status(404).json({ message: "Bill not found" });
      }
      const html = createInvoiceHTML2(invoiceData);
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Content-Disposition", `attachment; filename="invoice_${billId}.html"`);
      res.send(html);
    } catch (error) {
      console.error("Error generating invoice:", error);
      res.status(500).json({ message: "Failed to generate invoice" });
    }
  });
  app2.post("/api/billing/:billId/mark-paid", async (req, res) => {
    try {
      const billId = parseInt(req.params.billId);
      const userId = req.session?.userId || req.user?.claims?.sub;
      const { bills: bills2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
      const { eq: eq23 } = await import("drizzle-orm");
      const { db: db2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const bill = await db2.select().from(bills2).where(eq23(bills2.id, billId));
      if (!bill.length || bill[0].userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const updated = await db2.update(bills2).set({
        status: "paid",
        paymentDate: /* @__PURE__ */ new Date(),
        paymentMethod: "cash"
      }).where(eq23(bills2.id, billId)).returning();
      res.json(updated[0]);
    } catch (error) {
      console.error("Error marking bill as paid:", error);
      res.status(500).json({ message: "Failed to mark bill as paid" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/seed.ts
init_db();
init_schema();
import { eq as eq19 } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid as nanoid3 } from "nanoid";
async function seedDatabase() {
  try {
    console.log("Seeding database...");
    const adminEmail = "md@divinenaturals.in";
    const existingUsers = await db.select().from(users2).where(eq19(users2.email, adminEmail));
    if (existingUsers.length > 0) {
      console.log("Database already seeded. Updating CMS content only...");
    } else {
      const hashedPassword = await bcrypt.hash("DivineNaturals@2025", 10);
      const [adminUser] = await db.insert(users2).values({
        id: nanoid3(),
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "admin",
        firstName: "Kauldeep",
        lastName: "Rao",
        phone: "1800-DIVINE"
      }).returning();
      const [customerUser] = await db.insert(users2).values({
        id: nanoid3(),
        email: "customer@example.com",
        passwordHash: hashedPassword,
        role: "customer",
        firstName: "Test",
        lastName: "Customer",
        phone: "9876543210",
        address: "123 Green Lane, Mumbai"
      }).returning();
      const [partnerUser] = await db.insert(users2).values({
        id: nanoid3(),
        email: "delivery@example.com",
        passwordHash: hashedPassword,
        role: "delivery",
        firstName: "Delivery",
        lastName: "Hero"
      }).returning();
      await db.insert(deliveryPartners).values({
        userId: partnerUser.id,
        fullName: "Delivery Hero",
        phone: "9123456789",
        vehicleType: "Bike",
        status: "active"
      });
      console.log("\u2713 Inserted/Updated Base Data (Users)");
    }
    const baseProducts = [
      {
        name: "Cold Pressed Coconut Oil",
        description: "Pure, edible grade cold pressed coconut oil. Multi-purpose oil with a fresh coconut aroma and superior quality.",
        price: "380",
        unit: "500ml",
        stock: 100,
        category: "Oil",
        type: "DAIRY",
        imageUrl: "/products/coconut_oil.png",
        sku: "OIL-COCO-001"
      },
      {
        name: "Cold Pressed Groundnut Oil",
        description: "Pure and aromatic cold pressed groundnut oil. Extracted using traditional wooden ghani methods to retain nutrients and natural flavor.",
        price: "280",
        unit: "1L",
        stock: 150,
        category: "Oil",
        type: "DAIRY",
        imageUrl: "/products/groundnut_oil.png",
        sku: "OIL-GNUT-001"
      },
      {
        name: "Buttermilk",
        description: "Refreshing traditional buttermilk",
        price: "25",
        unit: "500ml",
        stock: 300,
        category: "Beverages",
        type: "DAIRY",
        imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800",
        sku: "DAIRY-BMLK-001"
      }
    ];
    for (const p of baseProducts) {
      const [existing] = await db.select().from(products).where(eq19(products.sku, p.sku));
      if (existing) {
        await db.update(products).set(p).where(eq19(products.sku, p.sku));
      } else {
        await db.insert(products).values(p);
      }
    }
    console.log("\u2713 Updated Products from seed data");
    console.log("Refreshing CMS content with premium assets...");
    await db.delete(banners);
    await db.insert(banners).values([
      {
        title: "Pure. Fresh. From Our Farm to Your Home.",
        subtitle: "Experience the authentic taste of raw A2 Gir Cow milk, delivered directly to your doorstep every morning.",
        imageUrl: "/banners/farm_milk_bottles_pastoral_scene.png",
        imageUrlTablet: "/banners/farm_milk_bottles_pastoral_scene.png",
        imageUrlMobile: "/banners/farm_milk_bottles_pastoral_scene.png",
        ctaText: "Start Subscription",
        ctaLink: "/shop",
        displayOrder: 1,
        isActive: true
      },
      {
        title: "Unmatched Delivery. Consistent Quality.",
        subtitle: "At Divine Naturals, we take pride in our 4:00 AM delivery promise. Freshness that doesn't wait.",
        imageUrl: "/banners/fresh_milk_pour_splash_banner.png",
        imageUrlTablet: "/banners/fresh_milk_pour_splash_banner.png",
        imageUrlMobile: "/banners/fresh_milk_pour_splash_banner.png",
        ctaText: "View Products",
        ctaLink: "/shop",
        displayOrder: 2,
        isActive: true
      },
      {
        title: "Traditional Goodness, Modern Safety.",
        subtitle: "We use the traditional Bilona method for Ghee and state-of-the-art testing for every batch of milk.",
        imageUrl: "/banners/premium_dairy_products_showcase.png",
        imageUrlTablet: "/banners/premium_dairy_products_showcase.png",
        imageUrlMobile: "/banners/premium_dairy_products_showcase.png",
        ctaText: "Learn About Us",
        ctaLink: "/about",
        displayOrder: 3,
        isActive: true
      }
    ]);
    console.log("\u2713 Updated 3 Hero Banners");
    await db.delete(ethosCards);
    await db.insert(ethosCards).values([
      {
        title: "Source Transparency",
        description: "Every bottle of milk can be traced back to the specific farm it came from.",
        icon: "Shield",
        displayOrder: 1
      },
      {
        title: "Zero Preservatives",
        description: "Fresh milk with absolutely no additives, milk powder, or preservatives.",
        icon: "Zap",
        displayOrder: 2
      },
      {
        title: "Eco-Friendly Loop",
        description: "We use sterilized glass bottles and sustainable packaging to protect our planet.",
        icon: "Recycle",
        displayOrder: 3
      },
      {
        title: "Smart Subscriptions",
        description: "Pause, resume, and modify your daily dairy needs through our easy-to-use app.",
        icon: "Smartphone",
        displayOrder: 4
      }
    ]);
    console.log("\u2713 Updated 4 Ethos Cards");
    await db.delete(statsCounters);
    await db.insert(statsCounters).values([
      { label: "Happy Households", value: 12e3, suffix: "+", icon: "Users", displayOrder: 1 },
      { label: "Liters of Milk Daily", value: 5500, suffix: "L", icon: "Milk", displayOrder: 2 },
      { label: "Partner Farms", value: 45, suffix: "", icon: "Home", displayOrder: 3 },
      { label: "On-Time Deliveries", value: 99, suffix: ".8%", icon: "Clock", displayOrder: 4 }
    ]);
    console.log("\u2713 Updated 4 Stats Counters");
    await db.delete(faqs2);
    await db.insert(faqs2).values([
      {
        question: "How do subscriptions work?",
        answer: "You can choose your products, set the quantity and frequency (daily, alternate days, or custom), and we'll deliver them automatically. You can pause or cancel anytime through the app.",
        category: "Delivery",
        order: 1,
        displayOrder: 1
      },
      {
        question: "Is there a minimum delivery amount?",
        answer: "No, we don't believe in forcing our customers. You can subscribe to even a single half-liter packet or bottle of milk.",
        category: "Delivery",
        order: 2,
        displayOrder: 2
      },
      {
        question: "How is the milk tested for quality?",
        answer: "We test across 50+ parameters including milk fat, protein, SNF, and the absence of water, urea, or any preservatives in our ISO-certified labs.",
        category: "Quality",
        order: 3,
        displayOrder: 3
      }
    ]);
    console.log("\u2713 Updated 3 FAQs");
    const [existingAbout] = await db.select().from(aboutUsSettings).limit(1);
    const aboutData = {
      title: "The Divine Naturals Story",
      subtitle: "Returning to Root-Level Purity",
      content: "Founded with a single mission to restore the vanishing purity of farm-fresh milk in our cities, Divine Naturals has grown into a community of conscious consumers and ethical farmers. We leverage technology to bridge the gap between rural farms and urban doorsteps, ensuring that what you drink is as fresh as it was at the farm.",
      imageUrl: "/images/products/milk.png",
      mission: "To deliver the purest dairy products while empowering traditional farming communities through technology and fair commerce.",
      vision: "A world where fresh, organic, and ethically sourced nutrition is accessible to every household daily.",
      values: [
        { title: "Radical Transparency", description: "Trace every drop back to the farm" },
        { title: "Empowering Farmers", description: "Eliminating middlemen and ensuring fair trade" },
        { title: "Environmental Stewardship", description: "Minimizing waste through sustainable packaging" }
      ],
      isActive: true
    };
    if (existingAbout) {
      await db.update(aboutUsSettings).set(aboutData).where(eq19(aboutUsSettings.id, existingAbout.id));
    } else {
      await db.insert(aboutUsSettings).values(aboutData);
    }
    const [existingContact] = await db.select().from(contactSettings).limit(1);
    const contactData = {
      title: "Get in Touch",
      subtitle: "Our customer success team is here for you 24/7.",
      phone: "+91 91234 56789",
      email: "hello@divinenaturals.com",
      address: "Divine Naturals Hub, Sector 44, Gurgaon, Haryana 122003",
      businessHours: "Delivery: 4:00 AM - 7:30 AM | Support: 9:00 AM - 9:00 PM",
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com/divinenaturals" },
        { platform: "instagram", url: "https://instagram.com/divinenaturals" },
        { platform: "whatsapp", url: "https://wa.me/919123456789" }
      ],
      isActive: true
    };
    if (existingContact) {
      await db.update(contactSettings).set(contactData).where(eq19(contactSettings.id, existingContact.id));
    } else {
      await db.insert(contactSettings).values(contactData);
    }
    const [existingNewsletter] = await db.select().from(newsletterSettings).limit(1);
    const newsletterData = {
      title: "Join the Freshness Revolution",
      subtitle: "Get nutrition tips, farm stories, and exclusive offers delivered to your inbox.",
      ctaText: "Subscribe",
      placeholderText: "Enter your email address",
      isActive: true
    };
    if (existingNewsletter) {
      await db.update(newsletterSettings).set(newsletterData).where(eq19(newsletterSettings.id, existingNewsletter.id));
    } else {
      await db.insert(newsletterSettings).values(newsletterData);
    }
    const [existingFooter] = await db.select().from(footerSettings).limit(1);
    const footerData = {
      companyName: "Divine Naturals Dairy Pvt Ltd",
      tagline: "Pure. Fresh. Daily.",
      description: "Dedicated to bringing the authentic taste and nutrition of the farm to the modern table through sustainable and ethical practices.",
      phone: "+91 91234 56789",
      email: "hello@divinenaturals.com",
      address: "Sector 44, Gurgaon, Haryana 122003",
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com/divinenaturals" },
        { platform: "instagram", url: "https://instagram.com/divinenaturals" },
        { platform: "whatsapp", url: "https://wa.me/919123456789" }
      ],
      footerLinks: [
        { title: "Products", links: [{ label: "Milk", url: "/shop" }, { label: "Curd", url: "/shop" }, { label: "Ghee", url: "/shop" }] },
        { title: "Company", links: [{ label: "About Us", url: "/about" }, { label: "Contact", url: "/contact" }, { label: "Privacy", url: "/privacy" }] }
      ],
      copyrightText: "\xA9 2025 Divine Naturals. All rights reserved.",
      isActive: true
    };
    if (existingFooter) {
      await db.update(footerSettings).set(footerData).where(eq19(footerSettings.id, existingFooter.id));
    } else {
      await db.insert(footerSettings).values(footerData);
    }
    console.log("\u2713 Enriched CMS content");
    console.log("\u2705 Database seeding/update completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// server/jobs/generateMonthlyBills.ts
init_db();
init_schema();
import { eq as eq20, and as and11, gte as gte7, lte as lte7 } from "drizzle-orm";
async function generateMonthlyBills() {
  console.log("\u{1F550} Starting monthly bill generation...");
  try {
    const now = /* @__PURE__ */ new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const month = prevMonth.getMonth() + 1;
    const year = prevMonth.getFullYear();
    const allUsers = await db.select().from(users2);
    for (const user of allUsers) {
      const existingBill = await db.select().from(bills).where(
        and11(
          eq20(bills.userId, user.id),
          eq20(bills.month, month),
          eq20(bills.year, year)
        )
      );
      if (existingBill.length > 0) {
        console.log(`\u23ED\uFE0F  Bill already exists for user ${user.id} in ${month}/${year}`);
        continue;
      }
      const startDateStr = `${year}-${String(month).padStart(2, "0")}-01`;
      const endDateStr = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;
      const subscriptionDeliveries_list = await db.select().from(subscriptionDeliveries).where(
        and11(
          eq20(subscriptionDeliveries.userId, user.id),
          gte7(subscriptionDeliveries.deliveryDate, startDateStr),
          lte7(subscriptionDeliveries.deliveryDate, endDateStr)
        )
      );
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const monthOrders = await db.select().from(orders).where(
        and11(
          eq20(orders.userId, user.id),
          gte7(orders.createdAt, startDate),
          lte7(orders.createdAt, endDate)
        )
      );
      let subscriptionTotal = 0;
      const billItems = [];
      for (const delivery of subscriptionDeliveries_list) {
        const sub = await db.query.milkSubscriptions.findFirst({
          where: eq20(milkSubscriptions.id, delivery.subscriptionId)
        });
        if (sub) {
          const product = await db.query.products.findFirst({
            where: eq20(products.id, sub.productId)
          });
          const total = Number(delivery.quantity) * Number(product?.price || 0);
          subscriptionTotal += total;
          billItems.push({
            date: String(delivery.deliveryDate),
            description: `${product?.name || "Product"} (Subscription)`,
            quantity: delivery.quantity,
            price: Number(product?.price || 0),
            total
          });
        }
      }
      let ordersTotal = 0;
      for (const order of monthOrders) {
        const orderAmount = Number(order.totalAmount || 0);
        ordersTotal += orderAmount;
        billItems.push({
          date: new Date(order.createdAt).toISOString().split("T")[0],
          description: `Order #${order.id}`,
          quantity: 1,
          price: orderAmount,
          total: orderAmount
        });
      }
      const previousBill = await db.select().from(bills).where(
        and11(
          eq20(bills.userId, user.id),
          eq20(bills.status, "unpaid")
        )
      );
      const previousPending = previousBill.length > 0 ? Number(previousBill[0].finalAmount || 0) : 0;
      let penalty = 0;
      if (previousBill.length > 0 && previousBill[0].status === "overdue") {
        penalty = 50;
      }
      const finalAmount = subscriptionTotal + ordersTotal + previousPending + penalty;
      const dueDate = /* @__PURE__ */ new Date();
      dueDate.setDate(dueDate.getDate() + 5);
      const dueDateStr = dueDate.toISOString().split("T")[0];
      await db.insert(bills).values({
        userId: user.id,
        month,
        year,
        items: JSON.stringify(billItems),
        subscriptionTotal: subscriptionTotal.toString(),
        ordersTotal: ordersTotal.toString(),
        previousPending: previousPending.toString(),
        penalty: penalty.toString(),
        discount: "0",
        finalAmount: finalAmount.toString(),
        dueDate: dueDateStr,
        status: "unpaid",
        paymentDate: null,
        paymentMethod: null
      });
      console.log(`\u2705 Bill created for user ${user.id} in ${month}/${year} - Amount: \u20B9${finalAmount}`);
    }
    console.log("\u2705 Monthly bill generation completed!");
  } catch (error) {
    console.error("\u274C Error generating monthly bills:", error);
  }
}
async function updateOverdueBills() {
  console.log("\u{1F550} Checking for overdue bills...");
  try {
    const allBills = await db.select().from(bills).where(eq20(bills.status, "unpaid"));
    for (const bill of allBills) {
      const dueDate = new Date(bill.dueDate);
      const today = /* @__PURE__ */ new Date();
      if (today > dueDate) {
        await db.update(bills).set({ status: "overdue" }).where(eq20(bills.id, bill.id));
        console.log(`\u26A0\uFE0F  Bill #${bill.id} marked as OVERDUE`);
      }
    }
    console.log("\u2705 Overdue check completed!");
  } catch (error) {
    console.error("\u274C Error updating overdue bills:", error);
  }
}

// server/routes/delivery.routes.ts
init_db();
init_schema();
import { Router as Router15 } from "express";
import { eq as eq21, and as and12 } from "drizzle-orm";
import bcryptjs2 from "bcryptjs";
var router15 = Router15();
router15.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq21(deliveryPartners.username, username)
    });
    if (!partner) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (partner.status === "blocked") {
      return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
    }
    if (!partner.isVerified || partner.status !== "active") {
      return res.status(403).json({ message: "Your account is not yet approved. Please wait for admin verification." });
    }
    if (!partner.passwordHash || !bcryptjs2.compareSync(password, partner.passwordHash)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.deliveryPartnerId = partner.id;
    res.json({
      id: partner.id,
      name: partner.fullName,
      area: partner.zone,
      username: partner.username,
      phone: partner.phone,
      profileCompleted: partner.profileCompleted || false
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});
router15.post("/:partnerId/upload-document", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { docType, fileUrl } = req.body;
    if (!docType || !fileUrl) {
      return res.status(400).json({ message: "Document type and file URL required" });
    }
    const validDocTypes = ["aadhaar_front", "aadhaar_back", "pan", "license", "address_proof", "profile"];
    if (!validDocTypes.includes(docType)) {
      return res.status(400).json({ message: "Invalid document type" });
    }
    const updateData = {};
    if (docType === "profile") updateData.profileImageUrl = fileUrl;
    else if (docType === "aadhaar_front" || docType === "aadhaar_back") updateData.aadhaarImageUrl = fileUrl;
    else if (docType === "pan") updateData.panImageUrl = fileUrl;
    else if (docType === "license") updateData.licenseImageUrl = fileUrl;
    const updated = await db.update(deliveryPartners).set(updateData).where(eq21(deliveryPartners.id, parseInt(partnerId))).returning();
    res.json({
      message: "Document uploaded successfully",
      document: { type: docType, url: fileUrl }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});
router15.post("/assign-orders", async (req, res) => {
  try {
    const { partnerId, orderIds, zoneFilter } = req.body;
    if (!partnerId || !orderIds || orderIds.length === 0) {
      return res.status(400).json({ message: "Partner ID and order IDs required" });
    }
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq21(deliveryPartners.id, parseInt(partnerId))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    if (partner.status === "blocked") {
      return res.status(403).json({ message: "Cannot assign orders to blocked partner" });
    }
    const assignments = await Promise.all(
      orderIds.map(
        (orderId) => db.insert(deliveryAssignments).values({
          orderId,
          partnerId: parseInt(partnerId),
          assignmentDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          status: "assigned"
        }).returning()
      )
    );
    console.log(`[Notification] ${partner.fullName}, you have ${orderIds.length} new deliveries assigned!`);
    res.json({
      message: `Assigned ${orderIds.length} orders to ${partner.fullName}`,
      assignments: assignments.flat()
    });
  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ message: "Assignment failed" });
  }
});
router15.get("/earnings/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { period = "today" } = req.query;
    let dateFilter = null;
    const today = /* @__PURE__ */ new Date();
    if (period === "today") {
      dateFilter = today.toISOString().split("T")[0];
    } else if (period === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1e3);
      dateFilter = { start: weekAgo, end: today };
    } else if (period === "month") {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1e3);
      dateFilter = { start: monthAgo, end: today };
    }
    let completedDeliveries = await db.query.deliveryAssignments.findMany({
      where: and12(
        eq21(deliveryAssignments.partnerId, parseInt(partnerId)),
        eq21(deliveryAssignments.status, "delivered")
      )
    });
    if (period !== "total" && dateFilter && typeof dateFilter === "object" && dateFilter.start) {
      completedDeliveries = completedDeliveries.filter((d) => {
        const assignDate = new Date(d.assignmentDate);
        return assignDate >= dateFilter.start && assignDate <= dateFilter.end;
      });
    } else if (period === "today") {
      completedDeliveries = completedDeliveries.filter((d) => {
        return d.assignmentDate === dateFilter;
      });
    }
    const perDeliveryRate = 50;
    const codCollected = completedDeliveries.reduce(
      (sum, d) => sum + parseFloat(d.collectedCash?.toString() || "0"),
      0
    );
    const deliveryEarnings = completedDeliveries.length * perDeliveryRate;
    const totalEarnings = deliveryEarnings + codCollected;
    res.json({
      period,
      deliveriesCompleted: completedDeliveries.length,
      perDeliveryRate,
      deliveryEarnings,
      codCollected: parseFloat(codCollected.toFixed(2)),
      totalEarnings: parseFloat(totalEarnings.toFixed(2))
    });
  } catch (error) {
    console.error("Earnings error:", error);
    res.status(500).json({ message: "Failed to fetch earnings" });
  }
});
router15.post("/send-credentials/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { username, tempPassword, method = "sms" } = req.body;
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq21(deliveryPartners.id, parseInt(partnerId))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    const smsMessage = `Hello ${partner.fullName}, your Divine Naturals delivery account is ready! \u{1F69A}
Username: ${username}
Temporary Password: ${tempPassword}
Please login and change your password: https://deliverynaturals.app/partner/login
Need help? Call +91-XXXX-XXXX`;
    const emailMessage = `
Dear ${partner.fullName},

Your Divine Naturals Delivery Partner account has been approved! \u{1F389}

\u{1F4F1} Login Credentials:
\u2022 Username: ${username}
\u2022 Temporary Password: ${tempPassword}

\u{1F517} Login Here: https://deliverynaturals.app/partner/login

\u26A0\uFE0F Please change your password on first login for security.

Questions? Contact our support team.

Best regards,
Divine Naturals Team
    `;
    if (method === "sms" && partner.phone) {
      console.log(`[SMS to ${partner.phone}] ${smsMessage}`);
    } else if (method === "email" && partner.email) {
      console.log(`[EMAIL to ${partner.email}] ${emailMessage}`);
    }
    res.json({
      message: "Credentials notification sent",
      sentVia: method,
      contact: method === "sms" ? partner.phone : partner.email
    });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
});
router15.get("/me/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq21(deliveryPartners.id, parseInt(partnerId))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayDeliveries = await db.query.deliveryAssignments.findMany({
      where: and12(
        eq21(deliveryAssignments.partnerId, parseInt(partnerId)),
        eq21(deliveryAssignments.assignmentDate, today)
      )
    });
    res.json({
      ...partner,
      todayDeliveries: todayDeliveries.length,
      todayCompleted: todayDeliveries.filter((d) => d.status === "delivered").length
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});
router15.get("/today/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const assignments = await db.query.deliveryAssignments.findMany({
      where: and12(
        eq21(deliveryAssignments.partnerId, parseInt(partnerId)),
        eq21(deliveryAssignments.assignmentDate, today)
      )
    });
    const deliveries = await Promise.all(
      assignments.map(async (a) => {
        let item = null;
        if (a.orderId) {
          item = await db.query.orders.findFirst({ where: eq21(orders.id, a.orderId) });
        } else if (a.subscriptionId) {
          item = await db.query.milkSubscriptions.findFirst({
            where: eq21(milkSubscriptions.id, a.subscriptionId)
          });
        }
        const customer = item && "userId" in item ? await db.query.users.findFirst({
          where: eq21(users2.id, item.userId)
        }) : null;
        return {
          ...a,
          item,
          customer
        };
      })
    );
    res.json(deliveries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deliveries" });
  }
});
router15.post("/:partnerId/submit-profile", async (req, res) => {
  try {
    const { partnerId } = req.params;
    if (!partnerId || partnerId === "null" || isNaN(parseInt(partnerId))) {
      return res.status(400).json({ message: "Invalid partner ID. Please login again." });
    }
    const {
      dob,
      gender,
      alternatePhone,
      address,
      city,
      state,
      pincode,
      aadhaarNumber,
      panNumber,
      licenseNumber,
      licenseValidity,
      vehicleNumber,
      bankAccount,
      bankIfsc,
      bankName,
      bankHolder
    } = req.body;
    if (!aadhaarNumber || !panNumber || !licenseNumber || !bankAccount) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    if (pincode && isNaN(parseInt(pincode))) {
      return res.status(400).json({ message: "Pincode must be numeric" });
    }
    const updated = await db.update(deliveryPartners).set({
      dob: dob ? new Date(dob) : void 0,
      gender: gender || void 0,
      aadhaarNumber,
      panNumber,
      licenseNumber,
      vehicleType: vehicleNumber || void 0,
      address: address ? `${address}, ${city}, ${state} - ${pincode}` : void 0,
      zone: city || void 0,
      bankAccountNumber: bankAccount,
      bankIfscCode: bankIfsc || void 0,
      bankName: bankName || void 0,
      bankHolderName: bankHolder || void 0,
      profileCompleted: true,
      status: "pending_verification",
      documentsSubmittedDate: /* @__PURE__ */ new Date()
    }).where(eq21(deliveryPartners.id, parseInt(partnerId))).returning();
    if (updated.length === 0) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json({
      message: "Profile submitted successfully! Your documents are being verified.",
      partner: updated[0]
    });
  } catch (error) {
    console.error("Profile submission error:", error);
    res.status(500).json({ message: "Failed to submit profile: " + (error.message || "Unknown error") });
  }
});
router15.patch("/start/:assignmentId", async (req, res) => {
  try {
    await db.update(deliveryAssignments).set({ status: "picked_up", timeStarted: /* @__PURE__ */ new Date() }).where(eq21(deliveryAssignments.id, parseInt(req.params.assignmentId)));
    res.json({ message: "Delivery started" });
  } catch (error) {
    res.status(500).json({ message: "Failed to start delivery" });
  }
});
router15.patch("/complete/:assignmentId", async (req, res) => {
  try {
    const { proofPhoto } = req.body;
    await db.update(deliveryAssignments).set({ status: "delivered", timeDelivered: /* @__PURE__ */ new Date(), failedPhoto: proofPhoto }).where(eq21(deliveryAssignments.id, parseInt(req.params.assignmentId)));
    res.json({ message: "Delivery completed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete delivery" });
  }
});
router15.patch("/failed/:assignmentId", async (req, res) => {
  try {
    const { reason, photo } = req.body;
    await db.update(deliveryAssignments).set({ status: "failed", failedReason: reason, failedPhoto: photo }).where(eq21(deliveryAssignments.id, parseInt(req.params.assignmentId)));
    res.json({ message: "Delivery marked as failed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark delivery as failed" });
  }
});
router15.patch("/collect-cash/:assignmentId", async (req, res) => {
  try {
    const { amount } = req.body;
    await db.update(deliveryAssignments).set({ collectionStatus: "received", collectedCash: amount }).where(eq21(deliveryAssignments.id, parseInt(req.params.assignmentId)));
    res.json({ message: "Cash collected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to collect cash" });
  }
});
var delivery_routes_default = router15;

// server/routes/admin-delivery.routes.ts
init_db();
init_schema();
import { Router as Router16 } from "express";
import { eq as eq22, and as and13 } from "drizzle-orm";
import bcrypt2 from "bcryptjs";
var router16 = Router16();
router16.get("/", async (req, res) => {
  try {
    const { zone, status: statusFilter, verified } = req.query;
    const conditions = [];
    if (zone) conditions.push(eq22(deliveryPartners.zone, zone));
    if (statusFilter) conditions.push(eq22(deliveryPartners.status, statusFilter));
    if (verified === "true") conditions.push(eq22(deliveryPartners.isVerified, true));
    if (verified === "false") conditions.push(eq22(deliveryPartners.isVerified, false));
    let allPartners = [];
    if (conditions.length > 0) {
      allPartners = await db.query.deliveryPartners.findMany({
        where: and13(...conditions)
      });
    } else {
      allPartners = await db.query.deliveryPartners.findMany();
    }
    res.json(allPartners);
  } catch (error) {
    console.error("Error fetching delivery partners:", error?.message || error);
    res.status(500).json({ message: "Failed to fetch delivery partners" });
  }
});
router16.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq22(deliveryPartners.id, parseInt(id))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json(partner);
  } catch (error) {
    console.error("Error fetching partner:", error?.message || error);
    res.status(500).json({ message: "Failed to fetch partner" });
  }
});
router16.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { zone } = req.body;
    if (!zone) {
      return res.status(400).json({ message: "Zone is required" });
    }
    const updatedPartner = await db.update(deliveryPartners).set({ zone }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
    if (updatedPartner.length === 0) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res.json({ ...updatedPartner[0], message: "Partner updated successfully" });
  } catch (error) {
    console.error("Error updating partner:", error?.message || error);
    res.status(500).json({ message: "Failed to update partner" });
  }
});
router16.post("/:id/generate-password", async (req, res) => {
  try {
    const { id } = req.params;
    const { tempPassword } = req.body;
    if (!tempPassword) {
      return res.status(400).json({ message: "Password required" });
    }
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq22(deliveryPartners.id, parseInt(id))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    const hashedPassword = await bcrypt2.hash(tempPassword, 10);
    const username = partner.username || `driver_${partner.phone.replace(/\D/g, "").slice(-6)}`;
    const updatedPartner = await db.update(deliveryPartners).set({
      passwordHash: hashedPassword,
      username,
      status: "active",
      // Auto-activate after password is set
      isVerified: true
    }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
    res.json({
      ...updatedPartner[0],
      message: "Password saved successfully",
      tempPassword
      // Return for display, won't be stored again
    });
  } catch (error) {
    console.error("Error generating password:", error?.message || error);
    res.status(500).json({ message: "Failed to generate password" });
  }
});
router16.post("/", async (req, res) => {
  try {
    const { fullName, email, phone, address, zone, vehicleType, licenseNumber, password } = req.body;
    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: "Full name, phone, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    const username = `driver_${phone.replace(/\D/g, "").slice(-6)}`;
    const hashedPassword = await bcrypt2.hash(password, 10);
    const newPartner = await db.insert(deliveryPartners).values({
      fullName,
      email,
      phone,
      address,
      zone,
      vehicleType,
      licenseNumber,
      username,
      passwordHash: hashedPassword,
      initialPassword: password,
      // Store plain password for admin display
      status: "active",
      isVerified: true,
      isAvailable: true
    }).returning();
    res.status(201).json(newPartner[0]);
  } catch (error) {
    console.error("Error creating partner:", error?.message || error);
    res.status(500).json({ message: "Failed to create partner" });
  }
});
router16.patch("/:id/verify", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, username, tempPassword } = req.body;
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq22(deliveryPartners.id, parseInt(id))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    if (action === "approve") {
      if (!tempPassword) {
        return res.status(400).json({ message: "Temporary password required" });
      }
      const hashedPassword = await bcrypt2.hash(tempPassword, 10);
      const finalUsername = username || `driver_${partner.phone.replace(/\D/g, "").slice(-6)}`;
      const updatedPartner = await db.update(deliveryPartners).set({
        status: "active",
        isVerified: true,
        username: finalUsername,
        passwordHash: hashedPassword
      }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
      console.log(`[Credentials sent to ${partner.fullName}]`);
      console.log(`Username: ${finalUsername}`);
      console.log(`Temp Password: ${tempPassword}`);
      res.json({ ...updatedPartner[0], message: "Partner approved and credentials sent" });
    } else {
      const updatedPartner = await db.update(deliveryPartners).set({ status: "rejected", isVerified: false }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
      res.json({ ...updatedPartner[0], message: "Partner rejected" });
    }
  } catch (error) {
    console.error("Error verifying partner:", error?.message || error);
    res.status(500).json({ message: "Failed to verify partner" });
  }
});
router16.patch("/:id/block", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;
    if (!action || !["block", "unblock"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq22(deliveryPartners.id, parseInt(id))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    const newStatus = action === "block" ? "blocked" : "active";
    const updatedPartner = await db.update(deliveryPartners).set({ status: newStatus }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
    res.json({ ...updatedPartner[0], message: `Partner ${action}ed successfully` });
  } catch (error) {
    console.error("Error blocking partner:", error?.message || error);
    res.status(500).json({ message: "Failed to block/unblock partner" });
  }
});
router16.patch("/:id/approve-documents", async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq22(deliveryPartners.id, parseInt(id))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    const updated = await db.update(deliveryPartners).set({
      isVerified: true,
      status: "active"
    }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
    res.json({
      message: "Partner documents approved successfully",
      partner: updated[0]
    });
  } catch (error) {
    console.error("Error approving documents:", error?.message || error);
    res.status(500).json({ message: "Failed to approve documents" });
  }
});
router16.patch("/:id/reject-documents", async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;
    if (!remarks) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }
    const partner = await db.query.deliveryPartners.findFirst({
      where: eq22(deliveryPartners.id, parseInt(id))
    });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    const updated = await db.update(deliveryPartners).set({
      isVerified: false,
      status: "pending_verification"
    }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
    res.json({
      message: "Partner documents rejected. They need to resubmit.",
      partner: updated[0]
    });
  } catch (error) {
    console.error("Error rejecting documents:", error?.message || error);
    res.status(500).json({ message: "Failed to reject documents" });
  }
});
router16.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await db.update(deliveryPartners).set({ status: "rejected" }).where(eq22(deliveryPartners.id, parseInt(id))).returning();
    res.json({ message: "Partner deleted", partner: deleted[0] });
  } catch (error) {
    console.error("Error deleting partner:", error?.message || error);
    res.status(500).json({ message: "Failed to delete partner" });
  }
});
var admin_delivery_routes_default = router16;

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: false, limit: "50mb" }));
app.use(fileUpload());
app.use("/banners", express2.static(path4.join(process.cwd(), "public", "banners")));
app.use("/products", express2.static(path4.join(process.cwd(), "public", "products")));
app.use("/icons", express2.static(path4.join(process.cwd(), "public", "icons")));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await seedDatabase();
  } catch (error) {
    log("Error seeding database, continuing anyway...");
  }
  const server = await registerRoutes(app);
  app.use("/api/delivery", delivery_routes_default);
  app.use("/api/admin/delivery-partners", admin_delivery_routes_default);
  cron.schedule("0 0 1 * *", async () => {
    log("\u{1F550} Cron job triggered: Generating monthly bills...");
    await generateMonthlyBills();
  });
  cron.schedule("0 6 * * *", async () => {
    log("\u{1F550} Cron job triggered: Checking for overdue bills...");
    await updateOverdueBills();
  });
  log("\u2705 Cron jobs scheduled: Monthly bills (1st of month) & Overdue check (daily 6 AM)");
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
