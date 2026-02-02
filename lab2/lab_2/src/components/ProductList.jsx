import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import ProductTable from "./ProductTable.jsx";

export default function ProductList() {
  // state الفورم
  const [product, setProduct] = useState({
      productName: "",
    price: "",
    quantity: "",
    isFreeShipping: false,
  });

  // state الجدول
  const [products, setProducts] = useState([]);

  // error
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // validation
    if (product.productName.length < 4) {
      setError("Product name must be at least 4 letters");
      return;
    }

    if (product.price <= 0) {
      setError("Product price must be greater than 0");
      return;
    }

    if (product.quantity < 1) {
      setError("Product quantity must be at least 1");
      return;
    }

    setError("");

    // add product
    setProducts([...products, product]);

    // reset form
    setProduct({
      productName: "",
      price: "",
      quantity: "",
      isFreeShipping: false,
    });
  }

  function deleteProduct(index) {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  }

  return (
    <div className="container mt-5">
      {/* FORM */}
      <Form className="w-50 mx-auto" onSubmit={handleSubmit}>
        <Form.Control
          className="mb-3"
          type="text"
          placeholder="Product Name"
          name="productName"
          value={product.productName}
          onChange={handleChange}
        />

        <Form.Control
          className="mb-3"
          type="number"
          placeholder="Price"
          name="price"
          value={product.price}
          onChange={handleChange}
        />

        <Form.Control
          className="mb-3"
          type="number"
          placeholder="Quantity"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
        />

        <Form.Check
          className="mb-3"
          type="checkbox"
          label="Free Shipping"
          name="isFreeShipping"
          checked={product.isFreeShipping}
          onChange={handleChange}
        />

        {error && <Alert variant="danger">{error}</Alert>}

        <Button type="submit" className="w-100" variant="dark">
          Add Product
        </Button>
      </Form>

      {/* TABLE */}
      <ProductTable products={products} deleteProduct={deleteProduct} />
    </div>
  );
}
