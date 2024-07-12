"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GrSearch } from "react-icons/gr";

function SearchForm() {
  const [task, setTask] = useState("");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    const query = `?task=${task}`;

    if (task !== "") {
      router.push(`/tasks/search-results${query}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search"
        className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-1 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
        value={task}
        onChange={(e) => {
          setTask(e.target.value);
          console.log(e.target.value);
        }}
      />
      <button
        type="submit"
        className="absolute inset-y-0 left-0 flex items-center pl-2"
      >
        <GrSearch />
      </button>
    </form>
  );
}

export default SearchForm;
