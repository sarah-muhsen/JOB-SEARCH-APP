import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job", // lowercase ref
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // lowercase ref
      required: true,
    },

    userCV: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "viewed", "in consideration", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const applicationmodel = mongoose.model("application", applicationSchema);
