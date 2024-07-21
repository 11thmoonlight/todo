import connectDB from "@/config/database";
import Tag from "@/models/Tag";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/lists/:id
export const GET = async (request, { params }) => {
  try {
    await connectDB();

    const tag = await Tag.findById(params.id);

    if (!tag) return new Response("Tag not found", { status: 404 });

    return new Response(JSON.stringify(tag), { status: 200 });
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

    return Response.redirect(`${process.env.NEXTAUTH_URL}`);
  } catch (error) {
    console.log(error);
    return new Response("Failed to add task", { status: 500 });
  }
};

// DELETE /api/tags/:id
export const DELETE = async (request, { params }) => {
  try {
    const tagId = params.id;
    const sessionUser = await getSessionUser();

    // Check for session
    if (!sessionUser || !sessionUser.userId) {
      return new Response("User Id is required", { status: 401 });
    }

    const { userId } = sessionUser;

    await connectDB();

    const tag = await Tag.findById(tagId);

    if (!tag) return new Response("Tag not found", { status: 404 });

    // Verify ownership
    if (tag.user_id.toString() !== userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await tag.deleteOne();

    return new Response("Tag Deleted", { status: 200 });
  } catch {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// PUT / api/tags/:id
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

    const existingTag = await Tag.findById(id);

    if (!existingTag) {
      return new Response("Tag does not exist", { status: 404 });
    }

    if (existingTag.user_id.toString() !== userId) {
      return new Response("Unauthorizes", { status: 401 });
    }

    const tagData = {
      user_id: userId,
      name: formData.get("name"),
      color: formData.get("color"),
    };

    const updateTag = await Tag.findByIdAndUpdate(id, tagData, { new: true });

    return new Response(JSON.stringify(updateTag), { status: 200 });
  } catch (error) {
    return new Response("Failed to add tag", { status: 500 });
  }
};
