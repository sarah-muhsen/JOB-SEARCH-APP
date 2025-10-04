
import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
     logoimage: {
    secure_url: String,
    public_id: String,
  },
    coverimage: {
    secure_url: String,
    public_id: String,
  },
    description: {
      type: String,
    },

    industry: {
      type: String,
   
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    address: {
      type: String,

    },

    numberOfEmployees: {
      type: String, 
   
    },

    companyEmail: {
      type: String,
      required: true,
      unique: true,
    
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    logo: {
      secure_url: { type: String },
      public_id: { type: String },
    },

    coverPic: {
      secure_url: { type: String },
      public_id: { type: String },
    },

    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    bannedAt: { type: Date },
    deletedAt: { type: Date },

    legalAttachment: {
      secure_url: { type: String },
      public_id: { type: String },
    },

    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const companymodel = mongoose.model("company", companySchema);
