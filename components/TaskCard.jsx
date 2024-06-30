"use client";

import { format } from "date-fns";
import { GrFormEdit } from "react-icons/gr";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useState, useEffect } from "react";
import TaskEditForm from "./TaskEditForm";
import { toast } from "react-toastify";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

function TaskCard({ task }) {
  const [showTaskEditForm, setShowTaskEditForm] = useState(false);
  const [showDeleteTaskForm, setShowDeleteTaskForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);

  const handleEditClick = (id) => {
    setSelectedTaskId(id);
    setShowTaskEditForm(!showTaskEditForm);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/tasks`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setTasks(data);
        console.log("tasks", data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm("Are you sure you want to delete");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });

      if (res.status === 200) {
        const updatedTasks = tasks.filter((task) => task._id !== taskId);
        setTasks(updatedTasks);
        toast.success("Task Deleted");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete task");
    }
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

  return (
    <div
      style={{
        backgroundColor: task.tagColor,
        borderBottomColor: task.listColor,
        borderBottomWidth: "10px",
      }}
      className="rounded-lg shadow-md h-72 w-72 pt-4 pb-1 px-4 sm:px-6 grid grid-cols-1 divide-y"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center">
        {task.title}
      </h2>
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold tracking-wider">
          DESCRIPTION
        </p>
        <span className="text-xs sm:text-sm">{task.description}</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold tracking-wider">
          PRIORITY
        </p>
        <span className="text-xs sm:text-sm">{task.priority}</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold tracking-wider">LIST</p>
        <span className="text-xs sm:text-sm">{task.list}</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold tracking-wider">TAG</p>
        <span className="text-xs sm:text-sm">{task.tag}</span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold tracking-wider">DATE</p>
        <span className="text-xs sm:text-sm">
          {format(new Date(task.due_date), "MMMM do, HH:mm")}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={() => handleDeleteTask(task._id)}>
          <MdOutlineDeleteOutline />
        </button>
        <button onClick={() => handleEditClick(task._id)}>
          <GrFormEdit />
        </button>
        <button onClick={() => handleStatusChange(task._id)}>
          <IoCheckmarkDoneCircleOutline />
        </button>
      </div>
      {showTaskEditForm && (
        <TaskEditForm
          showTaskEditForm={showTaskEditForm}
          setShowTaskEditForm={setShowTaskEditForm}
          id={selectedTaskId}
        />
      )}
    </div>
  );
}

export default TaskCard;
