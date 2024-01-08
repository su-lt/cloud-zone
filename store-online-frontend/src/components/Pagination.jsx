import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/product.slice";
import { setPage } from "../redux/slices/filter.slice";

const Pagination = () => {
    const dispatch = useDispatch();
    // state redux
    const { minPrice, maxPrice, searchString, searchCategory, sort, page } =
        useSelector((slice) => slice.filter);
    const { totalPages } = useSelector((slice) => slice.product);

    // handle page change
    const handleSelectPage = (page) => {
        dispatch(setPage(page));
    };

    useEffect(() => {
        if (page <= totalPages)
            dispatch(
                fetchProducts({
                    minPrice,
                    maxPrice,
                    searchString,
                    searchCategory,
                    sort,
                    page,
                })
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return totalPages > 0 ? (
        <div className="grid-cols-none w-full mx-auto mt-12 px-4 text-gray-600 md:px-8">
            <div
                className="flex items-center justify-center gap-x-3"
                aria-label="Pagination"
            >
                <button
                    onClick={() => handleSelectPage(page - 1)}
                    className="hover:text-indigo-600  flex items-center gap-x-2"
                    disabled={page === 1 ? true : false}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
                <ul className="flex items-center gap-1">
                    {Array(totalPages)
                        .fill(null)
                        .map((_, idx) => (
                            <li key={idx} className="text-sm">
                                <button
                                    onClick={() => handleSelectPage(idx + 1)}
                                    className={`px-4 py-2 rounded-lg duration-150 hover:text-indigo-600 hover:bg-indigo-50 ${
                                        page === idx + 1
                                            ? "bg-indigo-50 text-indigo-600 font-medium"
                                            : ""
                                    }`}
                                    disabled={page === idx + 1 ? true : false}
                                >
                                    {idx + 1}
                                </button>
                            </li>
                        ))}
                </ul>
                <button
                    onClick={() => handleSelectPage(page + 1)}
                    className="hover:text-indigo-600 flex items-center gap-x-2"
                    disabled={page === totalPages ? true : false}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    ) : (
        <div className="text-center">No result</div>
    );
};

export default Pagination;
