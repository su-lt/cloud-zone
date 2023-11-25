import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minPrice: "",
    maxPrice: "",
    searchString: "",
    searchCategory: "",
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
            state.searchCategory = action.payload;
        },
        clearState: (state) => {
            state = initialState;
        },
    },
});
