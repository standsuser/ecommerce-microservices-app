import React, { useState } from 'react';
import { Link } from '@nextui-org/link';
import { button as buttonStyles } from '@nextui-org/theme';
import DefaultLayout from '@/layouts/default';
import { Input } from '@nextui-org/react';
import router from 'next/router';

const RegisterPage: React.FC = () => {
    const [userData, setUserData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phonenumber: '',
        company: '',
        address: '',
        password: '',
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login'); // Use client-side routing
                }, 1000); // Pause for 1 second before redirecting
            } else {
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
        }
    };

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="max-w-lg text-center">
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                name="firstname"
                                value={userData.firstname}
                                onChange={handleChange}
                                variant="bordered"
                                label="First Name :"
                                placeholder="Enter your First Name"
                            />
                            <Input
                                name="lastname"
                                value={userData.lastname}
                                onChange={handleChange}
                                variant="bordered"
                                label="Last Name :"
                                placeholder="Enter your Last Name"
                            />
                        </div>
                        <Input
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            variant="bordered"
                            label="Email :"
                            placeholder="Enter your Email"
                        />
                        <Input
                            name="phonenumber"
                            value={userData.phonenumber}
                            onChange={handleChange}
                            variant="bordered"
                            label="Phone Number :"
                            placeholder="Enter your Phone Number"
                        />
                        <Input
                            name="company"
                            value={userData.company}
                            onChange={handleChange}
                            variant="bordered"
                            label="Company :"
                            placeholder="Enter your Company"
                        />
                        <Input
                            name="address"
                            value={userData.address}
                            onChange={handleChange}
                            variant="bordered"
                            label="Address :"
                            placeholder="Enter your Address"
                        />
                        <Input
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            variant="bordered"
                            label="Password :"
                            type="password"
                            placeholder="Enter your Password"
                        />
                         <button
                            className={`${buttonStyles({
                                color: 'primary',
                                radius: 'full',
                                variant: 'shadow',
                            })} mt-4`}
                            type="submit"
                        >
                            Register
                        </button>
                    </form>
                    {success && (
                        <div className="mt-4 text-green-500">Registration successful!</div>
                    )}
                </div>
            </section>
        </DefaultLayout>
    );
};

export default RegisterPage;