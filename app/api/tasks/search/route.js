import connectDB from "@/config/database";
import Task from "@/models/Task";
import { ObjectId } from "mongoose";

// GET /api/tasks/search
export const GET = async (request, res) => {
  try {
    await connectDB();

    const { searchParams } = new URL(
      request.url,
      `http://${request.headers.host}`
    );
    const task = searchParams.get("task");

    if (!task || task.trim() === "") {
      return res
        .status(400)
        .json({ error: "Task query parameter is required" });
    }

    let searchPattern;

    try {
      searchParams = new RegExp(task, "i");
    } catch (error) {
      return res.status(400).json({ error: "Invalid search patterns" });
    }

    let query = {
      $or: [
        { title: searchPattern },
        { description: searchPattern },
        { due_date: searchPattern },
        { priority: searchPattern },
        { list: searchPattern },
        { tag: searchPattern },
      ],
    };

    const tasks = await Task.find(query);

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
