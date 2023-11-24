import { useEffect, useState } from "react";
import { HiShoppingCart, HiMiniBars3, HiBarsArrowDown } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const menuItems = [
    { text: "Home", link: "/" },
    { text: "Shop", link: "/products" },
    { text: "Contact", link: "#" },
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const { username } = useSelector((slice) => slice.auth);

    // close menu toggle if menu toggle open and resize
    const handlerCloseMenuToggle = () => {
        if (window.innerWidth >= 768 && open) {
            setOpen(() => false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", handlerCloseMenuToggle);

        // cleanup
        return () => {
            window.removeEventListener("resize", handlerCloseMenuToggle);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <header>
            {/* top bar */}
            <div className=" px-4 h-10 bg-slate-900 text-custom-1000">
                <div className="flex justify-end md:container">
                    {username ? (
                        <>
                            <div className="my-2 px-4 leading-6 text-xs">
                                Welcome
                                <h6 className="text-red-300 inline-block ml-1">
                                    {username}
                                </h6>
                            </div>
                            <div className="my-2 px-4 border-x border-custom-300">
                                <Link
                                    to="/logout"
                                    className="leading-6 text-xs"
                                >
                                    Logout
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="my-2 px-4 border-x border-custom-300">
                            <Link to="/login" className="leading-6 text-xs">
                                My Account
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {/* nav bar */}
            <nav className="px-4 h-14 flex items-center justify-between md:container">
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
                    <div className="relative">
                        <div>
                            <HiShoppingCart size={20} />
                        </div>
                        <span className="cart-badge">12</span>
                    </div>
                    {/* menu toggle */}
                    <div className="md:hidden">
                        {open ? (
                            <HiBarsArrowDown
                                size={30}
                                onClick={() => setOpen(false)}
                            />
                        ) : (
                            <HiMiniBars3
                                size={30}
                                onClick={() => setOpen(true)}
                            />
                        )}
                    </div>
                </div>
            </nav>
            {/* menu - mobile */}
            <div
                className={`${
                    open
                        ? `opacity-100 h-auto scale-100`
                        : `opacity-0 h-0 scale-0`
                } px-4 text-white bg-[#16405B] transform origin-top-right duration-500 md:hidden`}
            >
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.text} className="py-2">
                            <a href={item.link}>{item.text}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
};

export default Header;
