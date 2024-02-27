'use client';

import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import InputField from '../components/ui/Input';

export default function Profile() {
  const router = useRouter();

  // get and save user id
  const [user, setUser] = useState({
    username: '',
    email: '',
    bio: '',
  });
  useEffect(() => {
    const getUserDetails = async () => {
      const response = await axios.get('/api/users/me');
      setUser(response.data.user);
    };
    getUserDetails();
  }, []);

  const [password, setPassword] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  // logout function
  const onLogout = async () => {
    toast.dismiss();
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

  // functions to submit the forms
  const onUsernameChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss();
    try {
      const response = await axios.put('api/users/update', {
        username: user.username,
      });
      if (response.status === 200) {
        toast.success('Username updated!');
        setUser({ ...user, username: '' });
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

  const onEmailChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss();
    try {
      const response = await axios.put('api/users/update', {
        email: user.email,
      });
      if (response.status === 200) {
        toast.success('Email updated!');
        setUser({ ...user, email: '' });
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

  const onBioChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss();
    try {
      const response = await axios.put('api/users/update', {
        bio: user.bio,
      });
      if (response.status === 200) {
        toast.success('Bio updated!');
        setUser({ ...user, bio: '' });
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

  const onPasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.dismiss();
    if (password.newPassword !== password.confirmPassword) {
      return toast.error("Passwords don't match");
    }
    try {
      const response = await axios.put('api/users/update', {
        password: password.newPassword,
      });
      if (response.status === 200) {
        toast.success('Password updated!');
        setPassword({ newPassword: '', confirmPassword: '' });
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

  // functions to handle the inputs
  const handleOnChangeUsername = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUser({
      ...user,
      username: event.target.value,
    });
  };

  const handleOnChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      email: event.target.value,
    });
  };

  const handleOnChangeBio = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setUser({
      ...user,
      bio: target.value,
    });
  };

  const handleOnChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword({
      ...password,
      newPassword: event.target.value,
    });
  };

  const handleOnChangeConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword({
      ...password,
      confirmPassword: event.target.value,
    });
  };

  return (
    <main className=" flex h-screen flex-col items-center justify-center">
      <Toaster />
      <h1 className="mb-10 p-4 text-2xl">
        User Profile: {user ? `${user.username}` : 'Not found'}
      </h1>
      <form
        className="flex flex-col items-center justify-center gap-6"
        onSubmit={onUsernameChange}
      >
        <label className="flex flex-col" htmlFor="username">
          Username:
          <InputField
            id="username"
            type="text"
            min={3}
            max={32}
            value={user.username}
            placeholder="Your username"
            onChange={handleOnChangeUsername}
            required={true}
          />
        </label>
      </form>
      <form
        className="flex flex-col items-center justify-center gap-6"
        onSubmit={onEmailChange}
      >
        <label className="flex flex-col" htmlFor="email">
          UsernEmailame:
          <InputField
            id="email"
            type="text"
            min={4}
            max={254}
            value={user.email}
            placeholder="Your email"
            onChange={handleOnChangeEmail}
            required={true}
          />
        </label>
      </form>
      <form
        className="flex flex-col items-center justify-center gap-6"
        onSubmit={onBioChange}
      >
        <label className="flex flex-col" htmlFor="bio">
          Bio:
          <textarea
            className="resize-none"
            id="bio"
            name="bio"
            minLength={1}
            maxLength={320}
            value={user.bio}
            placeholder="Your bio"
            onChange={handleOnChangeBio}
          >
            {user.bio}
          </textarea>
        </label>
      </form>
      <form
        className="flex flex-col items-center justify-center gap-6"
        onSubmit={onPasswordChange}
      >
        <label className="flex flex-col" htmlFor="password">
          Password:
          <InputField
            id="password"
            type="password"
            min={6}
            max={256}
            value={password.newPassword}
            placeholder="Your password"
            onChange={handleOnChangePassword}
            required={true}
          />
        </label>
        <label className="flex flex-col" htmlFor="confirmPassword">
          Confirm password:
          <InputField
            id="confirmPassword"
            type="password"
            min={6}
            max={256}
            value={password.confirmPassword}
            placeholder="Your password"
            onChange={handleOnChangeConfirmPassword}
            required={true}
          />
        </label>
      </form>
      <button
        onClick={onLogout}
        className="flex h-9 w-20 items-center justify-center rounded-md border border-white bg-black p-4 text-sm text-white hover:bg-white hover:text-black active:translate-y-1"
      >
        Logout
      </button>
    </main>
  );
}
