"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import TaskCard from "./TaskCard";
import Spinner from "./Spinner";
import Pagination from "./Pagination";
import AddNew from "./AddNew";
import { TaskFilterContext } from "@/app/context/TaskFilterContext";
import { toast } from "react-toastify";

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
        console.log(totalItems);
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

  const handleStatusChange = async (taskId) => {
    try {
      const task = tasks.find((task) => task._id === taskId);
      const newStatus = !task.status;

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        );

        console.log(updatedTasks);
        setTasks(updatedTasks);
        toast.success("Task status updated");
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update task status");
    }
  };

  const displayedTasks = filteredTasks;

  return loading ? (
    <Spinner />
  ) : (
    <section className="flex flex-col min-h-screen px-4 w-full">
      <div className="grow m-auto">
        {displayedTasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <div className="grid grid-cols-1 min-[1350px]:grid-cols-4 min-[1100px]:grid-cols-3 min-[800px]:grid-cols-2 gap-4">
            <AddNew />
            {displayedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                handleStatusChange={handleStatusChange}
              />
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
