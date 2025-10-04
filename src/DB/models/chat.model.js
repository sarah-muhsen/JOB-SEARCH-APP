import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // HR أو company owner
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // أي user
      required: true,
    },

    messages: [
      {
        message: { type: String, required: true },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user", // اللي بعت الرسالة
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const chatmodel = mongoose.model("chat", chatSchema);
