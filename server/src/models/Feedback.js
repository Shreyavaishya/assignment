import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    service: {
      type: String,
      trim: true,
      default: "",
    },

    context: {
      type: String,
      trim: true,
      default: "",
    },

    generatedSuggestions: {
      type: [String],
      default: [],
    },

    finalText: {
      type: String,
      required: true,
      trim: true,
    },

    feedbackType: {
      type: String,
      enum: ["positive", "needs_attention"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;