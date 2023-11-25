import React from "react";

const InputGroups = ({ quantity, handleChange }) => {
    return (
        <div className="mt-4">
            <div className="w-[135px] h-[40px] flex items-center border border-custom-300 rounded-sm text-center">
                <div
                    className="flex-grow leading-10 cursor-pointer hover:bg-primary hover:text-white select-none"
                    onClick={
                        quantity > 1
                            ? () => handleChange(quantity - 1)
                            : () => {}
                    }
                >
                    &#45;
                </div>
                <input
                    className="bg-custom-100 border-r border-l border-custom-300 w-[45px] focus:outline-none h-[38px] text-center"
                    type="number"
                    value={quantity}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <div
                    className="flex-grow leading-10 cursor-pointer hover:bg-primary hover:text-white select-none"
                    onClick={
                        quantity < 9
                            ? () => handleChange(quantity + 1)
                            : () => {}
                    }
                >
                    &#43;
                </div>
            </div>
        </div>
    );
};

export default InputGroups;
