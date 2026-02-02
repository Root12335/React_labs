import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import { getProductById } from "../api/productApi";
import { Link } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/products">
          <Button variant="dark">Back to Products</Button>
        </Link>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Product not found</Alert>
        <Link to="/products">
          <Button variant="dark">Back to Products</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="mb-4">
        <Col>
          <Link to="/products">
            <Button variant="outline-dark">← Back to Products</Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Img variant="top" src={product.image} alt={product.name} />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0">
            <Card.Body>
              <Card.Title className="display-6 mb-3">{product.name}</Card.Title>

              <div className="mb-4">
                <h5 className="text-muted mb-2">Category</h5>
                <p className="badge bg-dark p-2">{product.category}</p>
              </div>

              <div className="mb-4">
                <h5 className="text-success fs-4">${product.price}</h5>
              </div>

              <div className="mb-4">
                <h5 className="text-muted">Quantity</h5>
                <p className="fs-5">{product.quantity}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
