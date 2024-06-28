import { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    due_date: { type: Date },
    status: { type: Boolean, default: false },
    priority: { type: String },
    list: { type: Schema.Types.ObjectId, ref: "List" },
    tag: { type: Schema.Types.ObjectId, ref: "Tag" },
  },
  { timestamps: true }
);

const Task = models.Task || model("Task", TaskSchema);

export default Task;
