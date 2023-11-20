import { Link } from "react-router-dom";
import TitleSection from "../components/TitleSection";

const Login = () => {
    return (
        <main>
            {/* title section */}
            <TitleSection
                title={"Login"}
                description={"CloudZone - Login Page"}
            />

            {/* content */}
            <div className="p-4 grid md:grid-cols-2 md:my-24 md:container">
                <div className="p-14 bg-gradient-to-r from-primary to-black flex justify-center items-center md:p-10 lg:p-20">
                    <div className="text-center text-white">
                        <h3 className="text-2xl font-bold md:text-3xl">
                            Hey there, you are new ?
                        </h3>
                        <p className="mt-5 text-xs text-center md:text-md">
                            There are advances being made in science and
                            technology everyday, and a good example of this is
                            the
                        </p>
                        <Link to="/register">
                            <button className="button mt-8 text-xs bg-white shadow-neon text-primary md:text-lg">
                                create an account
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:p-10 lg:p-20">
                    <h3 className="text-2xl font-bold md:font-medium md:text-xl">
                        Welcome Back ! <br />
                        Please, Login now
                    </h3>
                    <form className="mt-8 flex flex-col gap-2">
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
                        <div className="text-xs flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="checked:bg-primary "
                            />
                            Remember me
                        </div>
                        <div className="mt-3">
                            <button className="button w-full">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default Login;
