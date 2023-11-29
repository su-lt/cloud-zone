import { useEffect, useState } from "react";

export const convertToSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
};

export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();

    for (const key in params) {
        if (params[key] !== undefined && params[key] !== "") {
            searchParams.append(key, params[key]);
        }
    }
    return searchParams.toString();
};

export const useDebounce = (value, duration = 500) => {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [duration, value]);

    return debounceValue;
};
