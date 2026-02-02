import { Table, Button } from "react-bootstrap";

export default function ProductTable({ products, deleteProduct }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <Table striped bordered hover className="mt-5 text-center">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Free Shipping</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p, index) => (
          <tr key={index}>
            <td>{p.productName}</td>
            <td>{p.price}</td>
            <td>{p.quantity}</td>
            <td>{p.isFreeShipping ? "Yes" : "No"}</td>
            <td>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteProduct(index)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
