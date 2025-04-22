import ButtonLogout from '@/components/ButtonLogout';

export default function DashboardPage() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1>Welcome to your Dashboard!</h1>
      
      {/* Using the reusable LogoutButton component */}
      <ButtonLogout />
    </div>
  );
}