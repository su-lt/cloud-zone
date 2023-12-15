import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { HiShoppingCart } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MenuToggle } from "../../../components/MenuToggle";
import { formattedPrice } from "../../../helpers/ultil";
import DarkModeToggle from "react-dark-mode-toggle";

const menuItems = [
    { text: "Home", link: "/" },
    { text: "Shop", link: "/products" },
    { text: "Contact", link: "#" },
];

const Header = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // check toggle menu
    const [isFixed, setIsFixed] = useState(false); // check fixed navbar
    const [isDarkMode, setIsDarkMode] = useState(false); // check darkmode

    // redux state
    const { username } = useSelector((slice) => slice.auth);
    const { totalQuantity, totalPrice } = useSelector((slice) => slice.cart);

    // close menu toggle if menu toggle open and resize
    const handlerCloseToggleMenu = () => {
        if (window.innerWidth >= 768 && open) setOpen(() => false);
    };

    const handleScrollNavBar = () => {
        const scrollPosition = window.scrollY;
        const offset = 40;

        // check scroll down 40px -> set navbar change absolute to fixed position
        setIsFixed(scrollPosition >= offset);
    };

    useEffect(() => {
        // check size of screen
        window.addEventListener("resize", handlerCloseToggleMenu);
        window.addEventListener("scroll", handleScrollNavBar);

        // cleanup
        return () => {
            window.removeEventListener("resize", handlerCloseToggleMenu);
            window.removeEventListener("scroll", handleScrollNavBar);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <header>
            {/* top bar */}
            <div className="h-10 bg-slate-900 text-custom-1000">
                <div className="md:px-4 flex justify-between md:justify-end md:container">
                    {username ? (
                        <>
                            {/* <div className="my-2 px-4 leading-6 text-xs">
                                Welcome
                                <h6 className="text-red-300 inline-block ml-1">
                                    {username}
                                </h6>
                            </div>
                            <div className="my-2 px-4 border-x border-custom-300">
                                <a
                                    href="/admin/dashboard"
                                    className="leading-6 text-xs"
                                >
                                    Dashboard
                                </a>
                            </div>
                            <div className="my-2 px-4 border-x border-custom-300">
                                <Link
                                    to="/logout"
                                    className="leading-6 text-xs"
                                >
                                    Logout
                                </Link>
                            </div> */}
                            <Menu
                                as="div"
                                className="relative inline-block text-left"
                            >
                                <Menu.Button className="my-2 px-4 leading-6 text-xs border-x border-custom-300 hover:bg-slate-700 hover:rounded-md">
                                    Welcome
                                    <h6 className="text-red-300 inline-block ml-1 hover:text-re">
                                        {username}
                                    </h6>
                                </Menu.Button>

                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right z-[52] absolute left-2 leading-6 text-xs md:left-auto md:right-0 mt-1 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-opacity-5 focus:outline-none">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    className={`${
                                                        active && "bg-gray-100"
                                                    } px-4 text-gray-700 cursor-pointer rounded-sm focus:bg-gray-200`}
                                                    // onClick={() =>
                                                    //     navigate("/logout")
                                                    // }
                                                >
                                                    Profile
                                                </div>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    className={`${
                                                        active && "bg-gray-100"
                                                    } px-4 text-gray-700 cursor-pointer rounded-sm focus:bg-gray-200`}
                                                    onClick={() =>
                                                        navigate(
                                                            "/admin/dashboard"
                                                        )
                                                    }
                                                >
                                                    Dashboard
                                                </div>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <div
                                                    className={`${
                                                        active && "bg-gray-100"
                                                    } px-4 text-gray-700 cursor-pointer rounded-sm focus:bg-gray-200`}
                                                    // onClick={() =>
                                                    //     navigate("/logout")
                                                    // }
                                                >
                                                    Logout
                                                </div>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </>
                    ) : (
                        <div className="my-2 px-4 border-x border-custom-300">
                            <Link to="/login" className="leading-6 text-xs">
                                My Account
                            </Link>
                        </div>
                    )}
                    <div className="px-4 md:pr-0 flex items-center">
                        <DarkModeToggle
                            onChange={() => setIsDarkMode(!isDarkMode)}
                            checked={isDarkMode}
                            size={40}
                            className={
                                isDarkMode ? "shadow-neon rounded-xl" : ""
                            }
                        />
                    </div>
                </div>
            </div>
            {/* nav bar */}
            <motion.nav
                initial={{ position: "fixed", top: 40 }}
                animate={{
                    top: isFixed ? 0 : 40,
                    position: isFixed ? "fixed" : "absolute",
                    backgroundColor: isFixed
                        ? "rgba(255, 255, 255, 1)"
                        : "rgba(255, 255, 255, 0)",
                    boxShadow: isFixed ? "0 0px 3px 0px rgba(0,0,0,0.2)" : "0",
                }}
                transition={{ duration: 0.5 }}
                className="w-full h-14 left-1/2 -translate-x-1/2 z-50 items-center hidden md:flex"
            >
                <div className="px-4 w-full flex items-center justify-between md:container">
                    <div className="flex items-center">
                        {/* brand logo */}
                        <Link to="/" className="flex items-center">
                            <h2 className="font-bold">Cloud</h2>
                            <h2 className="font-light">Zone</h2>
                            <h2 className="font-bold">.</h2>
                        </Link>

                        {/* menu - desktop */}
                        <div className="ml-16 hidden md:block">
                            <ul className="flex gap-5">
                                {menuItems.map((item) => (
                                    <li key={item.text} className="py-2">
                                        <a href={item.link}>{item.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* cart - menu */}
                    <div className="flex gap-4 items-center">
                        {/* cart */}
                        <Link className="relative" to="/cart">
                            <div>
                                <HiShoppingCart size={20} />
                            </div>
                            {totalQuantity ? (
                                <span className="cart-badge">
                                    {totalQuantity}
                                </span>
                            ) : null}
                        </Link>
                        {totalQuantity && formattedPrice(totalPrice)}
                    </div>
                </div>
            </motion.nav>

            {/* navbar mobile */}
            <nav className="px-4 h-14 shadow-b shadow-nav flex items-center justify-between md:hidden">
                {/* brand logo */}
                <Link to="/" className="flex items-center">
                    <h2 className="font-bold">Cloud</h2>
                    <h2 className="font-light">Zone</h2>
                    <h2 className="font-bold">.</h2>
                </Link>

                <div className="flex items-center gap-4">
                    {/* cart - menu */}
                    <div className="flex gap-4 items-center">
                        {/* cart */}
                        <Link className="relative" to="/cart">
                            <div>
                                <HiShoppingCart size={20} />
                            </div>
                            {totalQuantity ? (
                                <span className="cart-badge">
                                    {totalQuantity}
                                </span>
                            ) : null}
                        </Link>
                        {totalQuantity
                            ? "$ " + Math.round(totalPrice * 100) / 100
                            : null}
                    </div>

                    {/* menu toggle */}
                    <motion.div
                        animate={open ? "open" : "closed"}
                        className="flex md:hidden"
                    >
                        <MenuToggle toggle={() => setOpen((prev) => !prev)} />
                    </motion.div>
                </div>
            </nav>

            {/* menu - mobile */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                        className="px-4 w-full z-[51] text-white bg-[#16405B] md:hidden"
                    >
                        <ul>
                            {menuItems.map((item) => (
                                <li key={item.text} className="py-2">
                                    <a href={item.link}>{item.text}</a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
