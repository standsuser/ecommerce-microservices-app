import React, { useState, useEffect } from 'react';
import { Link } from '@nextui-org/link';
import { button as buttonStyles, user } from '@nextui-org/theme';
import DefaultLayout from '@/layouts/default';
import { Input } from "@nextui-org/react";
import router from 'next/router';
import { setUser, setVer } from '@/auth';

interface LoginResponse {
  success: boolean;
  response: {
    access_token: string;
    expires_in: number;
    userID: string;
  };
  session: {
    userID: string;
    access_token: string;
    createdAt: string;
    isGuest: boolean;
    _id: string;
    __v: number;
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sessionIdFromStorage = localStorage.getItem('sessionId');
    if (sessionIdFromStorage) {
      setSessionId(sessionIdFromStorage);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data: LoginResponse = await response.json();

      if (data.success) {
        setLoginSuccess(true);
        setVer(true);
        setUser(data.response.userID);
        console.log(data);
        localStorage.setItem('user', data.response.userID);

        if (sessionId) {
          await convertGuestToUser(data.response.userID, sessionId);
        }

        setTimeout(() => {
          // Redirect to the dashboard
          router.push('/'); // Use client-side routing
        }, 1000); // Pause for 1 second
      } else {
        setError('Invalid email or password');
        setVer(false);
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const convertGuestToUser = async (userId: string, sessionId: string) => {
    try {
      const response = await fetch('http://localhost:3015/cart/convert-guest-to-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert guest to user');
      }
    } catch (error) {
      console.error('Error converting guest to user:', error);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="max-w-lg text-center">
          <form onSubmit={handleLogin} className="mt-4">
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
                type="password"
                label="Password : "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="bordered"
                placeholder="Enter your Password"
              />
            </label>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {loginSuccess && <p className="text-green-500 mt-4">Login successful!</p>}
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
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        <div className="flex gap-2 mt-12">
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
        </div>
      </section>
    </DefaultLayout>
  );
};

export default LoginPage;