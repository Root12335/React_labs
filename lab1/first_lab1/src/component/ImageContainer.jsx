import { Image } from "react-bootstrap";
import c1 from "../assets/c1.png";




export default function ImageContainer() {
  return (
    <div className="bg-light rounded p-3">
      <h5 className="text-center">Casual</h5>
      <Image src={c1} className="w-100 rounded" />
    </div>
  );
}
