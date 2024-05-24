import React, { useState, useEffect } from 'react';
import { Link } from '@nextui-org/link';
import { button as buttonStyles } from '@nextui-org/theme';
import DefaultLayout from '@/layouts/default';
import { Input } from "@nextui-org/react";
import router from 'next/router';

interface updatePasswordResponse {
  success: boolean;
  response: {
    email: string;
    newPassword: string;
    oldPassword: string;
  };
}

const ChangePasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Add loading state for authentication

  useEffect(() => {
    const storedUserId = localStorage.getItem('user');
    if (!storedUserId) {
      alert('You need to login first');
      router.push('/login');
    } else {
      const sessionIdFromStorage = localStorage.getItem('sessionId');
      if (sessionIdFromStorage) {
        setSessionId(sessionIdFromStorage);
      }
      setAuthLoading(false); // Set loading to false after authentication check
    }
  }, [router]);

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !newPassword || !oldPassword) {
      setError('Please enter your email, old password, and new password');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3080/auth/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword, oldPassword }),
        credentials: 'include',
      });

      const data: updatePasswordResponse = await response.json();

      if (data.success) {
        setChangePasswordSuccess(true);
        setTimeout(() => {
          // Redirect to the dashboard
          router.push('/docs'); // Use client-side routing
        }, 1000); // Pause for 1 second
      } else {
        setError('Invalid email, old password, or new password');
      }
    } catch (error) {
      setError('An error occurred during password change');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div>Loading...</div>; // Show a loading message while checking authentication
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="max-w-lg text-center">
          <form onSubmit={handleChangePassword} className="mt-4">
            <label className="block mt-12">
              <Input
                className="max-w-md"
                type="email"
                label="Email :"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="bordered"
                placeholder="Enter your email"
              />
            </label>
            <label className="block mt-4">
              <Input
                className="max-w-md"
                type="password"
                label="Old Password : "
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                variant="bordered"
                placeholder="Enter your Old Password"
              />
            </label>
            <label className="block mt-4">
              <Input
                className="max-w-md"
                type="password"
                label="New Password : "
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="bordered"
                placeholder="Enter your New Password"
              />
            </label>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {changePasswordSuccess && <p className="text-green-500 mt-4">Password Change Successful!</p>}
            <button
              className={buttonStyles({
                color: 'primary',
                radius: 'full',
                variant: 'shadow',
              })}
              type="submit"
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ChangePasswordPage;
