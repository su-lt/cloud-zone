import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minPrice: "",
    maxPrice: "",
    searchString: "",
    searchCategory: [],
    sort: "",
    page: 1,
};

export const filterSlice = createSlice({
    name: "filter",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setMaxPrice: (state, action) => {
            state.maxPrice = action.payload;
        },
        setMinPrice: (state, action) => {
            state.minPrice = action.payload;
        },
        setSearchString: (state, action) => {
            state.searchString = action.payload;
        },
        setSearchCategory: (state, action) => {
            const categorySelected = action.payload;
            // check category in array
            const foundIndex = state.searchCategory.findIndex(
                (category) => category === categorySelected
            );

            if (foundIndex !== -1)
                // if found remove
                state.searchCategory.splice(foundIndex, 1);
            // not found, push to array
            else state.searchCategory.push(categorySelected);
        },
        setSort: (state, { payload }) => {
            state.sort = payload;
        },
        clearState: () => {
            return initialState;
        },
    },
});

export const {
    setMaxPrice,
    setMinPrice,
    setSearchString,
    setSearchCategory,
    setSort,
    setPage,
    clearState,
} = filterSlice.actions;
