'use client';

import { useRouter } from 'next/navigation';

function ButtonLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (res.ok) {
      router.push('/login');
    } else {
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

export default ButtonLogout;