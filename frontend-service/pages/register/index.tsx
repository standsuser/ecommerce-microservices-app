import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from '@/layouts/default';
import { Input } from '@nextui-org/react';
import { button } from '@nextui-org/react';

const RegisterPage: React.FC = () => {
    const router = useRouter();
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phonenumber: '',
        company: '',
        apartment: '',
        floor: '',
        street: '',
        building: '',
        postal_code: '',
        extra_description: '',
        city: '',
        country: '',
        addresslabel: '',
        state: '',
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
            const response = await fetch('http://localhost:3080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });


            
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                //    router.push('/login'); // Use client-side routing
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
                                isRequired
                            />
                            <Input
                                name="last_name"
                                value={userData.last_name}
                                onChange={handleChange}
                                variant="bordered"
                                label="Last Name :"
                                placeholder="Enter your Last Name"
                                isRequired
                            />
                            <Input
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                variant="bordered"
                                label="Email :"
                                placeholder="Enter your Email"
                                isRequired
                            />
                            <Input
                                name="phonenumber"
                                value={userData.phonenumber}
                                onChange={handleChange}
                                variant="bordered"
                                label="Phone Number :"
                                placeholder="Enter your Phone Number"
                                isRequired
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
                                name="apartment"
                                value={userData.apartment}
                                onChange={handleChange}
                                variant="bordered"
                                label="Apartment :"
                                placeholder="Enter your Apartment"
                            />
                            <Input
                                name="floor"
                                value={userData.floor}
                                onChange={handleChange}
                                variant="bordered"
                                label="Floor :"
                                placeholder="Enter your Floor"
                                type="number"
                            />
                            <Input
                                name="street"
                                value={userData.street}
                                onChange={handleChange}
                                variant="bordered"
                                label="Street :"
                                placeholder="Enter your Street"
                            />
                            <Input
                                name="building"
                                value={userData.building}
                                onChange={handleChange}
                                variant="bordered"
                                label="Building :"
                                placeholder="Enter your Building"
                            />
                            <Input
                                name="postal_code"
                                value={userData.postal_code}
                                onChange={handleChange}
                                variant="bordered"
                                label="Postal Code :"
                                placeholder="Enter your Postal Code"
                                type="number"
                            />
                            <Input
                                name="extra_description"
                                value={userData.extra_description}
                                onChange={handleChange}
                                variant="bordered"
                                label="Extra Description :"
                                placeholder="Enter your Extra Description"
                            />
                            <Input
                                name="city"
                                value={userData.city}
                                onChange={handleChange}
                                variant="bordered"
                                label="City :"
                                placeholder="Enter your City"

                            />
                            <Input
                                name="country"
                                value={userData.country}
                                onChange={handleChange}
                                variant="bordered"
                                label="Country :"
                                placeholder="Enter your Country"
                                
                            />
                            <Input
                                name="addresslabel"
                                value={userData.addresslabel}
                                onChange={handleChange}
                                variant="bordered"
                                label="Address Label :"
                                placeholder="Enter your Address Label"
                                isRequired
                            />
                            <Input
                                name="state"
                                value={userData.state}
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
                                isRequired
                            />
                        </div>
                        <button
                            className={`${button({
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
                     <div className="mt-4 text-green-500">Registration successful..Check your mail for verification</div>
                    )}
                </div>
            </section>
        </DefaultLayout>
        
    );
};

export default RegisterPage;
function setError(arg0: string) {
    throw new Error('Function not implemented.');
}

