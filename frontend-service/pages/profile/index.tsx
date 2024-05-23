import { useState } from "react";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import { Input } from "@nextui-org/input";

export default function PersonalInformationPage() {
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleEditMode = () => {
        setIsEditable(!isEditable);
    };

    const handleSave = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        // Add form submission logic here
        console.log("Form data saved:", formData);
        setIsEditable(false);
    };

    const handleCancel = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        // Reset the form data or handle the cancel action
        console.log("Edit canceled");
        setIsEditable(false);
    };

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center mt-20">
                    <h1 className={title()}>Personal Information</h1>
                </div>

                <form className="flex flex-col gap-4 mt-8 w-full max-w-md">
                    <Input
                        fullWidth
                        isClearable
                        placeholder="First Name"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                        className="w-full"
                    />
                    <Input
                        fullWidth
                        isClearable
                        placeholder="Last Name"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                        className="w-full"
                    />
                    <Input
                        fullWidth
                        isClearable
                        placeholder="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                        className="w-full"
                    />
                    <Input
                        fullWidth
                        isClearable
                        placeholder="Phone Number"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                        className="w-full"
                    />
                    <Input
                        fullWidth
                        isClearable
                        placeholder="Address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                        className="w-full"
                    />

                    <div className="flex gap-3 mt-8">
                        {isEditable ? (
                            <>
                                <Link
                                    href="#"
                                    className={buttonStyles({
                                        color: "primary",
                                        radius: "full",
                                        variant: "shadow",
                                    })}
                                    onClick={handleSave}
                                >
                                    Save
                                </Link>
                                <Link
                                    href="#"
                                    className={buttonStyles({
                                        color: "secondary",
                                        radius: "full",
                                        variant: "shadow",
                                    })}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="#"
                                className={buttonStyles({
                                    color: "primary",
                                    radius: "full",
                                    variant: "shadow",
                                })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    toggleEditMode();
                                }}
                            >
                                Edit
                            </Link>
                        )}
                    </div>
                </form>
            </section>
        </DefaultLayout>
    );
}