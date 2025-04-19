'use client';

import { useRouter } from 'next/navigation';

export default function ButtonLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (res.ok) {
      // Redirect to login page after successful logout
      router.push('/login');
    } else {
      // Handle error if logout fails
      alert('Logout failed');
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="bg-red-600 text-white p-3 rounded"
    >
      Log Out
    </button>
  );
}
