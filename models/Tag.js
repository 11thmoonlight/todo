import { Schema, model, models } from "mongoose";

const TagSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
  },
  { Timestamps: true }
);

const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
