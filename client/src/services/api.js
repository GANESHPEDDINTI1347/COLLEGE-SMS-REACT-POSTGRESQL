import axios from "axios";

const API = axios.create({
  baseURL: "https://college-sms-react-postgresql.onrender.com"
});

export default API;