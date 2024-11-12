let headers = new Headers();
headers.append("Content-Type", "application/json");
class Http {
  constructor() {
    this.baseURL = "http://35.242.215.98:7001/API/";
    let token = localStorage.getItem("token");
    if (token) headers.set("Authorization", "Bearer "+token);
    this.options = {
   //   credentials: "include",
      method: "POST",
      headers: headers
    };
  }
  async get(endpoint) {
    this.options.method = "GET";
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    this.options.method = "POST";

    this.options.body = JSON.stringify(data);
    return this.request(endpoint);
  }
  async request(endpoint) {
    const url = this.baseURL + endpoint;
    //this.options.headers["Auth"] = localStorage.getItem('token') ?? '';

    try {
      const response = await fetch(url, this.options);
      this.resetOptions();

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }

  resetOptions() {
    this.options = {  method: "POST",  headers: headers };
  }
}
export default {
  install(app) {
    const http = new Http();
    app.config.globalProperties.$http = http;
    app.provide('$http', http)
  }
};
