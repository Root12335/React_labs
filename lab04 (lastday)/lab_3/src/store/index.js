import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./slices/productSlice";

export const myStore = configureStore({
	reducer: {
		productSlice: productReducer,
	},
});
