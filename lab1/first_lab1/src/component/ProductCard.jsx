import { Card } from "react-bootstrap";
import f1 from '../assets/f1.jpg'

export default function ProductCard() {
  return (
    <Card className="border-0 text-center">
      <Card.Img
        variant="top"
        src={f1}
      />
      <Card.Body>
        <Card.Title>T-shirt</Card.Title>
        <p>⭐⭐⭐⭐4.5/5</p>
        <h5>$120</h5>
      </Card.Body>
    </Card>
  );
}
