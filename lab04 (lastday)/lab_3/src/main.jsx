import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { myStore } from "./store";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import MainLayout from "./layout/MainLayout";

createRoot(document.getElementById("root")).render(
  <Provider store={myStore}>
    <MainLayout />
  </Provider>
);
