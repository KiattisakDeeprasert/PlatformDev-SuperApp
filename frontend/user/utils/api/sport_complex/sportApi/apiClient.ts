import axios from "axios";


const apiClient = axios.create({
  baseURL: `http://192.168.129.73:8081/api`,
});

export default apiClient;