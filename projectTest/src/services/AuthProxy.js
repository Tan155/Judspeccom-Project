import axios from "axios";
class API {
  constructor() {
    this.email = null;
  }
  async request() {
    const response = await axios.get("http://localhost:5000/api/user/check", {
      withCredentials: true,
    });
    if (response.status === 200 || response.status === 201) {
      this.email = response.data;
      return this.email;
    }
    return null;
  }

  getEmail() {
    return this.email;
  }
}

class APIProxy {
  constructor(api) {
    this.api = api;
  }
  async request() {
    const response = await this.api.request();
    // console.log("APIProxy Received Email:", response);
    if (response) {
      return response;
    } else {
      return response;
    }
  }
}

const apiProxy = new APIProxy(new API());

export default apiProxy;
