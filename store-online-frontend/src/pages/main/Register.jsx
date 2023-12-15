import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../helpers/axiosApi";
import { authSlice } from "../../redux/slices/auth.slice";
import TitleSection from "../../components/TitleSection";

const Register = () => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const [passwordValidate, setPasswordValidate] = useState(false);
    const [signUpError, setSignUpError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSignUpClick = async () => {
        if (password === repassword) {
            const { error, username } = await signup(fullname, email, password);
            if (error) setSignUpError(error);
            else {
                dispatch(authSlice.actions.login(username));
                navigate("/");
            }
        } else setPasswordValidate(true);
    };
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
                    <div className="mt-4 flex flex-col gap-2">
                        {signUpError && (
                            <div className="p-3 text-center bg-red-200">
                                {signUpError}
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Your name"
                            className="input-outline-none"
                            onChange={(e) => setFullname(e.target.value)}
                        />
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

                        <input
                            type="password"
                            placeholder="Re-password"
                            className={`input-outline-none ${
                                passwordValidate ? "    border-red-400" : ""
                            }`}
                            onChange={(e) => setRepassword(e.target.value)}
                        />
                        {passwordValidate && (
                            <span className="text-red-400 text-xs py-2">
                                password not match
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
                                className="button w-full"
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
