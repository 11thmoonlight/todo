import { Schema, model, models } from "mongoose";

const ListSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
  },
  { Timestamps: true }
);

const List = models.List || model("List", ListSchema);

export default List;
