"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import TaskCard from "@/components/TaskCard";
import Spinner from "@/components/Spinner";
import SearchForm from "@/components/SearchForm";

function SearchResultPage() {
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const task = searchParams.get("task");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(`/api/tasks/search?task=${task}`);

        if (res.status === 200) {
          const data = await res.json();
          setTasks(data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [task]);

  return (
    <>
      <section className="bg-blue-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <SearchForm />
        </div>
      </section>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <section className="px-4 py-6">
          <div className="container-xl lg:container m-auto px-4 py-6">
            <Link
              href="/tasks"
              className="flex items-center text-blue-500 hover:underline mb-3"
            >
              <FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Tasks
            </Link>
            <h1 className="text-2xl mb-4">Search Results</h1>
            {tasks.length === 0 ? (
              <p>No search results found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default SearchResultPage;
