import connectDB from "@/config/database";
import List from "@/models/List";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/lists
export const GET = async (request) => {
  try {
    await connectDB();

    const lists = await List.find({});

    return new Response(JSON.stringify(lists), { status: 200 });
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
