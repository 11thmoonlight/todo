"use client";

import { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";

function TagForm({ setShowTagForm, showTagForm }) {
  const [fields, setFields] = useState({
    name: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowTagForm(false);
    }
  };

  return (
    showTagForm && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
        onClick={handleBackgroundClick}
      >
        <div className="absolute inset my-auto bg-emerald-100 px-4 py-4 rounded-2xl shadow-lg">
          <button
            onClick={() => {
              setShowTagForm(false);
            }}
          >
            <RiCloseLargeLine />
          </button>
          <form
            action="/api/tags"
            method="POST"
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
              Add
            </button>
          </form>
        </div>
      </div>
    )
  );
}

export default TagForm;
