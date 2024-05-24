import React, { useState, useEffect } from 'react';
import { Link } from '@nextui-org/link';
import { button as buttonStyles, user } from '@nextui-org/theme';
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


const changePasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [oldPassword, setoldPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [changePasswordSuccess, setchangePasswordSuccess] = useState(false);

  useEffect(() => {
    const sessionIdFromStorage = localStorage.getItem('sessionId');
    if (sessionIdFromStorage) {
      setSessionId(sessionIdFromStorage);
    }
  }, []);

  const handlechangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !newPassword || !oldPassword) {
      setError('Please enter your email , old password and new password');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3080/auth/updatePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword , oldPassword }),
        credentials: 'include',
      });

      console.log(response);

      const data: updatePasswordResponse = await response.json(); 

      console.log(data);

      if (data.success) {
        setchangePasswordSuccess(true);
        console.log(data);

        
        setTimeout(() => {
          // Redirect to the dashboard
          router.push('/docs'); // Use client-side routing
        }, 1000); // Pause for 1 second
      } else {
        setError('Invalid email or oldPassword or newPassword');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="max-w-lg text-center">
          <form onSubmit={handlechangePassword} className="mt-4">
            <label className="block mt-12">
              <Input
                className="max-w-md"
                type="email"
                label="Email :"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="bordered"
                placeholder="Enter your email"
                defaultValue="email@gmail.com"
              />
            </label>
            <label className="block mt-4">
              <Input
                className="max-w-md"
                type="old password"
                label="Old Password : "
                value={oldPassword}
                onChange={(e) => setoldPassword(e.target.value)}
                variant="bordered"
                placeholder="Enter your Old Password"
              />
            </label>
            <label className="block mt-4">
              <Input
                className="max-w-md"
                type="new password"
                label="New Password : "
                value={newPassword}
                onChange={(e) => setnewPassword(e.target.value)}
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
              {loading ? 'Changing Password...' : 'change password'}
            </button>
          </form>
        </div>

        {/* <div className="flex gap-2 mt-12">
          <Link
            href="/register" // Use client-side routing
            className={buttonStyles({
              color: 'primary',
              radius: 'full',
              variant: 'shadow',
            })}
          >
            New to the platform? Register
          </Link>
        </div> */}
      </section>
    </DefaultLayout>
  );
};

export default changePasswordPage;