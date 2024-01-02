import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    clearObjectState,
    handleOnChangeRegister,
    signup,
} from "../../redux/slices/auth.slice";
import TitleSection from "../../components/TitleSection";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // state redux
    const { isLogin, registerObject, completed, errors, error, lastPage } =
        useSelector((slice) => slice.auth);

    // handle onchange input
    const handleOnChange = (field, value) => {
        dispatch(handleOnChangeRegister({ field, value }));
    };

    // handle sign up button click
    const handleSignUpClick = () => {
        dispatch(
            signup({
                fullname: registerObject.fullname,
                email: registerObject.email,
                phone: registerObject.phone,
                address: registerObject.address,
                password: registerObject.password,
            })
        );
    };

    useEffect(() => {
        if (isLogin)
            // if logged in => return home page
            navigate("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin]);

    useEffect(() => {
        if (completed)
            if (lastPage)
                // if lastPage exist return cart
                navigate(lastPage);
            else navigate("/");
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
                title={"Register"}
                description={"CloudZone - Register Page"}
            />

            {/* content */}
            <div className="p-4 grid md:grid-cols-2 md:py-12 md:container">
                <div className="p-14 bg-gradient-to-r from-primary to-black flex justify-center items-center md:p-10 lg:p-20">
                    <div className="text-center text-white">
                        <h3 className="text-2xl font-bold md:text-3xl">
                            Welcome to our store
                        </h3>
                        <p className="mt-5 text-xs text-center md:text-md">
                            If you already have an account please login here
                        </p>
                        <Link to="/login">
                            <button className="button-outline bg-white text-primary mt-8 dark:bg-dark">
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="mt-5 md:mt-0 md:p-10 lg:p-20">
                    <h3 className="text-2xl font-bold text-center md:font-medium md:text-xl">
                        Sign Up CloudZone Member
                    </h3>
                    <div className="mt-4 flex flex-col gap-2">
                        {error && (
                            <div className="p-3 text-center bg-red-200">
                                {error}
                            </div>
                        )}
                        {/* fullname */}
                        <input
                            onChange={(e) =>
                                handleOnChange("fullname", e.target.value)
                            }
                            type="text"
                            placeholder="Your name"
                            className={`input-outline-none ${
                                errors.fullname && "border-red-400"
                            }`}
                        />
                        {errors.fullname && (
                            <span className="text-xs text-red-500">
                                * {errors.fullname}
                            </span>
                        )}
                        {/* email */}
                        <input
                            onChange={(e) =>
                                handleOnChange("email", e.target.value)
                            }
                            type="text"
                            placeholder="Email"
                            className={`input-outline-none ${
                                errors.email && "border-red-400"
                            }`}
                        />
                        {errors.email && (
                            <span className="text-xs text-red-500">
                                * {errors.email}
                            </span>
                        )}
                        {/* phone */}
                        <input
                            onChange={(e) =>
                                handleOnChange("phone", e.target.value)
                            }
                            type="number"
                            placeholder="Phone"
                            className={`input-outline-none appearance-none ${
                                errors.phone && "border-red-400"
                            }`}
                        />
                        {errors.phone && (
                            <span className="text-xs text-red-500">
                                * {errors.phone}
                            </span>
                        )}
                        {/* address */}
                        <input
                            onChange={(e) =>
                                handleOnChange("address", e.target.value)
                            }
                            type="text"
                            placeholder="address"
                            className={`input-outline-none ${
                                errors.address && "border-red-400"
                            }`}
                        />
                        {errors.address && (
                            <span className="text-xs text-red-500">
                                * {errors.address}
                            </span>
                        )}
                        {/* password */}
                        <input
                            onChange={(e) =>
                                handleOnChange("password", e.target.value)
                            }
                            type="password"
                            placeholder="Password"
                            className={`input-outline-none ${
                                errors.password && "border-red-400"
                            }`}
                        />
                        {errors.password && (
                            <span className="text-xs text-red-500">
                                * {errors.password}
                            </span>
                        )}
                        {/* re-password */}
                        <input
                            onChange={(e) =>
                                handleOnChange("repass", e.target.value)
                            }
                            type="password"
                            placeholder="re-password"
                            className={`input-outline-none ${
                                errors.repass && "border-red-400"
                            }`}
                        />
                        {errors.repass && (
                            <span className="text-xs text-red-500">
                                * {errors.repass}
                            </span>
                        )}

                        <div className="text-xs flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="checked:bg-primary "
                            />
                            I agree to the Terms of User
                        </div>
                        <div className="mt-3">
                            <button
                                className="button-primary w-full"
                                onClick={handleSignUpClick}
                            >
                                SIGN UP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Register;
