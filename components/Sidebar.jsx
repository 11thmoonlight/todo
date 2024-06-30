"use client";

import { GrMenu } from "react-icons/gr";
import { MdDoneAll, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { MdOutlineFormatListBulleted } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";
import { GrFormEdit } from "react-icons/gr";
import { MdAdd } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { IoIosArrowUp } from "react-icons/io";

import styles from "../styles/scrollbar.module.css";

import SearchForm from "./SearchForm";
import ListForm from "./ListForm";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import TagForm from "./TagForm";
import { toast } from "react-toastify";
import ListEditForm from "./ListEditForm";
import TagEditForm from "./TagEditForm";
import { TaskFilterContext } from "@/app/context/TaskFilterContext";
import { RiCloseLargeLine } from "react-icons/ri";

function Sidebar() {
  const [showListForm, setShowListForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [showListEditForm, setShowListEditForm] = useState(false);
  const [showTagEditForm, setShowTagEditForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  const [lists, setLists] = useState([]);
  const [tags, setTags] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [openSidebar, setOpenSidebar] = useState(false);

  const { setFilteredTasks } = useContext(TaskFilterContext);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch(`/api/lists`);

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setLists(data);
        console.log("lists", data);
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
        console.log("tags", data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTags();
  }, []);

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

  const handleFilterByList = (listId) => {
    setSelectedListId(listId);
    const filtered = tasks.filter((task) => task.list === listId);
    setFilteredTasks(filtered);
  };

  const handleFilterByTag = (tagId) => {
    setSelectedTagId(tagId);
    const filtered = tasks.filter((task) => task.tag === tagId);
    setFilteredTasks(filtered);
  };

  const handleFilterUpcoming = () => {
    const filtered = tasks.filter((task) => task.status === false);
    setFilteredTasks(filtered);
  };

  const handleFilterDone = () => {
    const filtered = tasks.filter((task) => task.status === true);
    setFilteredTasks(filtered);
  };

  const handleDeleteList = async (listId) => {
    const confirmed = window.confirm("Are you sure you want to delete?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/lists/${listId}`, { method: "DELETE" });

      if (res.status === 200) {
        const updatedLists = lists.filter((list) => list._id !== listId);

        setLists(updatedLists);
        toast.success("List Deleted");
      } else {
        toast.error("Failed to delete list");
      }
    } catch (error) {
      console.log(listId);
      console.log(error);
      toast.error("Failed to delete list");
    }
  };

  const handleDeleteTag = async (tagId) => {
    const confirmed = window.confirm("Are you sure you want to delete?");

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tags/${tagId}`, { method: "DELETE" });

      if (res.status === 200) {
        const updatedTags = tags.filter((tag) => tag._id !== tagId);

        setTags(updatedTags);
        toast.success("Tag Deleted");
      } else {
        toast.error("Failed to delete tag");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete tag");
    }
  };

  const handleEditTagClick = (id) => {
    console.log("id", id);
    setSelectedTagId(id);
    console.log("selected", selectedTagId);
    setShowTagEditForm(!showTagEditForm);
  };

  const handleEditListClick = (id) => {
    console.log("id", id);
    setSelectedListId(id);
    console.log("selected", selectedListId);
    setShowListEditForm(!showListEditForm);
  };

  return (
    <div
      className={`bg-stone-200 w-64 p-3 rounded-lg h-screen divide-y-2 flex flex-col gap-4 overflow-y-auto ${styles.scrollbar}`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-semibold tracking-wide">Menu</span>

        {openSidebar && (
          <button className="sm:hidden" onClick={() => setOpenSidebar(false)}>
            <GrMenu />
          </button>
        )}

        {!openSidebar && (
          <button className="sm:hidden" onClick={() => setOpenSidebar(true)}>
            <RiCloseLargeLine />
          </button>
        )}
      </div>

      <SearchForm />

      <ul className="flex flex-col gap-2">
        <span className="text-xs font-bold">TASKS</span>

        <li className="flex items-center justify-between">
          <button
            onClick={() => handleFilterUpcoming()}
            className="flex items-center justify-start gap-2"
          >
            <MdKeyboardDoubleArrowRight />
            <span>Upcoming</span>
          </button>
          <span className="bg-gray-400 text-xs px-[0.4rem] rounded-sm">
            {tasks.filter((task) => task.status === false).length}
          </span>
        </li>

        <li className="flex items-center justify-between">
          <button
            onClick={() => handleFilterDone()}
            className="flex items-center justify-start gap-2"
          >
            <MdDoneAll />
            <span>Done</span>
          </button>
          <span className="bg-gray-400 text-xs px-[0.4rem] rounded-sm">
            {tasks.filter((task) => task.status === true).length}
          </span>
        </li>

        <li className="flex items-center justify-between">
          <div className="flex items-center justify-start gap-2">
            <MdOutlineDateRange />
            <Link href="/">Calender</Link>
          </div>
        </li>
      </ul>

      <ul className={`flex flex-col gap-2`}>
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center justify-start gap-2"
        >
          {!showList && <IoChevronDown />}
          {showList && <IoIosArrowUp />}
          <span className="text-xs font-bold">LISTS</span>
        </button>

        {showList &&
          lists.map((list, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center justify-start gap-2">
                <div
                  style={{ backgroundColor: list.color }}
                  className="p-[0.4rem] rounded-sm"
                ></div>
                <button onClick={() => handleFilterByList(list._id)}>
                  {list.name}
                </button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEditListClick(list._id)}>
                  <GrFormEdit />
                </button>
                <button onClick={() => handleDeleteList(list._id)}>
                  <MdOutlineDeleteOutline />
                </button>
                <span className="bg-gray-400 text-xs px-[0.4rem] rounded-sm">
                  {tasks.filter((task) => task.list === list._id).length}
                </span>
              </div>
            </li>
          ))}

        <button
          className="flex items-center gap-2"
          onClick={() => setShowListForm(!showListForm)}
        >
          <MdAdd />
          <span>Add New List</span>
        </button>
      </ul>

      <ul className={`flex flex-col gap-2`}>
        <button
          onClick={() => setShowTag(!showTag)}
          className="flex items-center justify-start gap-2"
        >
          {!showTag && <IoChevronDown />}
          {showTag && <IoIosArrowUp />}
          <span className="text-xs font-bold">TAGS</span>
        </button>

        {showTag &&
          tags.map((tag, i) => (
            <li key={i} className="flex items-center justify-between">
              <div className="flex items-center justify-start gap-2">
                <div
                  style={{ backgroundColor: tag.color }}
                  className="p-[0.4rem] rounded-sm"
                ></div>
                <button onClick={() => handleFilterByTag(tag._id)}>
                  {tag.name}
                </button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEditTagClick(tag._id)}>
                  <GrFormEdit />
                </button>
                <button onClick={() => handleDeleteTag(tag._id)}>
                  <MdOutlineDeleteOutline />
                </button>
                <span className="bg-gray-400 text-xs px-[0.4rem] rounded-sm">
                  {tasks.filter((task) => task.tag === tag._id).length}
                </span>
              </div>
            </li>
          ))}

        <button
          className="flex items-center gap-2"
          onClick={() => setShowTagForm(!showTagForm)}
        >
          <MdAdd />
          <span>Add Tag</span>
        </button>
      </ul>

      <div>
        <Link href="/">Sign Out</Link>
      </div>

      {showListForm && (
        <ListForm
          showListForm={showListForm}
          setShowListForm={setShowListForm}
        />
      )}

      {showListEditForm && (
        <ListEditForm
          showListEditForm={showListEditForm}
          setShowListEditForm={setShowListEditForm}
          id={selectedListId}
        />
      )}
      {showTagForm && (
        <TagForm showTagForm={showTagForm} setShowTagForm={setShowTagForm} />
      )}

      {showTagEditForm && (
        <TagEditForm
          showTagEditForm={showTagEditForm}
          setShowTagEditForm={setShowTagEditForm}
          id={selectedTagId}
        />
      )}
    </div>
  );
}

export default Sidebar;
