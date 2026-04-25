import { db } from "./db";
import { 
  users, 
  products, 
  deliveryPartners,
  banners, 
  ethosCards, 
  statsCounters, 
  faqs, 
  newsletterSettings, 
  footerSettings,
  aboutUsSettings,
  contactSettings
} from "../shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // 1. Create Admin User
    const adminEmail = "md@divinenaturals.in";
    const existingUsers = await db.select().from(users).where(eq(users.email, adminEmail));
    
    if (existingUsers.length > 0) {
      console.log("Database already seeded. Updating CMS content only...");
    } else {
      const hashedPassword = await bcrypt.hash("DivineNaturals@2025", 10);
      
      // Admin
      const [adminUser] = await db.insert(users).values({
        id: nanoid(),
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "admin",
        firstName: "Kauldeep",
        lastName: "Rao",
        phone: "1800-DIVINE"
      }).returning();

      // Customer
      const [customerUser] = await db.insert(users).values({
        id: nanoid(),
        email: "customer@example.com",
        passwordHash: hashedPassword,
        role: "customer",
        firstName: "Test",
        lastName: "Customer",
        phone: "9876543210",
        address: "123 Green Lane, Mumbai"
      }).returning();

      // Delivery Partner
      const [partnerUser] = await db.insert(users).values({
        id: nanoid(),
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

      console.log("✓ Inserted/Updated Base Data (Users)");
    }

    // ALWAYS update products to sync with latest seed data
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
      const [existing] = await db.select().from(products).where(eq(products.sku, p.sku));
      if (existing) {
        await db.update(products).set(p).where(eq(products.sku, p.sku));
      } else {
        await db.insert(products).values(p);
      }
    }
    console.log("✓ Updated Products from seed data");

    // =========================================================================
    // REFRESH CMS CONTENT
    // =========================================================================
    console.log("Refreshing CMS content with premium assets...");

    // 1. Hero Banners
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
    console.log("✓ Updated 3 Hero Banners");

    // 2. Ethos Cards
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
    console.log("✓ Updated 4 Ethos Cards");

    // 3. Stats Counters
    await db.delete(statsCounters);
    await db.insert(statsCounters).values([
      { label: "Happy Households", value: 12000, suffix: "+", icon: "Users", displayOrder: 1 },
      { label: "Liters of Milk Daily", value: 5500, suffix: "L", icon: "Milk", displayOrder: 2 },
      { label: "Partner Farms", value: 45, suffix: "", icon: "Home", displayOrder: 3 },
      { label: "On-Time Deliveries", value: 99, suffix: ".8%", icon: "Clock", displayOrder: 4 }
    ]);
    console.log("✓ Updated 4 Stats Counters");

    // 4. FAQs
    await db.delete(faqs);
    await db.insert(faqs).values([
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
    console.log("✓ Updated 3 FAQs");

    // 5. Singletons
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
      await db.update(aboutUsSettings).set(aboutData).where(eq(aboutUsSettings.id, existingAbout.id));
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
      await db.update(contactSettings).set(contactData).where(eq(contactSettings.id, existingContact.id));
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
      await db.update(newsletterSettings).set(newsletterData).where(eq(newsletterSettings.id, existingNewsletter.id));
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
      copyrightText: "© 2025 Divine Naturals. All rights reserved.",
      isActive: true
    };
    if (existingFooter) {
      await db.update(footerSettings).set(footerData).where(eq(footerSettings.id, existingFooter.id));
    } else {
      await db.insert(footerSettings).values(footerData);
    }

    console.log("✓ Enriched CMS content");
    console.log("✅ Database seeding/update completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
