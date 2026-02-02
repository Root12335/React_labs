import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import ProductForm from "../pages/ProductForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Notfound from "../pages/Notfound";

export default function MainLayout() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/add" element={<ProductForm />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
