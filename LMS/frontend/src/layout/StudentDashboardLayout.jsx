import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <StudentSidebar />
      <main className="flex-1 bg-background p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
