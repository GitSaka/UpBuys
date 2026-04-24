import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans md:overflow-visible overflow-x-hidden">
      
      {/* SIDEBAR */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* OVERLAY MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-6">

        {/* HEADER */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
