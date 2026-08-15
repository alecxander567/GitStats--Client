// components/layout/DashboardLayout.jsx
import React from "react";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark to-darkest">
      <Sidebar />
      <div className="md:ml-64 px-4 sm:px-6 md:px-8 py-4 md:py-8">
        {children}
      </div>
    </div>
  );
};
