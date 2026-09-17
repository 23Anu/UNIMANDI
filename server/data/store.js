import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "campus_db.json");

// Default initial seed data
const DEFAULT_USERS = [
  {
    id: "user_1",
    name: "Aarav Sharma",
    email: "aarav.s@campus.edu",
    phone: "+91 9876543210",
    college: "National Institute of Technology",
    branch: "Computer Engineering",
    year: "4th Year",
    semester: "7th Semester",
    rollNo: "2021CS042",
    addressType: "Campus Hostel / Dorm",
    roomNo: "Room 412, 4th Floor",
    buildingName: "Hostel Block 4 (Senior Boys)",
    streetArea: "South Campus Lane, Near Central Mess",
    landmark: "Opposite Volleyball Court",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    pickupLocation: "Hostel Block 4 / Library",
    fullAddress: "Room 412, Hostel Block 4, South Campus Lane, Pune, Maharashtra - 411038",
    hostel: "Hostel Block 4 (Senior Boys)",
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isAddressVerified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    trustScore: 4.9,
    dealsCount: 18,
    isProfileComplete: true,
    createdAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "user_2",
    name: "Priya Patel",
    email: "priya.p@campus.edu",
    phone: "+91 9811223344",
    college: "National Institute of Technology",
    branch: "Electronics & Communication",
    year: "3rd Year",
    semester: "5th Semester",
    rollNo: "2022EC108",
    addressType: "Off-Campus PG / Shared Room",
    roomNo: "Flat 203, 2nd Floor",
    buildingName: "Sai Blossom Girls PG",
    streetArea: "Green Park Society, Gate 2 Road",
    landmark: "Behind Reliance Fresh",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    pickupLocation: "Girls Hostel B / Canteen",
    fullAddress: "Flat 203, Sai Blossom Girls PG, Green Park Society, Gate 2 Road, Pune, Maharashtra - 411038",
    hostel: "Off-Campus PG / Day Scholar",
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isAddressVerified: true,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    trustScore: 4.8,
    dealsCount: 12,
    isProfileComplete: true,
    createdAt: "2026-02-10T12:00:00Z"
  },
  {
    id: "user_3",
    name: "Rohan Verma",
    email: "rohan.v@campus.edu",
    phone: "+91 9988776655",
    college: "National Institute of Technology",
    branch: "Mechanical Engineering",
    year: "2nd Year",
    semester: "3rd Semester",
    rollNo: "2023ME077",
    addressType: "Campus Hostel / Dorm",
    roomNo: "Room 108, 1st Floor",
    buildingName: "Hostel Block 1 (Junior Boys)",
    streetArea: "North Campus Quad",
    landmark: "Near North Canteen",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    pickupLocation: "Hostel Block 1 / Main Gate",
    fullAddress: "Room 108, Hostel Block 1, North Campus Quad, Pune, Maharashtra - 411038",
    hostel: "Hostel Block 1 (Junior Boys)",
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isAddressVerified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    trustScore: 4.5,
    dealsCount: 4,
    isProfileComplete: true,
    createdAt: "2026-05-01T08:30:00Z"
  },
  {
    id: "user_kampus_store",
    name: "UniMandi Official SAC Store & Print Hub",
    email: "store.sac@campus.edu",
    phone: "+91 9822334455",
    college: "National Institute of Technology",
    branch: "SAC Commercial Store",
    year: "Staff / Vendor",
    semester: "Official Vendor",
    rollNo: "VENDOR-SAC-01",
    role: "merchant",
    addressType: "Campus Shop",
    roomNo: "Shop No. 2, Ground Floor",
    buildingName: "Student Activity Center (SAC)",
    streetArea: "Central Campus Plaza",
    landmark: "Opposite Admin Building",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    pickupLocation: "SAC Counter 2",
    fullAddress: "Shop 2, SAC Building, Central Campus Plaza, NIT Pune - 411038",
    hostel: "Campus Commercial Hub",
    isVerified: true,
    isEmailVerified: true,
    isPhoneVerified: true,
    isAddressVerified: true,
    avatar: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=150&auto=format&fit=crop&q=80",
    trustScore: 5.0,
    dealsCount: 1420,
    isProfileComplete: true,
    createdAt: "2025-08-01T00:00:00Z"
  }
];

const DEFAULT_LISTINGS = [
  {
    id: "item_101",
    userId: "user_1",
    type: "Rent",
    category: "Books & Notes",
    subcategory: "Textbooks",
    title: "Operating Systems Principles (Silberschatz 10th Ed) + Hand-written Class Notes",
    description: "Mint condition textbook used for CS301. Includes handwritten notes with solved previous 5-year exam papers. Zero markings inside.",
    condition: "Good",
    price: 60,
    rentDuration: "per week",
    location: "Hostel Block 4, Room 212 / CS Dept",
    status: "Available",
    genderTarget: "Any",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80"
    ],
    targetBranch: "Computer Engineering",
    targetYear: "3rd Year",
    views: 89,
    createdAt: "2026-09-02T14:20:00Z"
  },
  {
    id: "item_102",
    userId: "user_2",
    type: "Sell",
    category: "Electronics",
    subcategory: "Calculators",
    title: "Texas Instruments TI-84 Plus Graphic Calculator",
    description: "Essential for advanced engineering math and calculus. Fresh batteries included, LCD screen is crystal clear, minor wear on cover.",
    condition: "Good",
    price: 1800,
    rentDuration: null,
    location: "Girls Hostel B, Near Main Canteen",
    status: "Available",
    genderTarget: "Any",
    images: [
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80"
    ],
    targetBranch: "Electronics & Communication",
    targetYear: "2nd Year",
    views: 142,
    createdAt: "2026-09-04T09:15:00Z"
  },
  {
    id: "item_103",
    userId: "user_2",
    type: "Rent",
    category: "Lab & Project Kits",
    subcategory: "Electronics Kits",
    title: "Complete Arduino Starter Kit + 25 Sensor Modules + Jumper Wires",
    description: "Used for IoT microcontrollers lab. Includes UNO R3, breadboards, ultrasonic, DHT11, servo motors, and display modules.",
    condition: "New",
    price: 150,
    rentDuration: "per semester",
    location: "ECE Dept Lab 3 / Student Center",
    status: "Available",
    genderTarget: "Any",
    images: [
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&auto=format&fit=crop&q=80"
    ],
    targetBranch: "Electronics & Communication",
    targetYear: "2nd Year",
    views: 210,
    createdAt: "2026-09-05T11:40:00Z"
  },
  {
    id: "item_104",
    userId: "user_3",
    type: "Sell",
    category: "Hostel & PG Living",
    subcategory: "Girls Hostels",
    title: "Spacious AC Single Room in Verified Girls PG (Near Gate 2)",
    description: "Fully furnished with Wi-Fi, 3 times hygienic food, power backup, study table and washing machine. Female students only.",
    condition: "New",
    price: 6500,
    rentDuration: "per month",
    location: "Off-Campus PGs (Gate 1 & 2)",
    status: "Available",
    genderTarget: "Girls Only",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&auto=format&fit=crop&q=80"
    ],
    targetBranch: "All Branches",
    targetYear: "All Years",
    views: 340,
    createdAt: "2026-09-06T12:00:00Z"
  },
  {
    id: "item_105",
    userId: "user_1",
    type: "Sell",
    category: "Vehicles & Cycles",
    subcategory: "Geared Cycles",
    title: "Hero Sprint Pro 21-Speed Gear Bicycle + Anti-theft Cable Lock",
    description: "Smooth disc brakes, 27.5-inch wheels, front suspension. Serviced last month at Campus Cycle Hub.",
    condition: "Good",
    price: 3200,
    rentDuration: null,
    location: "Boys Hostels (Blocks 1-4)",
    status: "Available",
    genderTarget: "Any",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80"
    ],
    targetBranch: "All Branches",
    targetYear: "All Years",
    views: 195,
    createdAt: "2026-09-07T15:30:00Z"
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: "tn_prod_1",
    name: "Complete Engineering Drawing Kit (Mini Drafter + Compass + Clips + Sheet Holder)",
    category: "Drawing & Drafting",
    price: 650,
    originalPrice: 850,
    inStock: true,
    stockCount: 45,
    unit: "kit",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
    description: "Official NIT approved mini drafter with steel rod, clamp, drafting scales, protractor, and water-resistant storage bag.",
    isBestseller: true,
  },
  {
    id: "tn_prod_2",
    name: "Engineering Physics & Chemistry Official Lab Manuals + Hardcover Record (Set of 2)",
    category: "Lab Records & Manuals",
    price: 180,
    originalPrice: 240,
    inStock: true,
    stockCount: 120,
    unit: "set",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    description: "Official college syllabus verified experiments manual with graph sheets and certified pre-printed index format.",
    isBestseller: true,
  },
  {
    id: "tn_prod_3",
    name: "Casio FX-991EX Classwiz Scientific Calculator (Non-Programmable)",
    category: "Electronics & Tech",
    price: 1390,
    originalPrice: 1595,
    inStock: true,
    stockCount: 22,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=600&auto=format&fit=crop&q=80",
    description: "552 functions, high-resolution LCD screen, permitted in all university mid-term and semester examinations.",
    isBestseller: false,
  },
  {
    id: "tn_prod_4",
    name: "A2 Engineering Drawing Sheets Pack (20 Sheets, 180 GSM Ivory Paper)",
    category: "Drawing & Drafting",
    price: 120,
    originalPrice: 160,
    inStock: true,
    stockCount: 85,
    unit: "pack",
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
    description: "Smooth finish heavy cartridge sheets, pre-bordered with college title block format.",
    isBestseller: false,
  }
];

const DEFAULT_ORDERS = [
  {
    id: "ord_101",
    pickupCode: "TN-849201",
    studentId: "user_3",
    studentName: "Rohan Verma",
    studentRoll: "2023ME077",
    studentBranch: "Mechanical Engineering",
    items: [
      {
        productId: "tn_prod_2",
        name: "Engineering Physics & Chemistry Official Lab Manuals",
        quantity: 1,
        price: 180,
      }
    ],
    totalAmount: 180,
    status: "Ready for Pickup",
    placedAt: "2026-09-08T09:30:00Z",
    pickupSlot: "Today, 4:00 PM - 6:00 PM",
    pickupLocation: "SAC Ground Floor Counter #2",
    qrDataPayload: "RENTIFY-TN-ORD101-USER3-VERIFIED-2026",
    paymentMethod: "UPI Instant Token",
    paymentStatus: "Completed"
  }
];

const DEFAULT_CHATS = [
  {
    id: "chat_201",
    listingId: "item_101",
    buyerId: "user_3",
    sellerId: "user_1",
    activeOffer: {
      amount: 50,
      offeredBy: "user_3",
      status: "accepted",
      counterAmount: null,
    },
    dealConfirmation: {
      buyerConfirmed: true,
      sellerConfirmed: false,
      completedAt: null,
    },
    messages: [
      {
        id: "msg_1",
        senderId: "user_3",
        text: "Hi Aarav, is the OS book with notes still available?",
        timestamp: "2026-09-08T10:10:00Z",
      },
      {
        id: "msg_offer_1",
        senderId: "user_3",
        type: "offer",
        offerAmount: 50,
        text: "🤝 Proposing an offer of ₹50/week (Listed: ₹60)",
        timestamp: "2026-09-08T10:12:00Z",
      },
      {
        id: "msg_2",
        senderId: "user_1",
        text: "Yes Rohan, offer accepted! You can pick it up from Hostel 4 tonight.",
        timestamp: "2026-09-08T10:15:00Z",
      }
    ],
    updatedAt: "2026-09-08T10:15:00Z",
  }
];

const DEFAULT_RATINGS = [
  {
    id: "rat_1",
    dealListingId: "item_99",
    fromUserId: "user_3",
    toUserId: "user_1",
    rating: 5,
    tags: ["On time", "Item as described", "Good communication"],
    comment: "Aarav handed over the notes right at the promised time. Extremely helpful senior!",
    createdAt: "2026-08-28T18:00:00Z"
  }
];

// Initialize database from file or fallback to defaults
let dbState = {
  users: DEFAULT_USERS,
  listings: DEFAULT_LISTINGS,
  products: DEFAULT_PRODUCTS,
  orders: DEFAULT_ORDERS,
  chats: DEFAULT_CHATS,
  ratings: DEFAULT_RATINGS,
  reports: [],
  blockedUsers: []
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      dbState = {
        users: parsed.users || DEFAULT_USERS,
        listings: parsed.listings || DEFAULT_LISTINGS,
        products: parsed.products || DEFAULT_PRODUCTS,
        orders: parsed.orders || DEFAULT_ORDERS,
        chats: parsed.chats || DEFAULT_CHATS,
        ratings: parsed.ratings || DEFAULT_RATINGS,
        reports: parsed.reports || [],
        blockedUsers: parsed.blockedUsers || []
      };
      console.log("💾 Loaded Persistent Campus Database from disk:", DB_FILE);
    } else {
      saveDatabase();
      console.log("💾 Created new Persistent Campus Database file at:", DB_FILE);
    }
  } catch (err) {
    console.error("⚠️ Error reading DB file, using in-memory state:", err.message);
  }
}

export function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbState, null, 2), "utf-8");
  } catch (err) {
    console.error("⚠️ Error saving database to disk:", err.message);
  }
}

// Initial load
loadDatabase();

export const users = dbState.users;
export const listings = dbState.listings;
export const products = dbState.products;
export const orders = dbState.orders;
export const chats = dbState.chats;
export const ratings = dbState.ratings;
export const reports = dbState.reports;
export const blockedUsers = dbState.blockedUsers;
export const db = dbState;
export const saveDB = saveDatabase;
