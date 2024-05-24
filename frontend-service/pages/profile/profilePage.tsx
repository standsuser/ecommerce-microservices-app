import { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { getUserProfile } from "@/pages/api/profileApi";

export default function PersonalInformationPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('user');
        const storedSessionId = localStorage.getItem('sessionId');
        setUserId(storedUserId);
        setSessionId(storedSessionId);

        if (storedUserId) {
            fetchUserData(storedUserId);
        }
    }, []);

    const fetchUserData = async (userId: string) => {
        try {
            const data = await getUserProfile(userId);
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center mt-20">
                    <h1 className={title()}>Personal Information</h1>
                </div>
                {userData && (
                    <div className="mt-4">
                        <p><strong>ID:</strong> {userData.id}</p>
                        <p><strong>First Name:</strong> {userData.first_name}</p>
                        <p><strong>Last Name:</strong> {userData.last_name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Company:</strong> {userData.company}</p>
                        <p><strong>Apartment:</strong> {userData.apartment}</p>
                        <p><strong>Floor:</strong> {userData.floor}</p>
                        <p><strong>Street:</strong> {userData.street}</p>
                        <p><strong>Building:</strong> {userData.building}</p>
                        <p><strong>Postal Code:</strong> {userData.postal_code}</p>
                        <p><strong>Extra Description:</strong> {userData.extra_description}</p>
                        <p><strong>City:</strong> {userData.city}</p>
                        <p><strong>Country:</strong> {userData.country}</p>
                        <p><strong>Address Label:</strong> {userData.addresslabel}</p>
                        <p><strong>State:</strong> {userData.state}</p>
                    </div>
                )}
            </section>
        </DefaultLayout>
    );
}