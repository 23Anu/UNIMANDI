export const RESIDENCE_TYPES = [
  "Campus Hostel / Dorm",
  "Off-Campus PG / Shared Room",
  "Day Scholar / Home Residence",
  "Private Apartment / Flat"
];

export const INDIAN_STATES = [
  "Maharashtra",
  "Delhi NCR",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Telangana",
  "Gujarat",
  "West Bengal",
  "Rajasthan",
  "Madhya Pradesh",
  "Punjab",
  "Haryana",
  "Kerala",
  "Bihar",
  "Odisha",
  "Andhra Pradesh",
  "Uttarakhand",
  "Assam",
  "Other"
];

// No demo/seed users — all users authenticate via Google
export const initialUsers = [];

export const CATEGORY_TREE = {
  "All": {
    subcategories: ["All Items", "Urgent Deals", "Senior Picks", "Under ₹500", "Rentals Only"],
    icon: "Layers"
  },
  "Books & Notes": {
    subcategories: ["All Books", "Engineering Textbooks", "Handwritten Notes", "GATE / CAT Prep", "Solved PYQ Papers"],
    icon: "BookOpen"
  },
  "Question Banks & Solutions": {
    subcategories: ["Semester Finals (PYQ)", "Mid-Sem Solutions", "Lab Viva Questions", "Placement / Core Company Qs"],
    icon: "FileText"
  },
  "Electronics & Tech": {
    subcategories: ["All Electronics", "Scientific Calculators", "Laptops & Accessories", "Monitors & Keyboards", "Headphones & Audio"],
    icon: "Cpu"
  },
  "Project & Lab Parts": {
    subcategories: ["All Lab & Projects", "Arduino & Raspberry Pi", "Sensors & Breadboards", "Mini Drafters & Tools", "Lab Coats & Kits"],
    icon: "CircuitBoard"
  },
  "Hostel & PG Living": {
    subcategories: [],
    icon: "Home",
    comingSoon: true
  },
  "Cycles & Campus Commute": {
    subcategories: ["All Commute", "Geared Bicycles", "Single Speed Cycles", "Locks & Accessories"],
    icon: "Bike"
  },
  "Sports & Hobbies": {
    subcategories: ["All Hobbies", "Badminton & Cricket", "Acoustic Guitars", "Gym Gear"],
    icon: "Trophy"
  },
  "Other / Miscellaneous": {
    subcategories: ["All Other Items", "Musical Instruments", "Gym & Fitness", "Room Decor & Lighting", "Stationery & Tools"],
    icon: "Sparkles"
  }
};

export const CATEGORIES = Object.keys(CATEGORY_TREE);

export const GENDER_FILTERS = [
  { id: "All", label: "All PGs", icon: "🏠" },
  { id: "Girls Only", label: "Girls Only", icon: "🌸" },
  { id: "Boys Only", label: "Boys Only", icon: "🔷" },
  { id: "Co-ed / Any", label: "Co-ed / Any", icon: "👥" }
];

// No demo/seed listings — marketplace starts empty, populated by real users
export const initialListings = [];

export const BRANCHES = [
  "Computer Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Information Technology",
  "All Branches"
];

export const YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "All Years"
];
