import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/layouts/default';
import { Input } from "@nextui-org/react";
import { useRouter } from 'next/router';

interface Profile {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = React.useState(null);
  const [formData, setFormData] = useState<Profile>({ first_name: '', last_name: '', phone_number: '', email: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null); // Reset error state before new request

      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userID');
        
        if (!token || !userId) {
          setError('User not logged in');
          return;
        }

        const response = await fetch(`http://localhost:3003/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } catch (error) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state before new request

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userID');
      
      if (!token || !userId) {
        setError('User not logged in');
        return;
      }

      const response = await fetch(`http://localhost:3003/user/editProfile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setProfile(data);
      setEditMode(false);
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10">
        <div className="max-w-lg text-center">
          {editMode ? (
            <form onSubmit={handleFormSubmit} className="mt-4">
              <label className="block mt-12">
                <Input
                  className="max-w-md"
                  type="text"
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  variant="bordered"
                  placeholder="First Name"
                />
              </label>
              <label className="block mt-4">
                <Input
                  className="max-w-md"
                  type="text"
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  variant="bordered"
                  placeholder="Last Name"
                />
              </label>
              <label className="block mt-4">
                <Input
                  className="max-w-md"
                  type="text"
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  variant="bordered"
                  placeholder="Phone Number"
                />
              </label>
              <label className="block mt-4">
                <Input
                  className="max-w-md"
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="bordered"
                  placeholder="Email"
                />
              </label>
              <button
                className="btn btn-primary mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                className="btn btn-secondary mt-4"
                type="button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p className="mt-4"><strong>First Name:</strong> {profile?.first_name}</p>
              <p className="mt-4"><strong>Last Name:</strong> {profile?.last_name}</p>
              <p className="mt-4"><strong>Phone Number:</strong> {profile?.phone_number}</p>
              <p className="mt-4"><strong>Email:</strong> {profile?.email}</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ProfilePage;
