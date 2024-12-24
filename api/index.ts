import axios from "axios";

const API_URL = "https://mavehiringserver.azurewebsites.net"; // Replace with your API base URL

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
