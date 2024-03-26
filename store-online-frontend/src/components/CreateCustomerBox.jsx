import { useDispatch, useSelector } from "react-redux";
import {
    checkValidation,
    clearState,
    createUserByAdmin,
    handleOnChange,
} from "../redux/slices/user.slice";

const CreateCustomerBox = ({ onClose }) => {
    const dispatch = useDispatch();
    // redux
    const { userObject, errors } = useSelector((slice) => slice.user);
    // useState
    const handleOnClose = () => {
        dispatch(clearState());
        onClose(false);
    };

    // create new customer click button
    const handleClick = () => {
        const valid = checkValidate();
        if (valid)
            dispatch(
                createUserByAdmin({
                    fullname: userObject.fullname,
                    phone: userObject.phone,
                    email: userObject.email,
                    address: userObject.address,
                })
            );
    };

    const checkValidate = () => {
        let valid = true;
        // if create new customer
        dispatch(checkValidation());
        if (userObject.fullname === "") valid = false;
        if (userObject.phone === "") valid = false;
        if (userObject.email === "") valid = false;
        if (userObject.address === "") valid = false;

        return valid;
    };

    return (
        <div className="relative my-2 p-2 text-xs bg-gray-100 rounded-md">
            {/* fullname */}
            <div className="flex gap-2 items-center">
                <div className="w-16">Name:</div>
                <div className="flex-1">
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${
                            errors.fullname && "border-red-400"
                        }`}
                        onChange={(e) =>
                            dispatch(
                                handleOnChange({
                                    field: "fullname",
                                    value: e.target.value,
                                })
                            )
                        }
                    />
                    {errors.fullname && (
                        <span className="text-xs text-red-500">
                            * {errors.fullname}
                        </span>
                    )}
                </div>
            </div>
            {/* phone */}
            <div className="flex gap-2 items-center">
                <div className="w-16">Phone:</div>
                <div className="flex-1">
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${
                            errors.phone && "border-red-400"
                        }`}
                        onChange={(e) =>
                            dispatch(
                                handleOnChange({
                                    field: "phone",
                                    value: e.target.value,
                                })
                            )
                        }
                    />
                    {errors.phone && (
                        <span className="text-xs text-red-500">
                            * {errors.phone}
                        </span>
                    )}
                </div>
            </div>
            {/* email */}
            <div className="flex gap-2 items-center">
                <div className="w-16">Email:</div>
                <div className="flex-1">
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${
                            errors.email && "border-red-400"
                        }`}
                        onChange={(e) =>
                            dispatch(
                                handleOnChange({
                                    field: "email",
                                    value: e.target.value,
                                })
                            )
                        }
                    />
                    {errors.email && (
                        <span className="text-xs text-red-500">
                            * {errors.email}
                        </span>
                    )}
                </div>
            </div>
            {/* address */}
            <div className="flex gap-2 items-center">
                <div className="w-16">Address:</div>
                <div className="flex-1">
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${
                            errors.address && "border-red-400"
                        }`}
                        onChange={(e) =>
                            dispatch(
                                handleOnChange({
                                    field: "address",
                                    value: e.target.value,
                                })
                            )
                        }
                    />
                    {errors.address && (
                        <span className="text-xs text-red-500">
                            * {errors.address}
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-2 text-right">
                <button
                    onClick={handleClick}
                    className="px-2 py-2 text-white bg-blue-500 rounded-md"
                >
                    Create New Customer
                </button>
            </div>
            {/* close button */}
            <div className="absolute -right-2 -top-2">
                <button
                    className="w-5 h-5 bg-red-200 text-white rounded-full z-10"
                    onClick={handleOnClose}
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default CreateCustomerBox;
