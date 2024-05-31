import axios from "axios";

export const ErrorHandler = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		console.error(error.response?.data);
	}
};
