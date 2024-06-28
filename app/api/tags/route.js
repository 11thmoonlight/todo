import connectDB from "@/config/database";
import Tag from "@/models/Tag";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/lists
export const GET = async (request) => {
  try {
    await connectDB();

    const tags = await Tag.find({});

    return new Response(JSON.stringify(tags), { status: 200 });
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

    const TagData = {
      user_id: userId,
      name: formData.get("name"),
      color: formData.get("color"),
    };

    const newTag = new Tag(TagData);

    await newTag.save();

    return Response.redirect(`${process.env.NEXTAUTH_URL}/tags/${newTag._id}`);
  } catch (error) {
    console.log(error);
    return new Response("Failed to add task", { status: 500 });
  }
};
