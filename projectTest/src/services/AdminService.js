import axios from "axios";

class AdminService {
  //Show User
  async getUsers() {
    const response = await axios.post(
      "http://localhost:5000/api/admin/allUser"
    );
    return response.data;
  }
  // Delete User
  async deleteUser(email) {
    const response = await axios.delete(
      "http://localhost:5000/api/admin/deleteUser",
      {
        data: { email },
      }
    );
    return response;
  }

  // Show Computer
  async getAllProducts() {
    const response = await axios.get("http://localhost:5000/api/products");
    return response.data;
  }
  // Delete Computer
  async deleteProducts(id, category) {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/admin/deleteProduct",
        {
          data: { id, category },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
    }
  }

  // Add Product
  async addProducts(category, productData) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/addProducts",
        {
          category: category,
          productData: productData,
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}

const adminService = new AdminService();

export default adminService;
