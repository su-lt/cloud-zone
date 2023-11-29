import HeroSection from "../components/HeroSection";

const HomePage = () => {
    return (
        <div className="">
            {/* hero section */}
            <HeroSection />

            {/* collection section */}
            <section className="px-4 py-10">
                <h3 className="text-3xl md:container">Collection</h3>
                <div className="mt-4 wrapper-scroll md:container">
                    {/* collection 1 */}
                    <div className="h-44 md:h-72 border border-custom-500 snap-start">
                        <div className="p-6 h-full bg-[url('./assets/images/collection-01.jpg')] bg-cover bg-no-repeat bg-center">
                            <h3 className="text-2xl font-bold">Men</h3>
                            <h4 className="text-sm">Collection 2023</h4>
                        </div>
                    </div>
                    {/* collection 2 */}
                    <div className="h-44 md:h-72 border border-custom-500 snap-start">
                        <div className="p-6 h-full bg-[url('./assets/images/collection-02.jpg')] bg-cover bg-no-repeat bg-center">
                            <h3 className="text-2xl font-bold">Bags</h3>
                            <h4 className="text-sm">Colors</h4>
                        </div>
                    </div>
                    {/* collection 3 */}
                    <div className="h-44 md:h-72 border border-custom-500 snap-start">
                        <div className="p-6 h-full bg-[url('./assets/images/collection-03.jpg')] bg-cover bg-no-repeat bg-center">
                            <h3 className="text-2xl font-bold">Accessories</h3>
                            <h4 className="text-sm">Trending</h4>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
