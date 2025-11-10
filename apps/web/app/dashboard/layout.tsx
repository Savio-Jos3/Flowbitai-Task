import { Sidebar } from '@/src/components/layout/sidebar';
import { Header } from '@/src/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = {
    name: 'Savio Joseph Sonny',
    role: 'Admin',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-hidden pl-64">
        <Header title="Dashboard" user={user} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {/* Center the dashboard content */}
          <div className="flex justify-center p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
