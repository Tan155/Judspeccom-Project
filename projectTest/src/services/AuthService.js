import axios from "axios";

class AuthService {
  // register
  async register(user) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          username: user.username,
          email: user.email,
          password: user.password,
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message);
      }
      throw new Error("An error occurred while registering");
    }
  }

  // Authentication
  async verifyOtp(email, otp) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/verify",
        {
          email,
          otp,
        }
      );

      if (response.status === 200) {
        return { message: "Verify Success", redirectTo: "/login" };
      } else if (response.status === 201) {
        return { message: "Verify Success", redirectTo: "/resetPassword" };
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    }
  }

  // loadUserFromServer
  async loadUserFromServer() {
    try {
      const response = await axios.get("http://localhost:5000/api/user/auth", {
        withCredentials: true,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return null;
    }
  }

  // Login
  async logIn(username, password) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        return { message: "Login Success", redirectTo: "/" };
      } else {
        throw new error("Unexpected response from server");
      }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Invalid login credentials."
      );
    }
  }

  // Logout
  async logOut() {
    try {
      await axios.post(
        "http://localhost:5000/api/user/logout",
        {},
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      console.log("Logout Error", error);
      return false;
    }
  }

  // Upload Profile Image
  async uploadProfileImage(email, imageBase64) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/upload",
        { email, imageBase64 },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        return response.data.profileImage; // return image data
      } else {
        throw new Error("Failed to upload profile image");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Image upload failed");
    }
  }

  // forgotPassword
  async forgotPassword(email) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/forgotPassword",
        {
          email,
        }
      );

      if (response.status === 200)
        return {
          message: "OTP SEND SUCCESS CHECK YOUR EMAIL",
          redirectTo: "/verify",
        };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Invalid login credentials."
      );
    }
  }

  // Reset Password
  async resetPasswordUser(email, password) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/resetPassword",
        {
          email,
          password,
        }
      );

      if (response.status === 200)
        return { message: "success", redirectTo: "/login" };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "An error occurred while registering"
      );
    }
  }
}

const authService = new AuthService();
export default authService;
