import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../helpers/axiosApi";
import { useDispatch } from "react-redux";
import { authSlice } from "../../redux/slices/auth.slice";
import TitleSection from "../../components/TitleSection";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLoginClick = async () => {
        const { error, username } = await login(email, password);
        if (error) setLoginError(error);
        else {
            dispatch(authSlice.actions.login(username));
            navigate("/");
        }
    };
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
                    <div className="mt-8 flex flex-col gap-2">
                        {loginError && (
                            <div className="p-3 text-center bg-red-200">
                                {loginError}
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Your email"
                            className="input-outline-none"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-outline-none"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="text-xs flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="checked:bg-primary "
                            />
                            Remember me
                        </div>
                        <div className="mt-3">
                            <button
                                className="button w-full"
                                onClick={handleLoginClick}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Login;
