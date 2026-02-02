import axios from "axios";

const baseURL = "http://localhost:4000/products";

const getAllProduct = () => axios.get(baseURL);
const getProductById = (productId) => axios.get(`${baseURL}/${productId}`);
const addNewProduct = (product) => axios.post(baseURL, product);
const editProduct = (productId, product) =>
  axios.put(`${baseURL}/${productId}`, product);
const deleteProduct = (productId) => axios.delete(`${baseURL}/${productId}`);

export {
  getAllProduct,
  getProductById,
  addNewProduct,
  editProduct,
  deleteProduct,
};
