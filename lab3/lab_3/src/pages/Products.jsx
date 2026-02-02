import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProduct, deleteProduct } from "../api/productApi";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await getAllProduct();
      setProducts(res.data);
    } catch (err) {
      console.log("Error loading products");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await deleteProduct(id);
    loadProducts();
  };

  if (loading) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <Container className="my-5">
      <div className="text-center mb-4">
        <h2>Products</h2>
        <Link to="/products/add" className="btn btn-dark">
          + Add Product
        </Link>
      </div>

      <Row className="g-4">
        {products.map((p) => (
          <Col key={p.id} md={6} lg={4}>
            <Card className="h-100">
              <Card.Img
                src={p.image}
                style={{ height: 200, objectFit: "cover" }}
              />

              <Card.Body className="d-flex flex-column">
                <h5>{p.name}</h5>
                <small className="text-muted">{p.category}</small>

                <p className="mt-2 fw-bold text-success">${p.price}</p>
                <p className="text-muted">Stock: {p.quantity}</p>

                <div className="mt-auto d-grid gap-2">
                  <Link
                    to={`/products/${p.id}`}
                    className="btn btn-sm btn-info"
                  >
                    View
                  </Link>

                  <Link
                    to={`/products/${p.id}/edit`}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </Link>

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
