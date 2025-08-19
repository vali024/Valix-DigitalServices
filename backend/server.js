import "dotenv/config.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import contactRouter from "./routes/contactRoute.js";
import portfolioRouter from "./routes/portfolioRoute.js";
import fs from "fs";
import path from "path";

// Validate required environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET"
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(
    "Error: Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  process.exit(1);
}

//app config
const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both frontend and admin
    credentials: true,
  })
);

const port = process.env.PORT || 4000;

// middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

//DB connection
connectDB().catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

// Create uploads directory for contacts if it doesn't exist
const contactUploadsDir = path.join(process.cwd(), 'uploads', 'contacts');
if (!fs.existsSync(contactUploadsDir)) {
  fs.mkdirSync(contactUploadsDir, { recursive: true });
}

// Request validation middleware
const validateRequest = (req, res, next) => {
  // Validate order placement requests
  if (req.path === "/api/order/place" && req.method === "POST") {
    const { items, amount, address, payment } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    if (!address || !address.firstName || !address.phone || !address.street) {
      return res.status(400).json({
        success: false,
        message: "Missing required address fields",
      });
    }

    if (!payment?.method || !["COD"].includes(payment.method)) {
      return res.status(400).json({
        success: false,
        message: "Only COD payment method is supported",
      });
    }
  }

  next();
};

app.use(validateRequest);

//api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);
app.use("/api/portfolio", portfolioRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("API Working");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong! Please try again later.",
  });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});