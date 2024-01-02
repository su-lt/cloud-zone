import { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import {
    HiOutlineBell,
    HiOutlineChatAlt,
    HiOutlineSearch,
} from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { setSearchString } from "../../../redux/slices/filter.slice";
import { clearAuthState, logout } from "../../../redux/slices/auth.slice";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // state redux
    const { searchString } = useSelector((slice) => slice.filter);

    //handle logout
    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearAuthState());
        navigate("/");
    };

    return (
        <section className="bg-white h-16 px-4 flex justify-between items-center shadow-nav">
            <div className="relative">
                <HiOutlineSearch
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-custom-500"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchString}
                    onChange={(e) => dispatch(setSearchString(e.target.value))}
                    className="px-4 pl-10 h-10 w-28 dark:bg-white sm:w-72 lg:w-96 text-sm border border-custom-500 rounded-sm focus:outline-none active:outline-none"
                />
            </div>
            <div className="flex items-center gap-2 mr-2">
                {/* message */}
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={`${
                                    open && "bg-gray-100"
                                } p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100`}
                            >
                                <HiOutlineChatAlt size={24} />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="fixed right-1/2 translate-x-1/2 sm:absolute sm:right-0 sm:translate-x-0 mt-1 w-80 z-50">
                                    <div className="bg-white rounded-md shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                                        <strong className="text-gray-700 font-medium">
                                            Message
                                        </strong>
                                        <div className="mt-2 py-1 text-sm">
                                            this is the panel
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                {/* noticaftion */}
                <HiOutlineBell size={24} />

                {/* avatar */}
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button className="ml-2 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-200">
                            <span className="sr-only">Open user menu</span>
                            <div className="h-10 w-10 rounded-full bg-slate-300">
                                <span className="sr-only">Tom Cruise</span>
                            </div>
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-1 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        className={`${
                                            active && "bg-gray-100"
                                        } px-4 py-2 text-gray-700 cursor-pointer rounded-sm focus:bg-gray-200`}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </div>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </section>
    );
};

export default Header;
