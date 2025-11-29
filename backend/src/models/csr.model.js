<<<<<<< HEAD
import mongoose, {Schema} from "mongoose"
  
const csrSchema = new Schema({
     companyName:{
        type: String,
        required: true,
        unique: true,
        trim: true
     },
     companyEmail:{
       type: String,
       required: true,
       unique: true
     },
     companyDescription:{
        type: String,
        required: true
     },
    //  donations:{
    //    type: String,
    //    required: true
    //  },
     issuesResolved:[
        report:{
            type: Schema.Types.ObjectId,
            ref: "Report"
        }
     ],
     companyProfilePhoto:{
        type: String,
        required: true
     }
     },
    {timestamps:true}
)
=======
import mongoose, { Schema } from "mongoose";
>>>>>>> 1b2aaabcae60dc587b2e049da72d2d626bc9da1d

const csrSchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    companyDescription: {
      type: String,
      required: true,
    },
    donations: {
      type: String,
      required: true,
    },
    issuesResolved: [
      {
        report: {
          type: Schema.Types.ObjectId,
          ref: "Report",
        },
      },
    ],
    companyProfilePhoto: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

csrSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

csrSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

csrSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      companyEmail: this.companyEmail,
      companyName: this.companyName,
    },
    process.env.CSR_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const Csr = mongoose.model("Csr", csrSchema);
