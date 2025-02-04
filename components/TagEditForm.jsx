"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RiCloseLargeLine } from "react-icons/ri";
import { fetchTag } from "@/utils/requests";
import { useParams, useRouter } from "next/navigation";

function TagEditForm({ setShowTagEditForm, showTagEditForm, id }) {
  const router = useRouter();
  console.log(id);

  const [mounted, setMounted] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    color: "",
  });

  useEffect(() => {
    setMounted(true);

    const fetchTagData = async () => {
      try {
        const tagData = await fetchTag(id);

        console.log("tagEdit", tagData);
        setFields(tagData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTagData();
  }, [id]);

  const handleChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;

    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowTagEditForm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const res = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 200) {
        router.push(`tags/${id}`);
      } else if (res.status === 401 || res.status === 403) {
        toast.error("Permision denied");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  //top-52 right-[30rem]

  return (
    showTagEditForm &&
    mounted && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
        onClick={handleBackgroundClick}
      >
        <div className="absolute inset m-auto my-auto bg-emerald-100 px-4 py-4 rounded-2xl shadow-lg">
          <button
            onClick={() => {
              setShowTagEditForm(false);
            }}
          >
            <RiCloseLargeLine />
          </button>
          <form
            onSubmit={handleSubmit}
            className="container flex flex-col text-center"
          >
            <label
              htmlFor="name"
              className="block mb-3 font-bold text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              className="border rounded w-full py-2 px-3 mb-6"
              required
              value={fields.name}
              onChange={handleChange}
            />

            <label
              htmlFor="color"
              className="block mb-3 font-bold text-gray-700"
            >
              Color
            </label>
            <input
              id="color"
              name="color"
              type="color"
              className="border rounded py-2 px-3 mb-6 appearance-none cursor-pointer h-12"
              required
              value={fields.color}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-emerald-300 text-gray-700 items-center py-2 px-4 rounded-lg font-bold hover:bg-emerald-400"
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default TagEditForm;
