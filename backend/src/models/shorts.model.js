import mongoose, {Schema} from "mongoose"


const shortsSchema = new Schema(
    {   title:{
           type: String,
           required: true,
           trim: true,
        },
        description:{
            type: String,
            required: true,
            trim: true,
        },
       video: {
           url: { type: String, required: true },
           public_id: { type: String },
       },

        postedBy:
        {
           type: Schema.Types.ObjectId,
           ref: "User",
           required: true
        },
        upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", 
      }
    ],
     downvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User", 
      }
    ],


    shares: {
      type: Number,
      default: 0,    
    }

    },
    {timestamps: true}
)