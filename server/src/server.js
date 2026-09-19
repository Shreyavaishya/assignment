
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

import connectDB from "./config/db.js";
import Business from "./models/Business.js";
import Feedback from "./models/Feedback.js";
import generateReviews from "./services/reviewGenerator.js";

dotenv.config();

// Use Google DNS because Node's default DNS resolver
// was failing to resolve MongoDB Atlas SRV records.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// ROOT ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Smart Review API is running",
  });
});


// =========================
// GET BUSINESS
// =========================

app.get("/api/business/:id", async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    res.status(200).json(business);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch business",
      error: error.message,
    });
  }
});


// =========================
// SEED BUSINESS
// =========================

app.post("/api/seed-business", async (req, res) => {
  try {
    const business = await Business.create({
      name: "Glow Beauty Studio",
      type: "Salon",
    });

    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create business",
      error: error.message,
    });
  }
});


// =========================
// GENERATE REVIEW SUGGESTIONS
// =========================

app.post("/api/reviews/generate", (req, res) => {
  try {
    const {
      rating,
      businessType,
      service,
      context,
    } = req.body;

    // Validate rating
    if (
      rating === undefined ||
      rating === null ||
      Number.isNaN(Number(rating))
    ) {
      return res.status(400).json({
        message: "Rating is required and must be a number between 1 and 5",
      });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const suggestions = generateReviews({
      rating: numericRating,
      businessType,
      service,
      context,
    });

    res.status(200).json({
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate reviews",
      error: error.message,
    });
  }
});


// =========================
// SAVE REVIEW
// =========================

app.post("/api/reviews", async (req, res) => {
  try {
    const {
      businessId,
      rating,
      service,
      context,
      generatedSuggestions,
      finalText,
      feedbackType,
    } = req.body;

    // Validate required fields
    if (
      !businessId ||
      rating === undefined ||
      !finalText ||
      !feedbackType
    ) {
      return res.status(400).json({
        message:
          "businessId, rating, finalText, and feedbackType are required",
      });
    }

    // Validate rating
    if (
      Number.isNaN(Number(rating)) ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a number between 1 and 5",
      });
    }

    // Validate feedback type
    if (!["positive", "needs_attention"].includes(feedbackType)) {
      return res.status(400).json({
        message:
          "feedbackType must be either positive or needs_attention",
      });
    }

    // Check whether business exists
    const business = await Business.findById(businessId);

    if (!business) {
      return res.status(404).json({
        message: "Business not found",
      });
    }

    // Save feedback
    const feedback = await Feedback.create({
      businessId,
      rating: Number(rating),
      service,
      context,
      generatedSuggestions: generatedSuggestions || [],
      finalText,
      feedbackType,
    });

    res.status(201).json(feedback);
  } catch (error) {
    console.error("SAVE REVIEW ERROR:", error);

    res.status(500).json({
      message: "Failed to save feedback",
      error: error.message,
    });
  }
});


// =========================
// GET REVIEWS
// =========================

app.get("/api/reviews", async (req, res) => {
  try {
    const { rating } = req.query;

    const filter = {};

    // Optional rating filter
    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        Number.isNaN(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          message: "Rating must be a number between 1 and 5",
        });
      }

      filter.rating = numericRating;
    }

    const reviews = await Feedback.find(filter)
      .populate("businessId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

