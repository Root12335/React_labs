import { Row, Col } from "react-bootstrap";
import ImageContainer from "./ImageContainer";

export default function DressStyle() {
  return (
    <div className="container my-5 text-center">
      <h2 className="mb-4">Browse Dress Styles</h2>

      <Row className="g-4">
        <Col md={6}>
          <ImageContainer />
        </Col>
        <Col md={6}>
          <ImageContainer />
        </Col>
        <Col md={6}>
          <ImageContainer />
        </Col>
        <Col md={6}>
          <ImageContainer />
        </Col>
      </Row>
    </div>
  );
}
