import React, { useEffect, useState } from "react";

const LayoutSection = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        setFadeOut(true);
    }, []);

    return (
        <div
            className={`fixed w-full h-screen top-0 left-0 ${
                fadeOut ? "opacity-0 hidden" : "opacity-100"
            } bg-white z-50 transition-opacity duration-1000 ease-in-out`}
        ></div>
    );
};

export default LayoutSection;
