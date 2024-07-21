"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { fetchTask } from "@/utils/requests";
import { RiCloseLargeLine } from "react-icons/ri";

function TaskEditForm({ showTaskEditForm, setShowTaskEditForm, id }) {
  const router = useRouter();

  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [fields, setFields] = useState({
    title: "",
    description: "",
    priority: "",
    list: "",
    tag: "",
    due_date: "",
  });

  // Fetch property data for form

  useEffect(() => {
    setMounted(true);

    // Fetch list data for form
    const fetchTaskData = async () => {
      try {
        const taskData = await fetchTask(id);

        setFields(taskData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTaskData();
  }, [id]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch(`/api/lists`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setLists(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`/api/tags`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setTags(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTags();
  }, []);

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
      setShowTaskEditForm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);

      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 200) {
        router.push(`/tasks/${id}`);
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
    showTaskEditForm &&
    mounted && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
        onClick={handleBackgroundClick}
      >
        <div className="absolute inset w-[370px] m-auto bg-emerald-100 px-8 py-8 rounded-2xl shadow-lg">
          <button
            onClick={() => {
              setShowTaskEditForm(false);
            }}
          >
            <RiCloseLargeLine />
          </button>
          <form
            onSubmit={handleSubmit}
            className="container flex flex-col text-center"
          >
            <label
              htmlFor="title"
              className="block text-gray-700 font-bold mb-2"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              className="border rounded w-full px-3 py-1 mb-3"
              required
              value={fields.title}
              onChange={handleChange}
            />

            <label
              htmlFor="description"
              className="block text-gray-700 font-bold mb-2"
            >
              Description
            </label>
            <input
              id="description"
              type="text"
              name="description"
              className="border rounded w-full py-1 px-3 mb-3"
              required
              value={fields.description}
              onChange={handleChange}
            />

            <label
              htmlFor="priority"
              className="block text-gray-700 font-bold mb-2"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              className="border rounded w-full py-1 px-3 mb-3"
              required
              value={fields.priority}
              onChange={handleChange}
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>

            <label
              htmlFor="list"
              className="block text-gray-700 font-bold mb-2"
            >
              List
            </label>
            <select
              id="list"
              name="list"
              className="border rounded w-full py-1 px-3 mb-3"
              required
              value={fields.list}
              onChange={handleChange}
            >
              {lists.map((list, i) => (
                <option value={list._id} key={i}>
                  {list.name}
                </option>
              ))}
            </select>

            <label htmlFor="tag" className="block text-gray-700 font-bold mb-2">
              Tag
            </label>
            <select
              id="tag"
              name="tag"
              className="border rounded w-full py-1 px-3 mb-3"
              required
              value={fields.tag}
              onChange={handleChange}
            >
              {tags.map((tag, i) => (
                <option value={tag._id} key={i}>
                  {tag.name}
                </option>
              ))}
            </select>
            <label
              htmlFor="dueDate"
              className="block text-gray-700 font-bold mb-2"
            >
              Date and Time
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              name="due_date"
              className="border rounded w-full py-1 px-3 mb-3"
              required
              value={fields.due_date}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="bg-emerald-300 items-center py-2 px-4 rounded-lg font-bold hover:bg-emerald-400"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default TaskEditForm;
