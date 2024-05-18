import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import DefaultLayout from "@/layouts/default";
import { title } from "@/components/primitives";

export default function IndexPage() {
    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-lg text-center justify-center mt-20">
                    <h1 className={title()}>Welcome to </h1>
                    <h1 className={title({ color: "violet" })}> Our Website</h1>
                </div>

                <div className="flex gap-3 mt-8">
                    <Link
                        isExternal
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
                        isExternal
                        href="/register"
                        className={buttonStyles({
                            color: "primary",
                            radius: "full",
                            variant: "shadow",
                        })}
                    >
                        Register
                    </Link>
                </div>
            </section>
        </DefaultLayout>
    );
}
