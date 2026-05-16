const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("./models/user");
const Complaint = require("./models/complaint");
const dotenv = require("dotenv");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete all users except rakesh@gmail.com
    await User.deleteMany({ email: { $ne: "rakesh@gmail.com" } });
    console.log("Cleared existing users");

    // Delete all complaints
    await Complaint.deleteMany({});
    console.log("Cleared existing complaints");

    // Ensure rakesh is admin
    let admin = await User.findOne({ email: "rakesh@gmail.com" });
    if (!admin) {
      const hashedPassword = await bcryptjs.hash("rakesh@123", 10);
      admin = await User.create({
        name: "Rakesh Admin",
        email: "rakesh@gmail.com",
        phone: "9876543210",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Created admin: rakesh@gmail.com");
    } else {
      admin.role = "admin";
      await admin.save();
      console.log("Updated rakesh to admin role");
    }

    // Create 5 standard users
    const standardUsers = [
      { name: "Amit Kumar", email: "amit@example.com", phone: "9988776655" },
      { name: "Priya Singh", email: "priya@example.com", phone: "8877665544" },
      { name: "Ravi Patel", email: "ravi@example.com", phone: "7766554433" },
      { name: "Neha Verma", email: "neha@example.com", phone: "6655443322" },
      { name: "Suresh Gupta", email: "suresh@example.com", phone: "5544332211" },
    ];

    const createdUsers = [];
    for (const userData of standardUsers) {
      const hashedPassword = await bcryptjs.hash("password123", 10);
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        role: "user",
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    }

    // Create 2 complaints for each user
    const complaintCategories = [
      "Infrastructure",
      "Service",
      "Maintenance",
      "Safety",
      "Billing",
    ];
    const complaintStatuses = ["Pending", "In Progress", "Resolved"];

    for (const user of createdUsers) {
      for (let i = 1; i <= 2; i++) {
        const category =
          complaintCategories[Math.floor(Math.random() * complaintCategories.length)];
        const status = complaintStatuses[Math.floor(Math.random() * complaintStatuses.length)];
        const priority =
          ["Low", "Medium", "High"][Math.floor(Math.random() * 3)];

        const complaint = await Complaint.create({
          title: `${category} Issue #${i} - ${user.name}`,
          description: `This is a ${category.toLowerCase()} complaint regarding ${category.toLowerCase()} services. The issue has been reported and is awaiting resolution. Please investigate at your earliest convenience.`,
          category,
          priority,
          status,
          user: user._id,
        });
        console.log(
          `Created complaint for ${user.email}: ${complaint.title}`
        );
      }
    }

    console.log("✓ Test data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
