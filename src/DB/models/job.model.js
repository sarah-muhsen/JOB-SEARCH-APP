import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },

    jobLocation: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      required: true,
    },

    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },

    seniorityLevel: {
      type: String,
      enum: ["Fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      required: true,
    },

    jobDescription: {
      type: String,
      required: true,
    },

    technicalSkills: [String],

    softSkills: [String],

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
    },

    closed: {
      type: Boolean,
      default: false,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
  },
  { timestamps: true }
);

export const jobmodel = mongoose.model("job", jobSchema);
