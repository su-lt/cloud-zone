import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    clearObjectState,
    forgotPassword,
} from "../../redux/slices/auth.slice";
import { LuMailCheck } from "react-icons/lu";

// check email
const validateEmail = (paramEmail) => {
    var vValidRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (paramEmail.match(vValidRegex)) {
        return true;
    } else {
        return false;
    }
};

const ForgotPassword = () => {
    const dispatch = useDispatch();
    // redux state
    const { error, pending, completed } = useSelector((slice) => slice.auth);
    // useState
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    // validate email input
    const validateInput = (email) => {
        if (!email) {
            setErrorEmail("This field is required");
            return false;
        }
        if (!validateEmail(email)) {
            setErrorEmail("Invalid email");
            return false;
        }

        return true;
    };

    // handle input
    const handleInput = (value) => {
        setEmail(value);
        setErrorEmail("");
    };

    // handle reset button click
    const handleResetClick = () => {
        const isValid = validateInput(email);

        if (isValid) {
            dispatch(forgotPassword(email));
        }
    };

    useEffect(() => {
        return () => {
            dispatch(clearObjectState());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="md:mt-14 relative py-12 md:py-28 bg-gray-900">
            <div className="relative z-10 max-w-screen-xl mx-auto text-gray-600 sm:px-4 md:px-8">
                <div className="max-w-lg space-y-3 px-4 sm:mx-auto sm:text-center sm:px-0">
                    <h3 className="text-cyan-400 font-semibold">
                        Forgot your password?
                    </h3>
                    <p className="text-gray-300">
                        Please enter the email you use to register CloudZone.
                    </p>
                </div>
                <div className="mt-4 md:mt-12 mx-auto px-4 p-8 bg-white sm:max-w-lg sm:px-8 sm:rounded-xl dark:bg-transparent md:dark:bg-dark dark:text-custom-1000">
                    {error && (
                        <div className="p-3 text-center bg-red-200 dark:text-primary">
                            {error}
                        </div>
                    )}

                    {completed ? (
                        <div className="p-3 w-full text-center bg-blue-50 dark:text-primary">
                            <div className="flex gap-2 justify-center items-center ">
                                <LuMailCheck
                                    className="text-green-500"
                                    size={40}
                                />
                                <div>
                                    Please check your email to reset password
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="space-y-5"
                        >
                            <div className="mt-2 flex flex-col">
                                <label className="font-medium">Email</label>
                                <input
                                    type="text"
                                    className={`w-full mt-2 px-3 py-2 text-gray-500 dark:text-custom-1000 bg-transparent outline-none border focus:border-gray-800 shadow-sm rounded-md  ${
                                        errorEmail && "border-red-400"
                                    }`}
                                    onChange={(e) =>
                                        handleInput(e.target.value)
                                    }
                                />
                                {errorEmail && (
                                    <span className="text-xs text-red-500">
                                        * {errorEmail}
                                    </span>
                                )}
                            </div>
                            <button
                                className="w-full button-primary"
                                onClick={handleResetClick}
                            >
                                {pending ? (
                                    <div className="w-full flex gap-2 justify-center items-center">
                                        <svg
                                            aria-hidden="true"
                                            className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    "Forgot password"
                                )}
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

export default ForgotPassword;
