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
            params[key] !== null &&
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

// check phone number
export const validatePhone = (paramPhone) => {
    var vValidRegex = /((0|\+)+([0-9]{9,11})\b)/g;
    if (paramPhone.match(vValidRegex)) {
        return true;
    } else {
        return false;
    }
};

// check email
export const validateEmail = (paramEmail) => {
    var vValidRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (paramEmail.match(vValidRegex)) {
        return true;
    } else {
        return false;
    }
};
