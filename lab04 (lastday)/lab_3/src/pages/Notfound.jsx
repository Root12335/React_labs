import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <Container>
        <Row className="text-center">
          <Col md={12}>
            <div className="mb-4">
              <h1 className="display-1 fw-bold text-danger">404</h1>
              <h2 className="mb-3 text-dark">Page Not Found</h2>
              <p className="lead text-muted mb-4">
                Sorry, the page you're looking for doesn't exist. It might have
                been moved or deleted.
              </p>
            </div>
            <div
              className="p-5 bg-light rounded-lg"
              style={{ borderRadius: "15px" }}
            >
              <p className="text-muted mb-4">
                <i
                  className="bi bi-exclamation-triangle"
                  style={{ fontSize: "48px", color: "#ffc107" }}
                ></i>
              </p>
              <p className="mb-4 text-secondary">
                Use the button below to navigate back to the home page
              </p>
              <Link to="/">
                <Button variant="dark" size="lg" className="px-5">
                  <i className="bi bi-house-fill me-2"></i>
                  Back to Home
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
