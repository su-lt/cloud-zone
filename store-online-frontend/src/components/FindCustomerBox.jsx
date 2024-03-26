import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findCustomer } from "../redux/slices/user.slice";

const FindCustomerBox = ({ selected, error }) => {
    const dispatch = useDispatch();

    const { users } = useSelector((slice) => slice.user);
    const [searchCustomer, setSearchCustomer] = useState("");
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleUserSelect = (user) => {
        selected(user);
        setSearchCustomer(user.fullname);
    };

    useEffect(() => {
        dispatch(findCustomer(searchCustomer));
        if (!searchCustomer) {
            selected(null);
            setSearchCustomer("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchCustomer]);

    return (
        <div className="flex-1 relative">
            <input
                type="text"
                className={`w-full p-2 border rounded-md ${
                    error && "border-red-400"
                }`}
                placeholder="Email/Phone"
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
            />
            {isInputFocused && users.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md">
                    {users.map((user) => (
                        <li
                            key={user._id}
                            onMouseDown={() => handleUserSelect(user)}
                            className="px-2 py-2 cursor-pointer hover:bg-gray-300"
                        >
                            <span className="text-sm">
                                {user.fullname} - {user.phone} - {user.email}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            {isInputFocused && users.length === 0 && searchCustomer !== "" && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md">
                    <li className="px-2 py-2 cursor-pointer hover:bg-gray-300">
                        <span className="text-sm">Not found</span>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default FindCustomerBox;
