"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RiCloseLargeLine } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";
import { fetchList } from "@/utils/requests";

function ListEditForm({ showListEditForm, setShowListEditForm, id }) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [fields, setFields] = useState({
    name: "",
    color: "",
  });

  // Fetch property data for form

  useEffect(() => {
    setMounted(true);

    // Fetch list data for form
    const fetchListData = async () => {
      try {
        const listData = await fetchList(id);

        setFields(listData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListData();
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
      setShowListEditForm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const res = await fetch(`/api/lists/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 200) {
        router.push(`/lists/${id}`);
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

  return (
    showListEditForm &&
    mounted && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
        onClick={handleBackgroundClick}
      >
        <div className="absolute inset top-52 right-[30rem] my-auto bg-emerald-100 px-4 py-4 rounded-2xl shadow-lg">
          <button
            onClick={() => {
              setShowListEditForm(false);
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
              className="block mb-3 font-bold text-gray-600"
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

            <label htmlFor="color" className="block mb-3 font-bold">
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
              className="bg-emerald-300 items-center py-2 px-4 rounded-lg font-bold hover:bg-emerald-400"
            >
              Edit
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default ListEditForm;
