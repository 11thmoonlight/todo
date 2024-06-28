import React, { createContext, useState, useEffect } from "react";

export const TaskFilterContext = createContext();

export const TaskFilterProvider = ({ children }) => {
  const [filteredTasks, setFilteredTasks] = useState([]);

  return (
    <TaskFilterContext.Provider value={{ filteredTasks, setFilteredTasks }}>
      {children}
    </TaskFilterContext.Provider>
  );
};
