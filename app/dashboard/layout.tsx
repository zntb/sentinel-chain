import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardTopbar } from '@/components/dashboard/dashboard-topbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardTopbar />
        <div className='mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8'>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
