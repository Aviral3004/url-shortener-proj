import { Outlet } from "react-router-dom";
import Header from "@/components/header";

const AppLayout = () => {
  const currentYear: number = new Date().getFullYear();
  return (
    <div>
      <main className="min-h-screen container mx-auto p-6 sm:p-0">
        {/* Header */}
        <Header />
        {/* Body */}
        <Outlet />
      </main>

      {/* Footer */}
      <div className="p-10 text-center bg-gray-800 mt-10">
        © {currentYear} ByteLink — Turning long URLs into tiny power links ⚡
      </div>
    </div>
  );
};

export default AppLayout;
