"use client";

import "@/assets/styles/globals.css";
import { AuthProvider } from "@/components/Providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@/components/Sidebar";
import { TaskFilterProvider } from "./context/TaskFilterContext";

export const metaData = {
  title: "ToDo",
  description: "Make yor feauture",
  keywords: "todo, plan, planning",
};

function Layout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className="pt-3 px-3 bg-stone-50">
          <TaskFilterProvider>
            <div className="flex gap-4">
              <Sidebar />
              <main>
                <AuthProvider>{children}</AuthProvider>
              </main>
              <ToastContainer />
            </div>
          </TaskFilterProvider>
        </body>
      </html>
    </AuthProvider>
  );
}

export default Layout;
