import axios from "axios";

const axiosClient = axios.create({
	baseURL: "http://localhost:4000/",
	withCredentials: true, // Send cookies with requests
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use(
	(config) => {
		// Include additional logic if needed, like adding headers
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response?.status === 401) {
			// Handle unauthorized errors (e.g., redirect to login)
			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
