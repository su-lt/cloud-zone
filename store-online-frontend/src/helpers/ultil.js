import { useEffect, useState } from "react";

export const formattedPrice = (price) => {
    // create formatted price
    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD", // currency code
        minimumFractionDigits: 0,
        maximumFractionDigits: 2, // Number of digits after the decimal point
    });
    return formatter.format(price);
};

export const buildQueryString = (params) => {
    const searchParams = new URLSearchParams();

    for (const key in params) {
        if (
            params[key] !== undefined &&
            params[key] !== "" &&
            !(Array.isArray(params[key]) && params[key].length === 0)
        ) {
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
