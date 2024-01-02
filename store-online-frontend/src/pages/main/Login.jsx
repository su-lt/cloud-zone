import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    clearObjectState,
    handleOnChange,
    login,
} from "../../redux/slices/auth.slice";

// component
import TitleSection from "../../components/TitleSection";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loginObject, completed, errors, error } = useSelector(
        (slice) => slice.auth
    );

    const handleChange = (field, value) => {
        dispatch(handleOnChange({ field, value }));
    };

    const handleLoginClick = async () => {
        dispatch(login(loginObject));
    };

    useEffect(() => {
        if (completed) navigate("/");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completed]);

    useEffect(() => {
        return () => {
            dispatch(clearObjectState());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="flex-1">
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
                            <button className="button-outline mt-8 text-xs bg-white text-primary md:text-lg dark:bg-primary">
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
                        {error && (
                            <div className="p-3 text-center bg-red-200 dark:text-primary">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <input
                                type="text"
                                placeholder="Your email"
                                className={`input-outline-none ${
                                    errors.email && "border-red-400"
                                }`}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <span className="text-xs text-red-500">
                                    * {errors.email}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <input
                                type="password"
                                placeholder="Password"
                                className={`input-outline-none ${
                                    errors.password && "border-red-400"
                                }`}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                            />
                            {errors.password && (
                                <span className="text-xs text-red-500">
                                    * {errors.password}
                                </span>
                            )}
                        </div>
                        <Link
                            className="text-xs flex gap-2 items-center justify-end"
                            to="/forgot-password"
                        >
                            Forgot password
                        </Link>
                        <div className="mt-3">
                            <button
                                className="button-primary w-full"
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
