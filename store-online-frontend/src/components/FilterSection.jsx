import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCategories,
    fetchProducts,
    productSlice,
} from "../redux/slices/product.slice";

const FilterSection = () => {
    const dispatch = useDispatch();
    const colors = [
        { bg: "bg-[#2563EB]", ring: "ring-[#2563EB]" },
        { bg: "bg-[#8B5CF6]", ring: "ring-[#8B5CF6]" },
        { bg: "bg-[#DB2777]", ring: "ring-[#DB2777]" },
        { bg: "bg-[#475569]", ring: "ring-[#475569]" },
        { bg: "bg-[#EA580C]", ring: "ring-[#EA580C]" },
    ];

    const [openFilter, setOpenFilter] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    const state = useSelector((slice) => slice.product);
    const { minPrice, maxPrice, categories, searchString, searchCategory } =
        state;

    const handlePricesClick = (min, max) => {
        const searchInput = document.getElementById("searchInput");
        searchInput.value = "";
        dispatch(productSlice.actions.setMinPrice(min));
        dispatch(productSlice.actions.setMaxPrice(max));
    };

    const handleMinPriceInput = (e) => {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === "" || regex.test(e.target.value)) {
            dispatch(productSlice.actions.setMinPrice(e.target.value));
        }
    };

    const handleMaxPriceInput = (e) => {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === "" || regex.test(e.target.value)) {
            dispatch(productSlice.actions.setMaxPrice(e.target.value));
        }
    };

    const handleFilterClick = () => {
        setOpenFilter(!openFilter);
        setOpenSearch(false);
    };

    const handleSearchClick = () => {
        setOpenSearch(!openSearch);
        setOpenFilter(false);
    };

    useEffect(() => {
        dispatch(fetchProducts({ searchString, page: 1 }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchString]);

    useEffect(() => {
        dispatch(fetchProducts({ ...state, page: 1, searchString: "" }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minPrice, maxPrice, searchCategory]);

    useEffect(() => {
        dispatch(fetchCategories());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-4 text-right">
            <div>
                <button className="button text-xs" onClick={handleFilterClick}>
                    Filter
                </button>
                <button
                    className="button text-xs ml-2"
                    onClick={handleSearchClick}
                >
                    Search
                </button>
            </div>
            <div
                className={`${
                    openSearch ? `block` : `hidden`
                } mt-4 w-full relative`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search"
                    id="searchInput"
                    className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                    onChange={(e) =>
                        dispatch(
                            productSlice.actions.setSearchString(e.target.value)
                        )
                    }
                />
            </div>
            <div
                className={`${
                    openFilter ? `block` : `hidden`
                } mt-4 p-5 bg-custom-300 grid grid-cols-3 rounded-lg`}
            >
                <div className="flex flex-col items-start gap-4">
                    <h4>Categories</h4>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() =>
                                dispatch(
                                    productSlice.actions.setSearchCategory(
                                        cat._id
                                    )
                                )
                            }
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
                <div className="flex flex-col items-start gap-4">
                    <h4>Prices</h4>
                    <div>
                        <button
                            className="w-[168px] py-2 text-gray-500 border border-primary shadow-sm rounded-lg "
                            onClick={() => handlePricesClick(0, 100)}
                        >
                            $.0 - $100
                        </button>
                    </div>
                    <div>
                        <button
                            className="w-[168px] py-2 text-gray-500 border border-primary shadow-sm rounded-lg "
                            onClick={() => handlePricesClick(100, 300)}
                        >
                            $.100 - $.300
                        </button>
                    </div>
                    <div>
                        <button
                            className="w-[168px]  py-2 text-gray-500 border border-primary shadow-sm rounded-lg "
                            onClick={() => handlePricesClick(300, 0)}
                        >
                            $.300+
                        </button>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="relative w-[75px] text-gray-500">
                            <span className="h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
                                &#x24;
                            </span>
                            <input
                                type="text"
                                placeholder="min"
                                value={minPrice === 0 ? "" : minPrice}
                                onChange={handleMinPriceInput}
                                className="w-full pl-6 py-1 appearance-none  outline-none border focus:border-orange-400 shadow-sm rounded-lg"
                            />
                        </div>
                        <h4>&#45;</h4>
                        <div className="relative w-[75px] text-gray-500">
                            <span className="h-6 text-gray-400 absolute left-3 inset-y-0 my-auto">
                                &#x24;
                            </span>
                            <input
                                type="text"
                                placeholder="max"
                                value={maxPrice === 0 ? "" : maxPrice}
                                onChange={handleMaxPriceInput}
                                className="w-full pl-6 py-1 appearance-none  outline-none border focus:border-orange-400 shadow-sm rounded-lg"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-4">
                    <h4>Pick your favorite color</h4>
                    <ul className="mt-4 flex items-center flex-wrap gap-4">
                        {colors.map((item, idx) => (
                            /* Color box */
                            <li key={idx} className="flex-none">
                                <label
                                    htmlFor={item.bg}
                                    className="block relative w-6 h-6"
                                >
                                    <input
                                        id={item.bg}
                                        type="checkbox"
                                        name="color"
                                        className="sr-only peer"
                                    />
                                    <span
                                        className={`inline-flex justify-center items-center w-full h-full rounded-full peer-checked:ring ring-offset-2 cursor-pointer duration-150 ${item.bg} ${item.ring}`}
                                    ></span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5 text-white absolute inset-0 m-auto z-0 pointer-events-none hidden peer-checked:block duration-150"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12.75l6 6 9-13.5"
                                        />
                                    </svg>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FilterSection;
