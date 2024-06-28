"use client";

import { IoMdAdd } from "react-icons/io";
import { useState } from "react";
import AddNewForm from "./AddNewForm";

function AddNew() {
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className="rounded-lg shadow-md h-72 w-full p-4 flex items-center justify-center bg-amber-100">
      <button onClick={() => setOpenForm(true)} className="focus:outline-none">
        <IoMdAdd size={50} color="#78350f" className="text-4xl sm:text-5xl" />
      </button>

      {openForm && <AddNewForm openForm={openForm} setOpenForm={setOpenForm} />}
    </div>
  );
}

export default AddNew;
