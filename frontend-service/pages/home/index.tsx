import React from 'react';
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";
import CatalogPage from '../catalogPage';

const IndexPage: React.FC = () => {
    return (
        <DefaultLayout>
            <section className="flex flex-col md:flex-row items-start md:items-center justify-start gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center md:text-left justify-center md:justify-start mt-20 md:w-1/2">
                    <div>
                        <h1 className={title()}>Welcome to</h1>
                        <h1 className={title({ color: "violet" })}>Our Website</h1>
                    </div>

                    {/* <div className="flex gap-3 mt-8">
                        <Link
                            href="/login"
                            className={buttonStyles({
                                color: "primary",
                                radius: "full",
                                variant: "shadow",
                            })}
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className={buttonStyles({
                                color: "primary",
                                radius: "full",
                                variant: "shadow",
                            })}
                        >
                            Register
                        </Link>
                    </div> */}
                </div>
                <div className="md:w-1/2">
                    <CatalogPage />
                </div>
            </section>
        </DefaultLayout>
    );
};

export default IndexPage;
