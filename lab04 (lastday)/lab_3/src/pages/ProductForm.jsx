import { useEffect, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductAction,
  editProductAction,
  selectProductById,
  selectAllProducts,
  selectProductsLoading,
  selectProductsErrors,
  getAllProductAction,
} from "../store/slices/productSlice";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);

  // Get data from Redux store
  const products = useSelector(selectAllProducts);
  const isLoading = useSelector(selectProductsLoading);
  const storeErrors = useSelector(selectProductsErrors);
  
  // Get product by ID from store (not from API request)
  const existingProduct = useSelector((state) => selectProductById(state, id));

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
  });

  const [error, setError] = useState("");

  // Load products if not already loaded (for edit mode)
  useEffect(() => {
    if (isEdit && products.length === 0) {
      dispatch(getAllProductAction());
    }
  }, [dispatch, isEdit, products.length]);

  // Set product data when editing (from store)
  useEffect(() => {
    if (isEdit && existingProduct) {
      setProduct({
        name: existingProduct.name || "",
        price: existingProduct.price || "",
        quantity: existingProduct.quantity || "",
        category: existingProduct.category || "",
        image: existingProduct.image || "",
      });
    }
  }, [isEdit, existingProduct]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (product.name.length < 4) {
      setError("Product name must be at least 4 characters");
      return;
    }

    if (product.price && product.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    try {
      if (isEdit) {
        await dispatch(editProductAction({ productId: id, product })).unwrap();
      } else {
        await dispatch(addProductAction(product)).unwrap();
      }
      navigate("/products");
    } catch (err) {
      setError("Failed to save product");
    }
  };

  return (
    <Container className="my-5">
      <Card className="mx-auto" style={{ maxWidth: 450 }}>
        <Card.Header className="bg-dark text-white">
          {isEdit ? "Edit Product" : "Add Product"}
        </Card.Header>

        <Card.Body>
          {(error || storeErrors) && (
            <Alert variant="danger">{error || storeErrors}</Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Control
              className="mb-3"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
            />

            <Form.Control
              className="mb-3"
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleChange}
            />

            <Form.Control
              className="mb-3"
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={product.quantity}
              onChange={handleChange}
            />

            <Form.Select
              className="mb-3"
              name="category"
              value={product.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Accessories</option>
              <option>Furniture</option>
            </Form.Select>

            <Form.Control
              className="mb-3"
              type="url"
              name="image"
              placeholder="Image URL"
              value={product.image}
              onChange={handleChange}
            />

            {product.image && (
              <img
                src={product.image}
                alt="preview"
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 5,
                  marginBottom: 10,
                }}
              />
            )}

            <div className="d-grid gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>

              <Button
                variant="outline-secondary"
                onClick={() => navigate("/products")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
