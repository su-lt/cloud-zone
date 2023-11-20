import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
    return (
        <footer>
            <div className="px-4 py-10 bg-slate-900 text-custom-1000">
                <div className="grid gap-6 md:grid-cols-4 md:container">
                    <div className="px-4 ">
                        <h4 className="text-white font-semibold">Categories</h4>
                        <ul className="mt-4 text-sm">
                            <li className="py-1">
                                <a href="##" className="">
                                    Women
                                </a>
                            </li>
                            <li className="py-1">
                                <a href="##" className="">
                                    Men
                                </a>
                            </li>
                            <li className="py-1">
                                <a href="##" className="">
                                    Shoes
                                </a>
                            </li>
                            <li className="py-1">
                                <a href="##" className="">
                                    Watches
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="px-4">
                        <h4 className="text-white font-semibold">Help</h4>
                        <ul className="mt-4 text-sm">
                            <li className="py-1">
                                <a href="##" className="">
                                    Track Order
                                </a>
                            </li>
                            <li className="py-1">
                                <a href="##" className="">
                                    Returns
                                </a>
                            </li>
                            <li className="py-1">
                                <a href="##" className="">
                                    Shipping
                                </a>
                            </li>
                            <li className="py-1">
                                <a href="##" className="">
                                    FAQs
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="px-4 md:col-span-2 md:text-right">
                        <h4 className="text-white font-semibold">
                            Social Networks
                        </h4>
                        <div className="flex gap-3 md:justify-end">
                            <div className="mt-4">
                                <FaFacebookF />
                            </div>
                            <div className="mt-4">
                                <FaInstagram />
                            </div>
                            <div className="mt-4">
                                <FaYoutube />
                            </div>
                            <div className="mt-4">
                                <FaXTwitter />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-sm md:container">
                    <div className="mx-4 pt-2 text-center border-t border-custom-100">
                        Copyright © 2023 CloudZone - Luxury store.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
