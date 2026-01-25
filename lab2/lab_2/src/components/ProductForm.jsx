import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

export default function ProductForm({ onAddProduct }) {
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    quantity: "",
    isFreeShipping: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    productName: "",
    price: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {
      productName: "",
      price: "",
      quantity: "",
    };

    let hasError = false;

    if (product.productName.trim().length < 4) {
      errors.productName = "Product name must be at least 4 characters";
      hasError = true;
    }

    if (Number(product.price) <= 0) {
      errors.price = "Price must be greater than 0";
      hasError = true;
    }

    if (Number(product.quantity) < 1) {
      errors.quantity = "Quantity must be at least 1";
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(errors);
      return;
    }

    onAddProduct?.(product);

    setProduct({
      productName: "",
      price: "",
      quantity: "",
      isFreeShipping: false,
    });

    setFieldErrors({
      productName: "",
      price: "",
      quantity: "",
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Add Product</h5>

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Product Name"
              name="productName"
              value={product.productName}
              onChange={handleChange}
              isInvalid={!!fieldErrors.productName}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.productName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder="Price"
              name="price"
              value={product.price}
              onChange={handleChange}
              isInvalid={!!fieldErrors.price}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.price}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              isInvalid={!!fieldErrors.quantity}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.quantity}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            label="Free Shipping"
            name="isFreeShipping"
            checked={product.isFreeShipping}
            onChange={handleChange}
          />

          <Button type="submit" variant="dark" className="w-100">
            Add Product
          </Button>
        </Form>
      </div>
    </div>
  );
}
