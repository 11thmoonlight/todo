import connectDB from "@/config/database";
import List from "@/models/List";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/lists/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const list = await List.findById(params.id);

    if (!list) return new Response("List not found", { status: 404 });

    return new Response(JSON.stringify(list), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();
    const { user, userId } = await getSessionUser();

    if (!user || !userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const formData = await request.formData();

    const ListData = {
      user_id: userId,
      name: formData.get("name"),
      color: formData.get("color"),
    };

    const newList = new List(ListData);

    await newList.save();

    return Response.redirect(`${process.env.NEXTAUTH_URL}`);
  } catch (error) {
    console.log(error);
    return new Response("Failed to add task", { status: 500 });
  }
};

// DELETE /api/lists/:id
export const DELETE = async (request, { params }) => {
  try {
    const listId = params.id;
    const sessionUser = await getSessionUser();

    // Check for session
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const list = await List.findById(listId);

    if (!list) return new Response("List not found", { status: 404 });

    // Verify ownership
    if (list.user_id.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await list.deleteOne();

    return new Response("List Deleted", { status: 200 });
  } catch {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT / api/lists/:id
export const PUT = async (requset, { params }) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const { id } = params;
    const { userId } = sessionUser;

    const formData = await requset.formData();

    const existingList = await List.findById(id);

    if (!existingList) {
      return new Response("List does not exist", { status: 404 });
    }

    if (existingList.user_id.toString() !== userId) {
      return new Response("Unauthorizes", { status: 401 });
    }

    const listData = {
      user_id: userId,
      name: formData.get("name"),
      color: formData.get("color"),
    };

    const updateList = await List.findByIdAndUpdate(id, listData, {
      new: true,
    });

    return new Response(JSON.stringify(updateList), { status: 200 });
  } catch (error) {
    return new Response("Failed to add tag", { status: 500 });
  }
};
