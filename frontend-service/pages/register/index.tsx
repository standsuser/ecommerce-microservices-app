import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { button as buttonStyles } from '@nextui-org/theme';
import DefaultLayout from '@/layouts/default';
import { Input } from '@nextui-org/react';

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phonenumber: '',
        company: '',
        address: {
            apartment: '',
            floor: 0,
            street: '',
            building: '',
            postal_code: 0,
            extra_description: '',
            city: '',
            country: '',
            addresslabel: '',
            state: '',
        },
        password: '',
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setUserData({
                ...userData,
                address: {
                    ...userData.address,
                    [addressField]: value,
                },
            });
        } else {
            setUserData({ ...userData, [name]: value });
        }
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
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="first_name"
                                value={userData.first_name}
                                onChange={handleChange}
                                variant="bordered"
                                label="First Name :"
                                placeholder="Enter your First Name"
                            />
                            <Input
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange}
                                variant="bordered"
                                label="Last Name :"
                                placeholder="Enter your Last Name"
                            />
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
                                name="address.apartment"
                                value={userData.address.apartment}
                                onChange={handleChange}
                                variant="bordered"
                                label="Apartment :"
                                placeholder="Enter your Apartment"
                            />
                            <Input
                                name="address.floor"
                                value={userData.address.floor.toString()}
                                onChange={handleChange}
                                variant="bordered"
                                label="Floor :"
                                placeholder="Enter your Floor"
                                type="number"
                            />
                            <Input
                                name="address.street"
                                value={userData.address.street}
                                onChange={handleChange}
                                variant="bordered"
                                label="Street :"
                                placeholder="Enter your Street"
                            />
                            <Input
                                name="address.building"
                                value={userData.address.building}
                                onChange={handleChange}
                                variant="bordered"
                                label="Building :"
                                placeholder="Enter your Building"
                            />
                            <Input
                                name="address.postal_code"
                                value={userData.address.postal_code.toString()}
                                onChange={handleChange}
                                variant="bordered"
                                label="Postal Code :"
                                placeholder="Enter your Postal Code"
                                type="number"
                            />
                            <Input
                                name="address.extra_description"
                                value={userData.address.extra_description}
                                onChange={handleChange}
                                variant="bordered"
                                label="Extra Description :"
                                placeholder="Enter your Extra Description"
                            />
                            <Input
                                name="address.city"
                                value={userData.address.city}
                                onChange={handleChange}
                                variant="bordered"
                                label="City :"
                                placeholder="Enter your City"
                            />
                            <Input
                                name="address.country"
                                value={userData.address.country}
                                onChange={handleChange}
                                variant="bordered"
                                label="Country :"
                                placeholder="Enter your Country"
                            />
                            <Input
                                name="address.addresslabel"
                                value={userData.address.addresslabel}
                                onChange={handleChange}
                                variant="bordered"
                                label="Address Label :"
                                placeholder="Enter your Address Label"
                            />
                            <Input
                                name="address.state"
                                value={userData.address.state}
                                onChange={handleChange}
                                variant="bordered"
                                label="State :"
                                placeholder="Enter your State"
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
                        </div>
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
