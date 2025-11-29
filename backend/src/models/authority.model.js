import mongoose, {Schema} from "mongoose"

const authoritySchema = new Schema({
   name:{
      type: String,
      required: true,
      trim: true,
      index: true
   },
   email:{
      type: String,
      required: true,
      unique:true,
      trim: true
   },
   password:{
      type: String,
      required: true ["Password is required"]
   },
   designation:{
      type: String,
      required: true
   },
   category:{
      type: String,
      required: true
   }
},
{timestamps: true})



authoritySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


authoritySchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};


authoritySchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.AUTHORITY_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const Authority = mongoose.model("Authority", adminSchema)