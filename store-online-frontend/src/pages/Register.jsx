import React from "react";
import TitleSection from "../components/TitleSection";
import { Link } from "react-router-dom";

const Register = () => {
    return (
        <main>
            {/* title section */}
            <TitleSection
                title={"Register"}
                description={"CloudZone - Register Page"}
            />

            {/* content */}
            <div className="p-4 grid md:grid-cols-2 md:my-24 md:container">
                <div className="p-14 bg-gradient-to-r from-primary to-black flex justify-center items-center md:p-10 lg:p-20">
                    <div className="text-center text-white">
                        <h3 className="text-2xl font-bold md:text-3xl">
                            Welcome to our store
                        </h3>
                        <p className="mt-5 text-xs text-center md:text-md">
                            If you already have an account please login here
                        </p>
                        <Link to="/login">
                            <button className="button bg-white text-primary mt-8">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:p-10 lg:p-20">
                    <h3 className="text-2xl font-bold text-center md:font-medium md:text-xl">
                        Sign Up CloudZone Member
                    </h3>
                    <form className="mt-4 flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Your name"
                            className="input-outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Your email"
                            className="input-outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-outline-none"
                        />
                        <input
                            type="password"
                            placeholder="Re-password"
                            className="input-outline-none"
                        />
                        <div className="text-xs flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="checked:bg-primary "
                            />
                            I agree to the Terms of User
                        </div>
                        <div className="mt-3">
                            <button className="button w-full">SIGN UP</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Register;
