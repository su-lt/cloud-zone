import React from "react";
import imageNotFound from "../../assets/images/notfound.png";

const NotFound = () => {
    return (
        <main className="dark:bg-dark dark:text-custom-1000 min-h-[calc(100vh-369px)]">
            <div className="md:mt-10 p-4 md:container">
                <div className="mt-8 grid sm:grid-cols-2">
                    <div>
                        <img src={imageNotFound} alt="" />
                    </div>
                    <div className="m-4 md:ml-10 flex flex-col justify-center items-center">
                        <h2>We're Sorry</h2>
                        <h3 className="text-center">
                            The page you're looking for can't be found.
                        </h3>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
