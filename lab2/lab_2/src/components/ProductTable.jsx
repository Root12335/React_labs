import { Table, Button, Badge } from "react-bootstrap";

export default function ProductTable({ products, onDeleteProduct }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <span className="fw-semibold">Products</span>
        <Badge bg="light" text="dark">
          {products.length} item{products.length === 1 ? "" : "s"}
        </Badge>
      </div>

      <div className="card-body p-0">
        <Table responsive hover className="mb-0 align-middle text-center">
          <thead className="table-light">
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
                <td className="text-start ps-4">{p.productName}</td>
                <td>${Number(p.price).toFixed(2)}</td>
                <td>{p.quantity}</td>
                <td>
                  <Badge bg={p.isFreeShipping ? "success" : "secondary"}>
                    {p.isFreeShipping ? "Yes" : "No"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDeleteProduct(index)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
