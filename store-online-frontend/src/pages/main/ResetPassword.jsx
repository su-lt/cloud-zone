import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearObjectState, resetPassword } from "../../redux/slices/auth.slice";
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // get params
    const { token, id, expired } = useParams();
    // redux state
    const { error, resetCompleted } = useSelector((slice) => slice.auth);
    // use state
    const [pass, setPass] = useState("");
    const [repass, setRepass] = useState("");
    const [errorPass, setErrorPass] = useState("");
    const [errorRepass, setErrorRepass] = useState("");
    const [isVisiablePassword, setIsVisiablePassword] = useState(false);

    // validate
    const validate = () => {
        let result = true;
        setErrorPass("");
        setErrorRepass("");

        // check conditions
        if (pass.trim() && repass.trim() && pass.trim() !== repass.trim()) {
            setErrorRepass("Re-password does not match.");
            result = false;
        }
        if (!pass.trim()) {
            setErrorPass("This field is required 1");
            result = false;
        }
        if (!repass.trim()) {
            setErrorRepass("This field is required 2");
            result = false;
        }

        return result;
    };

    // handle pass input
    const handlePass = (value) => {
        setPass(value);
        setErrorPass("");
    };

    // handle re-pass input
    const handleRePass = (value) => {
        setRepass(value);
        setErrorRepass("");
    };

    // handle reset password
    const handleResetPassword = () => {
        const isValid = validate();
        if (isValid) {
            dispatch(resetPassword({ id, password: pass, token }));
        }
    };

    useEffect(() => {
        if (Date.now() > expired) navigate("/404");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expired]);

    useEffect(() => {
        return () => {
            dispatch(clearObjectState());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="flex-1 md:mt-14 relative py-12 md:py-28 bg-gray-900">
            <div className="relative z-10 max-w-screen-xl mx-auto text-gray-600 sm:px-4 md:px-8">
                <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:text-center sm:px-0">
                    <h3 className="text-cyan-400 font-semibold">
                        Reset password
                    </h3>
                    <p className="text-gray-300">
                        Please choose a new password.
                    </p>
                </div>
                <div className="mt-12 mx-auto px-4 p-8 bg-white sm:max-w-lg sm:px-8 sm:rounded-xl dark:bg-transparent md:dark:bg-dark dark:text-custom-1000">
                    {error && (
                        <div className="p-3 text-center bg-red-200 dark:text-primary">
                            {error}
                        </div>
                    )}
                    {resetCompleted ? (
                        <div className="p-3 w-full text-center bg-blue-50 dark:text-primary">
                            <div className="flex gap-2 justify-center items-center ">
                                <div>
                                    Reset password successful, please re-login
                                    <Link to="/login" className="text-blue-500">
                                        {" "}
                                        HERE
                                    </Link>
                                    .
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="space-y-5"
                        >
                            <div className="mt-4 flex flex-col">
                                <label className="font-medium">
                                    New password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            isVisiablePassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="enter new password"
                                        className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-md ${
                                            errorPass && "border-red-400"
                                        }`}
                                        onChange={(e) =>
                                            handlePass(e.target.value)
                                        }
                                    />
                                    <button
                                        className="absolute right-2 top-1 translate-y-1/2"
                                        onClick={() =>
                                            setIsVisiablePassword((pre) => !pre)
                                        }
                                    >
                                        {isVisiablePassword ? (
                                            <RiEyeLine size={24} />
                                        ) : (
                                            <RiEyeCloseLine size={24} />
                                        )}
                                    </button>
                                </div>
                                {errorPass && (
                                    <span className="text-xs text-red-500">
                                        * {errorPass}
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 flex flex-col">
                                <label className="font-medium">
                                    Confim password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            isVisiablePassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="confirm password"
                                        className={`w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-md ${
                                            errorRepass && "border-red-400"
                                        }`}
                                        onChange={(e) =>
                                            handleRePass(e.target.value)
                                        }
                                    />
                                    <button
                                        className="absolute right-2 top-1 translate-y-1/2"
                                        onClick={() =>
                                            setIsVisiablePassword((pre) => !pre)
                                        }
                                    >
                                        {isVisiablePassword ? (
                                            <RiEyeLine size={24} />
                                        ) : (
                                            <RiEyeCloseLine size={24} />
                                        )}
                                    </button>
                                </div>
                                {errorRepass && (
                                    <span className="text-xs text-red-500">
                                        * {errorRepass}
                                    </span>
                                )}
                            </div>
                            <button
                                className="w-full button-primary"
                                onClick={handleResetPassword}
                            >
                                Reset Password
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <div
                className="absolute inset-0 blur-[118px] max-w-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
                style={{
                    background:
                        "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
                }}
            ></div>
        </main>
    );
};

export default ResetPassword;
