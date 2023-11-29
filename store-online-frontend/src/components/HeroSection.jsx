import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroSection = () => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4000,
        touchMove: false,
        pauseOnHover: false,
        arrows: false,
    };

    return (
        <Slider {...settings}>
            <div className="bg-[url('./assets/images/slide-01.jpg')] h-custom-xs bg-cover bg-no-repeat bg-center md:h-custom-md">
                {/* slide 1 */}
                <div className="px-4 h-full flex flex-col gap-4 justify-center md:container">
                    <h3 className="text-xl animate-pulse md:text-3xl">
                        Women Collection 2023
                    </h3>
                    <h2 className="uppercase text-gray-700 text-4xl font-playfair font-bold animate-bounce md:text-7xl">
                        New <br /> season
                    </h2>
                    <div>
                        <button className="button-primary text-lg font-medium rounded-3xl md:px-10 md:py-4">
                            Shop now
                        </button>
                    </div>
                </div>
            </div>

            {/* slide 2 */}
            <div className="bg-[url('./assets/images/slide-02.jpg')] h-custom-xs bg-cover bg-no-repeat bg-center md:h-custom-md">
                <div className="px-4 h-full flex flex-col gap-4 justify-center md:container">
                    <h3 className="text-xl animate-pulse md:text-3xl">
                        Men Collection 2023
                    </h3>
                    <h2 className="uppercase text-gray-700 text-4xl font-playfair font-bold animate-bounce md:text-7xl">
                        Jackets & <br />
                        coats
                    </h2>
                    <div>
                        <button className="button-primary text-lg font-medium rounded-3xl md:px-10 md:py-4">
                            Shop now
                        </button>
                    </div>
                </div>
            </div>

            {/* slide 3 */}
            <div className="bg-[url('./assets/images/slide-03.jpg')] h-custom-xs bg-cover bg-no-repeat bg-center md:h-custom-md">
                <div className="px-4 h-full flex flex-col gap-4 justify-center md:container">
                    <h3 className="text-xl animate-pulse md:text-3xl">
                        Accessories
                    </h3>
                    <h2 className="uppercase text-gray-700 text-4xl font-playfair font-bold animate-bounce md:text-7xl">
                        New <br />
                        arrivals
                    </h2>
                    <div>
                        <button className="button-primary text-lg font-medium rounded-3xl md:px-10 md:py-4">
                            Shop now
                        </button>
                    </div>
                </div>
            </div>
        </Slider>
    );
};

export default HeroSection;
