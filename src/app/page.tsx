import { Header } from '@/components/layout/header';
import { MainDashboard } from '@/components/dashboard/main-dashboard';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-auto">
        <MainDashboard />
      </main>
    </div>
  );
}
