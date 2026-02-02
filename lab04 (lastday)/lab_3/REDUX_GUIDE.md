# Redux Toolkit Complete Guide

This guide explains how Redux Toolkit is implemented in this project for managing product state with full CRUD operations.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Store Configuration](#store-configuration)
3. [Product Slice Explained](#product-slice-explained)
4. [Async Thunks (API Calls)](#async-thunks-api-calls)
5. [Reducers](#reducers)
6. [Selectors](#selectors)
7. [Component Integration](#component-integration)
8. [Data Flow Diagram](#data-flow-diagram)

---

## Project Structure

```
src/
├── store/
│   ├── index.js              # Store configuration
│   └── slices/
│       ├── productSlice.js   # Product state management
│       ├── counterSlice.js   # Counter example
│       └── movieSlice.js     # Movie example
├── api/
│   └── productApi.js         # API calls using Axios
├── pages/
│   ├── Products.jsx          # List all products
│   ├── ProductDetails.jsx    # View single product
│   └── ProductForm.jsx       # Add/Edit product
└── main.jsx                  # App entry with Provider
```

---

## Store Configuration

### `src/store/index.js`

```javascript
import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./slices/productSlice";

export const myStore = configureStore({
  reducer: {
    productSlice: productReducer,  // Key name used in selectors
  },
});
```

**Key Points:**
- `configureStore` creates the Redux store with good defaults
- The reducer key name (`productSlice`) is used when accessing state in selectors
- Access state as: `state.productSlice.products`

### `src/main.jsx` - Provider Setup

```javascript
import { Provider } from "react-redux";
import { myStore } from "./store";

createRoot(document.getElementById("root")).render(
  <Provider store={myStore}>
    <MainLayout />
  </Provider>
);
```

**Key Points:**
- `Provider` wraps the entire app
- Makes the store available to all components
- All child components can now use `useSelector` and `useDispatch`

---

## Product Slice Explained

### Initial State

```javascript
const initialState = {
  products: [],           // Array of all products
  selectedProduct: null,  // Currently selected product for details
  errors: null,           // Error messages
  isLoading: false,       // Loading state for UI feedback
};
```

| State Property | Type | Purpose |
|---------------|------|---------|
| `products` | Array | Stores all products fetched from API |
| `selectedProduct` | Object/null | Stores a single product for detail view |
| `errors` | String/null | Stores error messages for display |
| `isLoading` | Boolean | Shows loading spinner when true |

---

## Async Thunks (API Calls)

Async thunks handle API calls and manage the loading/success/error states automatically.

### 1. Get All Products

```javascript
export const getAllProductAction = createAsyncThunk(
  "product/getAllProductAction",  // Action type prefix
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllProduct();  // API call
      return response.data;  // This goes to fulfilled action
    } catch (error) {
      return rejectWithValue(error);  // This goes to rejected action
    }
  }
);
```

**How it works:**
1. Component dispatches: `dispatch(getAllProductAction())`
2. Redux automatically dispatches `pending` action → `isLoading = true`
3. API call executes
4. On success: `fulfilled` action → `products = response.data`
5. On error: `rejected` action → `errors = error.message`

### 2. Add Product

```javascript
export const addProductAction = createAsyncThunk(
  "product/addProductAction",
  async (product, { rejectWithValue }) => {  // product is the payload
    try {
      const response = await addNewProduct(product);
      return response.data;  // Returns the new product with ID
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

**Usage in component:**
```javascript
dispatch(addProductAction({ name: "New Product", price: 99 }));
```

### 3. Edit Product

```javascript
export const editProductAction = createAsyncThunk(
  "product/editProductAction",
  async ({ productId, product }, { rejectWithValue }) => {  // Destructured params
    try {
      const response = await editProduct(productId, product);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

**Usage in component:**
```javascript
dispatch(editProductAction({ 
  productId: 1, 
  product: { name: "Updated Name", price: 150 } 
}));
```

### 4. Delete Product

```javascript
export const deleteProductAction = createAsyncThunk(
  "product/deleteProductAction",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await deleteProduct(productId);
      return response.data;  // Returns the deleted product
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
```

**Usage in component:**
```javascript
dispatch(deleteProductAction(productId));
```

---

## Reducers

### Sync Reducers (in `reducers` object)

These are for synchronous state changes without API calls.

```javascript
reducers: {
  // Get product by ID from store (NOT from API)
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
}
```

**Usage:**
```javascript
import { productActions } from "../store/slices/productSlice";

// Set selected product from existing store data
dispatch(productActions.getProductById(5));

// Clear selection
dispatch(productActions.clearSelectedProduct());
```

### Extra Reducers (for Async Thunks)

Handle the three states of async operations: `pending`, `fulfilled`, `rejected`

```javascript
extraReducers: (builder) => {
  // GET ALL - Pending
  builder.addCase(getAllProductAction.pending, (state) => {
    state.isLoading = true;
    state.errors = null;
  });
  
  // GET ALL - Fulfilled (Success)
  builder.addCase(getAllProductAction.fulfilled, (state, action) => {
    state.isLoading = false;
    state.products = action.payload;  // Set products from API response
  });
  
  // GET ALL - Rejected (Error)
  builder.addCase(getAllProductAction.rejected, (state, action) => {
    state.isLoading = false;
    state.errors = action.payload?.message || "Failed to fetch products";
  });
  
  // ADD - Fulfilled
  builder.addCase(addProductAction.fulfilled, (state, action) => {
    state.isLoading = false;
    state.products.push(action.payload);  // Add new product to array
  });
  
  // EDIT - Fulfilled
  builder.addCase(editProductAction.fulfilled, (state, action) => {
    state.isLoading = false;
    const index = state.products.findIndex(
      (product) => product.id == action.payload.id
    );
    if (index !== -1) {
      state.products[index] = action.payload;  // Update product in array
    }
  });
  
  // DELETE - Fulfilled
  builder.addCase(deleteProductAction.fulfilled, (state, action) => {
    state.isLoading = false;
    state.products = state.products.filter(
      (product) => product.id != action.payload.id  // Remove from array
    );
  });
}
```

---

## Selectors

Selectors are functions that extract specific pieces of state.

```javascript
// Get all products
export const selectAllProducts = (state) => state.productSlice.products;

// Get product by ID (from store, not API)
export const selectProductById = (state, productId) =>
  state.productSlice.products.find((product) => product.id == productId);

// Get selected product
export const selectSelectedProduct = (state) => state.productSlice.selectedProduct;

// Get loading state
export const selectProductsLoading = (state) => state.productSlice.isLoading;

// Get errors
export const selectProductsErrors = (state) => state.productSlice.errors;
```

**Usage in components:**
```javascript
import { useSelector } from "react-redux";
import { selectAllProducts, selectProductsLoading } from "../store/slices/productSlice";

function MyComponent() {
  const products = useSelector(selectAllProducts);
  const isLoading = useSelector(selectProductsLoading);
  
  // Or inline selector for dynamic values
  const product = useSelector((state) => selectProductById(state, id));
}
```

---

## Component Integration

### 1. Products.jsx - List All Products

```javascript
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProductAction,
  deleteProductAction,
  selectAllProducts,
  selectProductsLoading,
  selectProductsErrors,
} from "../store/slices/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  
  // Read from Redux store
  const products = useSelector(selectAllProducts);
  const isLoading = useSelector(selectProductsLoading);
  const errors = useSelector(selectProductsErrors);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getAllProductAction());
  }, [dispatch]);

  // Delete handler
  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    dispatch(deleteProductAction(id));
  };

  // Render based on state
  if (isLoading) return <Spinner />;
  if (errors) return <Alert>{errors}</Alert>;
  
  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onDelete={handleDelete} />
      ))}
    </div>
  );
}
```

### 2. ProductDetails.jsx - View Single Product

```javascript
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProductById,
  selectAllProducts,
  getAllProductAction,
} from "../store/slices/productSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const products = useSelector(selectAllProducts);
  
  // Get product by ID FROM STORE (not from API request!)
  const product = useSelector((state) => selectProductById(state, id));

  // Load products if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProductAction());
    }
  }, [dispatch, products.length]);

  if (!product) return <Spinner />;
  
  return <ProductView product={product} />;
}
```

**Important:** `selectProductById` gets the product from the Redux store, NOT from an API call. This is faster and uses cached data.

### 3. ProductForm.jsx - Add/Edit Product

```javascript
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductAction,
  editProductAction,
  selectProductById,
  selectAllProducts,
  getAllProductAction,
} from "../store/slices/productSlice";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);

  const products = useSelector(selectAllProducts);
  
  // Get existing product from store for editing
  const existingProduct = useSelector((state) => selectProductById(state, id));

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
  });

  // Load products if needed
  useEffect(() => {
    if (isEdit && products.length === 0) {
      dispatch(getAllProductAction());
    }
  }, [dispatch, isEdit, products.length]);

  // Populate form with existing data
  useEffect(() => {
    if (isEdit && existingProduct) {
      setProduct({
        name: existingProduct.name || "",
        price: existingProduct.price || "",
        // ... other fields
      });
    }
  }, [isEdit, existingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        // Edit: pass both ID and updated data
        await dispatch(editProductAction({ productId: id, product })).unwrap();
      } else {
        // Add: pass only the new product data
        await dispatch(addProductAction(product)).unwrap();
      }
      navigate("/products");
    } catch (err) {
      setError("Failed to save product");
    }
  };

  return <Form onSubmit={handleSubmit}>...</Form>;
}
```

**Note:** `.unwrap()` makes the thunk return a promise that rejects on error, allowing try/catch handling.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         COMPONENT                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │ useSelector │    │ useDispatch │    │   useState  │         │
│  │  (read)     │    │  (write)    │    │   (local)   │         │
│  └──────┬──────┘    └──────┬──────┘    └─────────────┘         │
└─────────┼──────────────────┼────────────────────────────────────┘
          │                  │
          │ Read State       │ Dispatch Action
          │                  ▼
┌─────────┴──────────────────────────────────────────────────────┐
│                        REDUX STORE                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     productSlice                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │  products   │  │  isLoading  │  │   errors    │      │   │
│  │  │    [ ]      │  │   false     │  │    null     │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ▲                                  │
│                              │                                  │
│  ┌───────────────────────────┴─────────────────────────────┐   │
│  │                    ASYNC THUNKS                          │   │
│  │  getAllProductAction  │  addProductAction                │   │
│  │  editProductAction    │  deleteProductAction             │   │
│  └───────────────────────┬─────────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           │ API Calls
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                        PRODUCT API                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ getAllProduct│  │addNewProduct│  │editProduct  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │deleteProduct │  │getProductById│  (not used with Redux)       │
│  └─────────────┘  └─────────────┘                               │
└──────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                     JSON SERVER (Backend)                         │
│                   http://localhost:4000/products                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Summary: Before vs After Redux

### Before (Direct API Calls)

```javascript
// Each component manages its own state
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  getAllProduct().then(res => setProducts(res.data));
}, []);

const handleDelete = async (id) => {
  await deleteProduct(id);
  // Must refetch all data
  const res = await getAllProduct();
  setProducts(res.data);
};
```

**Problems:**
- State not shared between components
- Must refetch data after every change
- Loading/error states duplicated everywhere
- No single source of truth

### After (With Redux)

```javascript
// State is centralized and shared
const products = useSelector(selectAllProducts);
const isLoading = useSelector(selectProductsLoading);

useEffect(() => {
  dispatch(getAllProductAction());
}, [dispatch]);

const handleDelete = (id) => {
  dispatch(deleteProductAction(id));
  // Store automatically updates, no refetch needed!
};
```

**Benefits:**
- Single source of truth
- State shared across all components
- Automatic updates after mutations
- Consistent loading/error handling
- Get by ID from cache (no extra API call)

---

## Quick Reference

| Action | Component Code | What Happens |
|--------|---------------|--------------|
| Fetch all | `dispatch(getAllProductAction())` | API call → store updated |
| Get by ID | `useSelector(state => selectProductById(state, id))` | Reads from store (no API) |
| Add | `dispatch(addProductAction(product))` | API call → added to store |
| Edit | `dispatch(editProductAction({productId, product}))` | API call → updated in store |
| Delete | `dispatch(deleteProductAction(id))` | API call → removed from store |

---

## Files Changed

1. **`src/store/slices/productSlice.js`** - Added complete CRUD operations
2. **`src/main.jsx`** - Added Redux Provider
3. **`src/pages/Products.jsx`** - Converted to use Redux
4. **`src/pages/ProductDetails.jsx`** - Uses `selectProductById` from store
5. **`src/pages/ProductForm.jsx`** - Uses Redux for add/edit operations

---

*Created for learning Redux Toolkit with React*
