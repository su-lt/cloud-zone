import { useEffect, useState } from "react";
import {
    HiCloud,
    HiOutlineLogout,
    HiOutlineArrowCircleLeft,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { routes_dashboard } from "../../../routes";
import { Link, useLocation } from "react-router-dom";
import { setSearchString } from "../../../redux/slices/filter.slice";
import { clearAuthState, logout } from "../../../redux/slices/auth.slice";

const Sidebar = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const [open, setOpen] = useState(false);
    // close menu toggle if menu toggle open and resize
    const handlerCloseSidebar = () => {
        if (window.innerWidth < 1440 && open) setOpen(() => false);
    };

    //handle logout
    const handleLogout = () => {
        dispatch(logout());
        dispatch(setSearchString(""));
        dispatch(clearAuthState());
    };

    useEffect(() => {
        window.addEventListener("resize", handlerCloseSidebar);

        // cleanup
        return () => {
            window.removeEventListener("resize", handlerCloseSidebar);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            className={`${
                open ? "w-64" : "w-20"
            } duration-300 flex flex-col bg-neutral-900 p-3 text-white relative`}
        >
            <div className="absolute top-20 -right-3 rounded-full">
                <HiOutlineArrowCircleLeft
                    size={30}
                    className={`${
                        !open && "rotate-180"
                    } duration-300 text-neutral-900 bg-white rounded-full cursor-pointer`}
                    onClick={() => setOpen((prev) => !prev)}
                />
            </div>
            <Link
                to={"/"}
                onClick={() => dispatch(setSearchString(""))}
                className="flex items-center gap-2 px-1 py-3 cursor-pointer"
            >
                <div>
                    <HiCloud size={40} className="text-green-600" />
                </div>
                <div
                    className={`flex items-center origin-left duration-300 ${
                        !open && "scale-0"
                    }`}
                >
                    <h2 className="font-bold">Cloud</h2>
                    <h2 className="font-light">Zone</h2>
                    <h2 className="font-bold">.</h2>
                </div>
            </Link>
            <div className="flex-1 py-14 flex flex-col gap-2">
                {routes_dashboard.map((item) => (
                    <Link
                        to={item.path}
                        key={item.key}
                        onClick={() => dispatch(setSearchString(""))}
                        className={`${
                            pathname === item.path
                                ? "bg-neutral-700"
                                : "text-neutral-400"
                        } flex items-center gap-2 font-light px-3 py-2 text-base rounded-md cursor-pointer duration-300 hover:bg-neutral-700 active:bg-neutral-600`}
                    >
                        <div>{item.icon}</div>
                        <span
                            className={`${
                                !open && "hidden"
                            } origin-left duration-200`}
                        >
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>
            <Link
                to={"/"}
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-500 cursor-pointer"
            >
                <HiOutlineLogout size={32} />
                <div className={`${!open && "hidden"}`}>Logout</div>
            </Link>
        </div>
    );
};

export default Sidebar;
