import axiosInstance from "axios";

axiosInstance.interceptors.request.use(
	function (config: any) {
		config.baseURL = process.env.API_PORT;

		return config;
	},
	async function (error: any) {
		return Promise.reject(error);
	},
);

export default axiosInstance;
