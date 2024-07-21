import Task from "@/models/Task";
import { getSessionUser } from "@/utils/getSessionUser";
import connectDB from "@/config/database";

// GET /api/tasks/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const task = await Task.findById(params.id);

    if (!task) return new Response("Task not found", { status: 404 });

    return new Response(JSON.stringify(task), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// POST

export const POST = async (request) => {
  try {
    await connectDB();
    const { user, userId } = await getSessionUser();

    if (!user || !userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const formData = await request.formData();

    const TaskData = {
      user: userId,
      title: formData.get("title"),
      description: formData.get("description"),
      due_date: formData.get("due_date"),
      status: formData.get("status"),
      priority: formData.get("priority"),
      list: formData.get("list"),
      tag: formData.get("tag"),
    };

    const newTask = new Task(TaskData);

    await newTask.save();
    return Response.redirect(`${process.env.NEXTAUTH_URL}`);
  } catch (error) {
    console.log(error);
    return new Response("Failed to add task", { status: 500 });
  }
};

// DELETE
export const DELETE = async (request, { params }) => {
  try {
    const taskId = params.id;
    const sessionUser = await getSessionUser();

    // Check for session
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const task = await Task.findById(taskId);

    if (!task) return new Response("Task not found", { status: 404 });

    // Verify ownership
    if (task.user.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await task.deleteOne();

    return new Response("Task Deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT /api/tasks/:id

export const PUT = async (request, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const { id } = params;
    const { userId } = sessionUser;

    const contentType = request.headers.get("Content-Type");
    let taskData;

    if (contentType.includes("application/json")) {
      taskData = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      taskData = {
        user: userId,
        title: formData.get("title"),
        description: formData.get("description"),
        due_date: formData.get("due_date"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        list: formData.get("list"),
        tag: formData.get("tag"),
      };
    } else {
      return new Response("Unsupported Content Type", { status: 400 });
    }

    const exsitingTask = await Task.findById(id);

    if (!exsitingTask) {
      return new Response("Task does not exist", { status: 404 });
    }

    if (exsitingTask.user.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const updateTask = await Task.findByIdAndUpdate(id, taskData, {
      new: true,
    });

    return new Response(JSON.stringify(updateTask), { status: 200 });
  } catch (error) {
    return new Response("Failed to update task", { status: 500 });
  }
};
