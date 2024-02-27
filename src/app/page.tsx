'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  email: string;
  password?: string;
  role: string;
}

export default function Profile() {
  const router = useRouter();

  // get and save user id
  const [user, setUser] = useState<User>();
  useEffect(() => {
    const getUserDetails = async () => {
      const response = await axios.get('/api/users/me');
      setUser(response.data.user);
    };
    getUserDetails();
  }, []);

  // logout function
  const onLogout = async () => {
    try {
      const response = await axios.get('api/users/logout');
      if (response.status === 200) {
        toast.success('Logged out!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data.error || 'An error occured. Please try again.';
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <main className=" flex h-screen flex-col items-center justify-center">
      <Toaster />
      <h1 className="mb-10 p-4 text-2xl">
        User Profile: {user ? `${user.username}` : 'Not found'}
      </h1>
      <button
        onClick={onLogout}
        className="flex h-9 w-20 items-center justify-center rounded-md border border-white bg-black p-4 text-sm text-white hover:bg-white hover:text-black active:translate-y-1"
      >
        Logout
      </button>
    </main>
  );
}
