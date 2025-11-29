import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  { 
    title:{
     type: String,
      required: true,
      trim: true,     
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    photos: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      }
    ],

    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    address: {
      type: String,
      required: true,
    },

    // status: {
    //   type: String,
    //   required: true,
    //   default: "pending",
    // },

    // priority: {
    //   type: String,
    //   required: true,
    // },
  },

  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
