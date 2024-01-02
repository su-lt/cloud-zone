import HeroSection from "../../components/HeroSection";
import imageCollection_01 from "../../assets/images/collection-01.jpg";
import imageCollection_02 from "../../assets/images/collection-02.jpg";
import imageCollection_03 from "../../assets/images/collection-03.jpg";
import RelatedProducts from "../../components/Products/RelatedProducts";
import { FaTruck, FaArrowsRotate } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import { TbDatabaseX } from "react-icons/tb";

const HomePage = () => {
    return (
        <div className="flex-1">
            {/* hero section */}
            <HeroSection />

            {/* collection section */}
            <section className="px-4 py-10 md:container dark:text-custom-1000">
                <h3 className="text-3xl md:text-center">Collection</h3>
                <div className="mt-4 wrapper-scroll md:grid-cols-3">
                    {/* collection 1 */}
                    <div className="relative h-44 md:h-72 border border-custom-500 snap-start group">
                        <img
                            src={imageCollection_01}
                            className="h-full w-full object-cover"
                            alt=""
                        />
                        <div className="absolute left-6 top-6 z-10 group-hover:text-white transition-all duration-500">
                            <h3 className="text-2xl font-bold">Men</h3>
                            <h4 className="text-sm">Collection 2023</h4>
                        </div>
                        <div className="absolute opacity-0 h-full w-full top-0 right-0 bg-primary group-hover:opacity-80 text-white transition-all duration-500">
                            <div className="absolute bottom-10 left-6 underline-text">
                                Shop now
                            </div>
                        </div>
                    </div>

                    {/* collection 2 */}
                    <div className="relative h-44 md:h-72 border border-custom-500 snap-start group">
                        <img
                            src={imageCollection_02}
                            className="h-full w-full object-cover"
                            alt=""
                        />
                        <div className="absolute left-6 top-6 z-10 group-hover:text-white transition-all duration-500">
                            <h3 className="text-2xl font-bold">Bags</h3>
                            <h4 className="text-sm">Full colors</h4>
                        </div>
                        <div className="absolute opacity-0 h-full w-full top-0 right-0 bg-primary group-hover:opacity-80 text-white transition-all duration-500">
                            <div className="absolute bottom-10 left-6 underline-text">
                                Shop now
                            </div>
                        </div>
                    </div>

                    {/* collection 3 */}
                    <div className="relative h-44 md:h-72 border border-custom-500 snap-start group">
                        <img
                            src={imageCollection_03}
                            className="h-full w-full object-cover"
                            alt=""
                        />
                        <div className="absolute left-6 top-6 z-10 group-hover:text-white transition-all duration-500">
                            <h3 className="text-2xl font-bold">Accessories</h3>
                            <h4 className="text-sm">
                                Simple but sophisticated
                            </h4>
                        </div>
                        <div className="absolute opacity-0 h-full w-full top-0 right-0 bg-primary group-hover:opacity-80 text-white transition-all duration-500">
                            <div className="absolute bottom-10 left-6 underline-text">
                                Shop now
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* polices section */}
            <section className="p-4 md:container dark:text-custom-1000">
                <h3 className="my-10 text-3xl md:text-center">Policies</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
                    <div className="px-4 w-full border-r border-custom-500">
                        <div className="flex flex-col items-center text-center">
                            <FaTruck size={30} />
                            <h4>Free Delivery</h4>
                            <h5>Free Shipping on all order</h5>
                        </div>
                    </div>
                    <div className="px-4 w-full h-full md:border-r border-custom-500">
                        <div className="flex flex-col items-center text-center">
                            <FaArrowsRotate size={30} />
                            <h4>Return Policy</h4>
                            <h5>5-days return</h5>
                        </div>
                    </div>
                    <div className="px-4 w-full h-full border-r border-custom-500">
                        <div className="flex flex-col items-center text-center">
                            <MdSupportAgent size={30} />
                            <h4>24/7 Support</h4>
                            <h5>Always beside you</h5>
                        </div>
                    </div>
                    <div className="px-4 w-full h-full">
                        <div className="flex flex-col items-center text-center">
                            <TbDatabaseX size={30} />
                            <h4>Secure Payment</h4>
                            <h5>Never store your card</h5>
                        </div>
                    </div>
                </div>
            </section>

            {/* preview products */}
            <section className="p-4 md:container">
                <RelatedProducts id={"655ca7151e2d61a6aa0c921c"} />
            </section>
        </div>
    );
};

export default HomePage;
