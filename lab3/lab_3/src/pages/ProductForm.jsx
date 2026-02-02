import { useEffect, useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { addNewProduct, editProduct, getProductById } from "../api/productApi";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    image: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Failed to load product"));
  }, [id, isEdit]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (product.name.length < 4) {
      setError("Product name must be at least 4 characters");
      return;
    }

    if (product.price && product.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await editProduct(id, product);
      } else {
        await addNewProduct(product);
      }

      setLoading(false);
      navigate("/products");
    } catch (error) {
      setLoading(false);
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
          {error && <Alert variant="danger">{error}</Alert>}

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
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
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
