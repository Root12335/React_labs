import { useState } from "react";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";

function App() {
  const [products, setProducts] = useState([]);

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  const handleDeleteProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 ">Product Form</h2>
      <div className="row g-4">
        <div className="col-lg-4">
          <ProductForm onAddProduct={handleAddProduct} />
        </div>
        <div className="col-lg-8">
          <ProductTable
            products={products}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
