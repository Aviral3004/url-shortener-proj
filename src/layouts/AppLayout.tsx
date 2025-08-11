import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const currentYear: number = new Date().getFullYear();
  return (
    <div>
      <main className="min-h-screen container">
        {/* Header */}
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
