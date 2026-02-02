import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import {
  getAllProductAction,
  deleteProductAction,
  selectAllProducts,
  selectProductsLoading,
  selectProductsErrors,
} from "../store/slices/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const isLoading = useSelector(selectProductsLoading);
  const errors = useSelector(selectProductsErrors);

  useEffect(() => {
    dispatch(getAllProductAction());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    dispatch(deleteProductAction(id));
  };

  if (isLoading) {
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

  if (errors) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{errors}</Alert>
      </Container>
    );
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
