"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import TaskCard from "./TaskCard";
import Spinner from "./Spinner";
import Pagination from "./Pagination";
import AddNew from "./AddNew";
import { TaskFilterContext } from "@/app/context/TaskFilterContext";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);

  const { filteredTasks, setFilteredTasks } = useContext(TaskFilterContext);

  console.log(filteredTasks);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks?page=${page}&pageSize=${pageSize}`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        console.log(data);

        const tasksWithDetails = await Promise.all(
          data.map(async (task) => {
            const tagResponse = await fetch(`/api/tags/${task.tag}`);
            const tagData = await tagResponse.json();
            const listResponse = await fetch(`/api/lists/${task.list}`);
            const listData = await listResponse.json();

            return {
              ...task,
              tag: tagData.name,
              tagColor: tagData.color,
              list: listData.name,
              listColor: listData.color,
            };
          })
        );

        setTasks(tasksWithDetails);
        setTotalItems(data.length);
        console.log(data.totalItems);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [page, pageSize]);

  useEffect(() => {
    const filteredTaskWithDetails = async () => {
      const taskWithDtails = await Promise.all(
        filteredTasks.map(async (task) => {
          const tagResponse = await fetch(`/api/tags/${task.tag}`);
          const tagData = await tagResponse.json();
          const listResponse = await fetch(`/api/lists/${task.list}`);
          const listData = await listResponse.json();

          return {
            ...task,
            tag: tagData.name,
            tagColor: tagData.color,
            list: listData.name,
            listColor: listData.color,
          };
        })
      );
      setFilteredTasks(taskWithDtails);
    };

    if (filteredTasks.length > 0) {
      filteredTaskWithDetails();
    }
  }, [filteredTasks]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const displayedTasks = filteredTasks;

  return loading ? (
    <Spinner />
  ) : (
    <section className="flex flex-col min-h-screen px-4 w-full">
      <div className=" flex-grow container-xl lg:container m-auto">
        {displayedTasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AddNew />
            {displayedTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
    </section>
  );
}

export default Tasks;
