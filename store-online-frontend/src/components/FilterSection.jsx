import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/product.slice";
import { fetchCategories } from "../redux/slices/category.slice";
import { useDebounce } from "../helpers/ultil";
import {
    clearState,
    setMaxPrice,
    setMinPrice,
    setSearchCategory,
    setSearchString,
    setSort,
} from "../redux/slices/filter.slice";

const sortby = [
    { name: "Latest", value: "latest" },
    { name: "Oldest", value: "oldest" },
    { name: "Best seller", value: "bestseller" },
    { name: "Price: Low to Hight", value: "lth" },
    { name: "Price: Hight to Low", value: "htl" },
];

const FilterSection = () => {
    const dispatch = useDispatch();
    const { minPrice, maxPrice, searchString, searchCategory, sort } =
        useSelector((slice) => slice.filter);
    const { categories } = useSelector((slice) => slice.category);

    const [openFilter, setOpenFilter] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    const debounceSearch = useDebounce(searchString);

    const handlePricesClick = (min, max) => {
        dispatch(setMinPrice(min));
        dispatch(setMaxPrice(max));
    };

    const handleMinPriceInput = (e) => {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === "" || regex.test(e.target.value)) {
            dispatch(setMinPrice(e.target.value));
        }
    };

    const handleMaxPriceInput = (e) => {
        const regex = /^[0-9\b]+$/;
        if (e.target.value === "" || regex.test(e.target.value)) {
            dispatch(setMaxPrice(e.target.value));
        }
    };

    const handleFilterClick = () => {
        setOpenFilter(!openFilter);
        setOpenSearch(false);
        dispatch(clearState());
    };

    const handleSearchClick = () => {
        setOpenSearch(!openSearch);
        setOpenFilter(false);
        dispatch(clearState());
    };

    useEffect(() => {
        dispatch(fetchProducts({ searchString: debounceSearch }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceSearch]);

    useEffect(() => {
        dispatch(
            fetchProducts({
                minPrice,
                maxPrice,
                searchCategory,
                sort,
            })
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minPrice, maxPrice, searchCategory, sort]);

    useEffect(() => {
        dispatch(fetchCategories({}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-4 text-right dark:text-custom-1000">
            <div>
                <button
                    className="button-outline text-xs"
                    onClick={handleFilterClick}
                >
                    Filter
                </button>
                <button
                    className="button-outline text-xs ml-2"
                    onClick={handleSearchClick}
                >
                    Search
                </button>
            </div>
            {openSearch && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-4 w-full relative"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3 transition-all duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <motion.input
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            type="text"
                            placeholder="Search"
                            className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                            onChange={(e) =>
                                dispatch(setSearchString(e.target.value))
                            }
                        />
                    </motion.div>
                </AnimatePresence>
            )}
            {openFilter && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.75 }}
                        className="mt-4 p-5 bg-custom-300 grid gap-y-5 md:grid-cols-3 rounded-lg overflow-hidden"
                    >
                        {/* filter by categories */}
                        <div className="flex flex-col items-start gap-4 select-none">
                            <h4 className="font-semibold">Categories</h4>
                            {categories.map((cat) => (
                                <div
                                    key={cat._id}
                                    className={
                                        searchCategory.findIndex(
                                            (category) => category === cat._id
                                        ) !== -1
                                            ? "border-b-2 border-primary dark:border-purple-300"
                                            : null
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        name="categories"
                                        id={cat._id}
                                        value={cat._id}
                                        className="appearance-none"
                                        onChange={(e) =>
                                            dispatch(
                                                setSearchCategory(
                                                    e.target.value
                                                )
                                            )
                                        }
                                    />
                                    <label
                                        className="cursor-pointer"
                                        htmlFor={cat._id}
                                    >
                                        {cat.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {/* sort */}
                        <div className="flex flex-col items-start gap-4 select-none">
                            <h4 className="font-semibold">Sort by</h4>
                            {sortby.map((item) => (
                                <div
                                    key={item.name}
                                    className={
                                        sort === item.value
                                            ? "border-b-2 border-primary dark:border-purple-300"
                                            : null
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="sort-by"
                                        id={item.value}
                                        value={item.value}
                                        className="appearance-none"
                                        onChange={(e) =>
                                            dispatch(setSort(e.target.value))
                                        }
                                    />
                                    <label
                                        className="cursor-pointer"
                                        htmlFor={item.value}
                                    >
                                        {item.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {/* filter by prices */}
                        <div className="flex flex-col items-start gap-4">
                            <h4 className="font-semibold">Prices</h4>
                            <div>
                                <button
                                    className="w-[168px] py-2 text-gray-500 border border-primary shadow-sm rounded-lg dark:border-purple-100"
                                    onClick={() => handlePricesClick(0, 100)}
                                >
                                    $.0 - $100
                                </button>
                            </div>
                            <div>
                                <button
                                    className="w-[168px] py-2 text-gray-500 border border-primary shadow-sm rounded-lg dark:border-purple-100"
                                    onClick={() => handlePricesClick(100, 300)}
                                >
                                    $.100 - $.300
                                </button>
                            </div>
                            <div>
                                <button
                                    className="w-[168px]  py-2 text-gray-500 border border-primary shadow-sm rounded-lg dark:border-purple-100"
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
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default FilterSection;
