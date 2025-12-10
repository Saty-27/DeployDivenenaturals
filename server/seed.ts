import { db } from "./db";
import { users, vendors, deliveryPartners, products, milkSubscriptions, aboutUsSettings, contactSettings, termsOfServiceSettings, privacyPolicySettings } from "@shared/schema";
import { eq } from "drizzle-orm";
import * as bcryptjs from "bcryptjs";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with mock data...");

    // Hash password for admin users
    const salt = await bcryptjs.genSalt(10);
    const adminPasswordHash = await bcryptjs.hash("admin123", salt);
    const customerPasswordHash = await bcryptjs.hash("customer123", salt);

    // Create mock users for each role (2 per role = 8 total)
    const mockUsers = [
      // Customers
      { id: "user-customer-1", email: "customer1@divine.com", firstName: "Priya", lastName: "Patel", role: "customer", phone: "+91-9876543210", walletBalance: "500.00", passwordHash: customerPasswordHash },
      { id: "user-customer-2", email: "customer2@divine.com", firstName: "Rahul", lastName: "Mehta", role: "customer", phone: "+91-9876543211", walletBalance: "300.00", passwordHash: customerPasswordHash },
      
      // Vendors
      { id: "user-vendor-1", email: "vendor1@divine.com", firstName: "Rajesh", lastName: "Kumar", role: "vendor", phone: "+91-9876543212", walletBalance: "0", passwordHash: customerPasswordHash },
      { id: "user-vendor-2", email: "vendor2@divine.com", firstName: "Amit", lastName: "Shah", role: "vendor", phone: "+91-9876543213", walletBalance: "0", passwordHash: customerPasswordHash },
      
      // Delivery Partners
      { id: "user-delivery-1", email: "delivery1@divine.com", firstName: "Suresh", lastName: "Singh", role: "delivery", phone: "+91-9876543214", walletBalance: "0", passwordHash: customerPasswordHash },
      { id: "user-delivery-2", email: "delivery2@divine.com", firstName: "Vijay", lastName: "Sharma", role: "delivery", phone: "+91-9876543215", walletBalance: "0", passwordHash: customerPasswordHash },
      
      // Admins - WITH PASSWORDS
      { id: "user-admin-1", email: "admin1@divine.com", firstName: "Admin", lastName: "Super", role: "admin", phone: "+91-9876543216", walletBalance: "0", passwordHash: adminPasswordHash },
      { id: "user-admin-2", email: "admin2@divine.com", firstName: "Admin", lastName: "Manager", role: "admin", phone: "+91-9876543217", walletBalance: "0", passwordHash: adminPasswordHash }
    ];

    // Insert users
    for (const user of mockUsers) {
      await db.insert(users).values(user);
    }
    console.log("✓ Created 8 mock users (2 per role)");

    // Create vendor profiles for vendor users
    await db.insert(vendors).values([
      {
        userId: "user-vendor-1",
        businessName: "Fresh Dairy Co.",
        licenseNumber: "DL-2018-MH-001",
        locationName: "Andheri West",
        vendorType: "VENDOR",
        dailyCapacity: 2000,
        requirementToday: 500,
        circulatedLiters: 425,
        revenueToday: "21250.00",
        weeklyEarnings: "148750.00",
        isVerified: true
      },
      {
        userId: "user-vendor-2",
        businessName: "Divine Naturals Farm",
        licenseNumber: "DL-2019-MH-002",
        locationName: "Santa Cruz",
        vendorType: "VENDOR",
        dailyCapacity: 1500,
        requirementToday: 400,
        circulatedLiters: 380,
        revenueToday: "19000.00",
        weeklyEarnings: "133000.00",
        isVerified: false
      }
    ]);
    console.log("✓ Created 2 vendor profiles");

    // Create delivery partner profiles
    await db.insert(deliveryPartners).values([
      {
        userId: "user-delivery-1",
        fullName: "Suresh Singh",
        phone: "+91-9876543214",
        vehicleType: "Electric Scooter",
        licenseNumber: "DL-123456",
        zone: "Andheri-Santacruz",
        isAvailable: true,
        status: "active"
      },
      {
        userId: "user-delivery-2",
        fullName: "Vijay Sharma",
        phone: "+91-9876543215",
        vehicleType: "Bike",
        licenseNumber: "DL-789012",
        zone: "Borivali-Malad",
        isAvailable: true,
        status: "active"
      }
    ]);
    console.log("✓ Created 2 delivery partner profiles");

    // Get the vendor IDs for products
    const vendorList = await db.select().from(vendors);

    // Create mock products (at least 5)
    const mockProducts = [
      {
        name: "Full Cream Milk",
        sku: "MILK-FC-001",
        description: "Rich and creamy full cream milk",
        category: "MILK",
        type: "MILK",
        price: "60.00",
        unit: "L",
        stock: 100,
        imageUrl: "/images/full_cream_milk_in_bottle.png",
        isActive: true
      },
      {
        name: "Toned Milk",
        sku: "MILK-TN-002",
        description: "Healthy toned milk with reduced fat",
        category: "MILK",
        type: "MILK",
        price: "50.00",
        unit: "L",
        stock: 150,
        imageUrl: "/images/toned_milk_in_glass.png",
        isActive: true
      },
      {
        name: "Fresh Curd",
        sku: "DAIRY-CURD-001",
        description: "Thick and creamy fresh curd",
        category: "DAIRY",
        type: "DAIRY",
        price: "40.00",
        unit: "500g",
        stock: 80,
        imageUrl: "/images/fresh_curd_in_ceramic_bowl.png",
        isActive: true
      },
      {
        name: "Paneer",
        sku: "DAIRY-PANEER-001",
        description: "Fresh cottage cheese",
        category: "DAIRY",
        type: "DAIRY",
        price: "120.00",
        unit: "250g",
        stock: 50,
        imageUrl: "/images/fresh_paneer_cheese_cubes.png",
        isActive: true
      },
      {
        name: "Buttermilk",
        sku: "DAIRY-BM-001",
        description: "Refreshing traditional buttermilk",
        category: "DAIRY",
        type: "DAIRY",
        price: "25.00",
        unit: "500ml",
        stock: 120,
        imageUrl: "/images/traditional_buttermilk_drink.png",
        isActive: true
      }
    ];

    for (const product of mockProducts) {
      await db.insert(products).values(product);
    }
    console.log("✓ Created 5 products");

    // Create mock subscriptions (3-5 active subscriptions)
    await db.insert(milkSubscriptions).values([
      {
        userId: "user-customer-1",
        quantity: 2,
        frequency: "daily",
        deliveryTime: "6:00 AM",
        startDate: "2025-01-01",
        isActive: true,
        pricePerL: "60.00",
        status: "ACTIVE"
      },
      {
        userId: "user-customer-1",
        quantity: 1,
        frequency: "daily",
        deliveryTime: "6:30 AM",
        startDate: "2025-01-01",
        isActive: true,
        pricePerL: "50.00",
        status: "ACTIVE"
      },
      {
        userId: "user-customer-2",
        quantity: 1,
        frequency: "daily",
        deliveryTime: "7:00 AM",
        startDate: "2025-01-05",
        isActive: true,
        pricePerL: "60.00",
        status: "ACTIVE"
      }
    ]);
    console.log("✓ Created 3 active subscriptions");

    // Seed CMS content
    await db.insert(aboutUsSettings).values({
      title: "About Divine Naturals",
      subtitle: "Pure. Fresh. Daily.",
      content: "Divine Naturals is a minimalist, eco-friendly dairy delivery platform dedicated to bringing fresh, pure dairy products directly to your doorstep. We believe in supporting local farmers and delivering only the highest quality dairy products.",
      imageUrl: "/images/full_cream_milk_in_bottle.png",
      mission: "To provide eco-friendly, fresh dairy products while supporting local farmers and promoting sustainable practices.",
      vision: "To become the leading dairy delivery platform known for quality, reliability, and environmental consciousness.",
      values: JSON.stringify([
        { title: "Farm Fresh", description: "We source directly from trusted local farms" },
        { title: "Pure & Natural", description: "No additives, preservatives, or artificial ingredients" },
        { title: "Supporting Farmers", description: "Fair pricing that benefits our farming partners" },
        { title: "Quality Assured", description: "Every product meets our strict quality standards" }
      ]),
      isActive: true
    }).onConflictDoNothing();

    await db.insert(contactSettings).values({
      title: "Contact Us",
      subtitle: "We'd love to hear from you. Get in touch with us today!",
      phone: "+91-9876543210",
      email: "support@divinenaturals.com",
      address: "123 Dairy Lane, Mumbai, Maharashtra 400001, India",
      businessHours: "Mon-Sat: 6:00 AM - 10:00 PM, Sun: 7:00 AM - 8:00 PM",
      socialLinks: JSON.stringify({
        facebook: "https://facebook.com/divinenaturals",
        instagram: "https://instagram.com/divinenaturals",
        twitter: "https://twitter.com/divinenaturals"
      }),
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.823529!2d72.82!3d19.09!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c5c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890",
      isActive: true
    }).onConflictDoNothing();

    await db.insert(termsOfServiceSettings).values({
      title: "Terms of Service",
      content: "Please read these terms carefully. By using Divine Naturals, you agree to all terms and conditions listed below.",
      sections: JSON.stringify([
        { title: "Service Description", content: "Divine Naturals provides dairy product delivery services to customers in selected areas." },
        { title: "User Responsibilities", content: "Users must provide accurate information and maintain account security." },
        { title: "Delivery Terms", content: "Deliveries are made during specified time slots. Delays may occur due to unforeseen circumstances." },
        { title: "Payment", content: "Payment is due upon delivery unless otherwise agreed. We accept cash, UPI, card, and net banking." },
        { title: "Returns & Refunds", content: "Defective products may be returned within 24 hours of delivery for replacement or refund." },
        { title: "Liability", content: "Divine Naturals is not liable for damages during delivery or mishandling by customers." }
      ]),
      isActive: true
    }).onConflictDoNothing();

    await db.insert(privacyPolicySettings).values({
      title: "Privacy Policy",
      content: "Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.",
      sections: JSON.stringify([
        { title: "Data Collection", content: "We collect name, phone, email, and address information to provide delivery services." },
        { title: "Data Usage", content: "Your data is used only for order processing, delivery, and customer support." },
        { title: "Data Security", content: "We use industry-standard security measures to protect your personal information." },
        { title: "Third-Party Sharing", content: "We do not share your data with third parties without your consent." },
        { title: "Cookies", content: "We use cookies to improve your browsing experience and remember your preferences." },
        { title: "Data Retention", content: "We retain your data for as long as necessary to provide services and comply with law." }
      ]),
      isActive: true
    }).onConflictDoNothing();

    console.log("✓ Created CMS content for About Us, Contact, Terms of Service, and Privacy Policy");
    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
