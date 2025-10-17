import mongoose, { Schema, Types, model } from "mongoose";
import { generatehash } from "../../utils/security/hash.js";
import { decrypt, encrypt } from "../../utils/security/encrypt.js";
export const gendertypes={
    male:"male",
    female:"female"
}
export const roletypes={
    user:"user",
    admin:"admin",
    HR:"HR",
    owner:"owner"
    
}
export const providertypes={
    system:"system",
    google:"google"
}
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
    isDeleted: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
   required:(data)=>{
        return data?.provider==providertypes.google?false:true
    }
  },
  provider: {
    type: String,
    enum:Object.values(providertypes),
    default:providertypes.system,
  },
  gender: {
    type: String,
    enum: Object.values(gendertypes),
    default:gendertypes.male
  },
  DOB: {
    type: Date,
    // required: true,
  },
  mobileNumber: String,
  role: {
    type: String,
    enum:Object.values(roletypes),
    default:roletypes.user,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  bannedAt: Date,
  updatedBy: { type: Types.ObjectId, ref: "user" },
  changeCredentialTime: Date,
  profilePic: {
    secure_url: String,
    public_id: String,
  },
  coverPic:[{
    secure_url: String,
    public_id: String,
  }],
  OTP: [
    {
      code: String, // هنخزنها بعد ما نعملها hash
      type: {
        type: String,
        enum: ["confirmEmail", "forgetPassword"],
      },
      expiresIn: Date,
    },
  ],
}, { timestamps: true });

// Virtual field
userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.pre("save", function (next) {
  console.log("pre hook 2");
  console.log("before encrypt:", this.mobileNumber);


  // avoid double hashing on update
  if (this.isModified("password")) {
    this.password = generatehash({ plaintext: this.password });
  }

  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt({ plaintext: this.mobileNumber });

  }

  next();
});
userSchema.post("init", function (doc) {
  if (doc.mobileNumber) {
    doc.mobileNumber = decrypt({ ciphertext: doc.mobileNumber });
  }
});

userSchema.post("save", function (doc) {
  console.log({ doc });
});

export const userModel = mongoose.models.User || model("user", userSchema);