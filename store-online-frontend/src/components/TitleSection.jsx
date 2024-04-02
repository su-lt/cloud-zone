import { useEffect } from "react";

export const setTitle = (title) => {
    document.title = title;
};

const TitleSection = ({ title, description }) => {
    useEffect(() => {
        setTitle(description);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="bg-[url('./assets/images/bg-title-01.jpg')] bg-cover bg-no-repeat bg-center">
            <h2 className="py-24 font-bold text-center text-5xl text-white tracking-widest">
                {title}
            </h2>
        </div>
    );
};

export default TitleSection;
