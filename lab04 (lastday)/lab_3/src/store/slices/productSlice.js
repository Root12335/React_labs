import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	addNewProduct,
	deleteProduct,
	editProduct,
	getAllProduct,
} from "../../api/productApi";

const initialState = {
	products: [],
	selectedProduct: null,
	errors: null,
	isLoading: false,
};

// pending-fullfilled-rejected

// thunkmiddleware -- createAsyncThunk

// GET ALL Products
export const getAllProductAction = createAsyncThunk(
	"product/getAllProductAction",
	async (_, { rejectWithValue }) => {
		try {
			const response = await getAllProduct();
			return response.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);

// ADD Product
export const addProductAction = createAsyncThunk(
	"product/addProductAction",
	async (product, { rejectWithValue }) => {
		try {
			const response = await addNewProduct(product);
			return response.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);

// EDIT Product
export const editProductAction = createAsyncThunk(
	"product/editProductAction",
	async ({ productId, product }, { rejectWithValue }) => {
		try {
			const response = await editProduct(productId, product);
			return response.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);

// DELETE Product
export const deleteProductAction = createAsyncThunk(
	"product/deleteProductAction",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await deleteProduct(productId);
			return response.data;
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);

const productSlice = createSlice({
	name: "product",
	initialState,
	reducers: {
		// Get product by ID from store (not from API request)
		getProductById: (state, action) => {
			const productId = action.payload;
			state.selectedProduct = state.products.find(
				(product) => product.id == productId
			) || null;
		},
		// Clear selected product
		clearSelectedProduct: (state) => {
			state.selectedProduct = null;
		},
	},
	extraReducers: (builder) => {
		// GET ALL
		builder.addCase(getAllProductAction.pending, (state, action) => {
			state.isLoading = true;
			state.errors = null;
		});
		builder.addCase(getAllProductAction.fulfilled, (state, action) => {
			state.isLoading = false;
			state.products = action.payload;
		});
		builder.addCase(getAllProductAction.rejected, (state, action) => {
			state.isLoading = false;
			state.errors = action.payload?.message || "Failed to fetch products";
		});

		// ADD
		builder.addCase(addProductAction.pending, (state) => {
			state.isLoading = true;
			state.errors = null;
		});
		builder.addCase(addProductAction.fulfilled, (state, action) => {
			state.isLoading = false;
			state.products.push(action.payload);
		});
		builder.addCase(addProductAction.rejected, (state, action) => {
			state.isLoading = false;
			state.errors = action.payload?.message || "Failed to add product";
		});

		// EDIT
		builder.addCase(editProductAction.pending, (state) => {
			state.isLoading = true;
			state.errors = null;
		});
		builder.addCase(editProductAction.fulfilled, (state, action) => {
			state.isLoading = false;
			const index = state.products.findIndex(
				(product) => product.id == action.payload.id
			);
			if (index !== -1) {
				state.products[index] = action.payload;
			}
			state.selectedProduct = action.payload;
		});
		builder.addCase(editProductAction.rejected, (state, action) => {
			state.isLoading = false;
			state.errors = action.payload?.message || "Failed to edit product";
		});

		// DELETE
		builder.addCase(deleteProductAction.pending, (state) => {
			state.isLoading = true;
			state.errors = null;
		});
		builder.addCase(deleteProductAction.fulfilled, (state, action) => {
			state.isLoading = false;
			state.products = state.products.filter(
				(product) => product.id != action.payload.id,
			);
		});
		builder.addCase(deleteProductAction.rejected, (state, action) => {
			state.isLoading = false;
			state.errors = action.payload?.message || "Failed to delete product";
		});
	},
});

// Selectors - get data from store
export const selectAllProducts = (state) => state.productSlice.products;
export const selectProductById = (state, productId) =>
	state.productSlice.products.find((product) => product.id == productId);
export const selectSelectedProduct = (state) => state.productSlice.selectedProduct;
export const selectProductsLoading = (state) => state.productSlice.isLoading;
export const selectProductsErrors = (state) => state.productSlice.errors;

export const productReducer = productSlice.reducer;
export const productActions = productSlice.actions;
