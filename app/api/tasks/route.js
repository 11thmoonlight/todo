import connectDB from "@/config/database";
import Task from "@/models/Task";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/tasks
export const GET = async (request) => {
  try {
    await connectDB();

    const tasks = await Task.find({});

    return new Response(JSON.stringify(tasks), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("something went wrong", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();
    const { user, userId } = await getSessionUser();

    if (!user || !userId) {
      console.log(user, userId);
      return new Response("User Id is required", { status: 401 });
    }

    const formData = await request.formData();
    console.log(formData.get("list"));

    const TaskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      due_date: formData.get("dueDate"),
      priority: formData.get("priority"),
      list: formData.get("list"),
      tag: formData.get("tag"),
      user: userId,
    };

    const newTask = new Task(TaskData);

    await newTask.save();
    return Response.redirect(`${process.env.NEXTAUTH_URL}`);
  } catch (error) {
    console.log(error);
    return new Response("Failed to add task", { status: 500 });
  }
};
