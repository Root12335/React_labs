import { Row, Col, Button } from "react-bootstrap";
import ProductCard from "./ProductCard";

export default function NewArrivals() {
  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4">NEW ARRIVALS</h2>

      <Row>
        <Col md={3}>
          <ProductCard />
        </Col>
        <Col md={3}>
          <ProductCard />
        </Col>
        <Col md={3}>
          <ProductCard />
        </Col>
        <Col md={3}>
          <ProductCard />
        </Col>
      </Row>

      <Button variant="outline-dark" className="mt-4">
        View All
      </Button>
    </div>
  );
}
