import axios from "axios";

class ProductService {
  async getAllProducts() {
    const response = await axios.get("http://localhost:5000/api/products/");
  }
}
