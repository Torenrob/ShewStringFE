import axios from "axios";

export const ErrorHandler = (error: unknown) => {
	if (axios.isAxiosError(error)) {
		alert(error.response?.data);
		console.error(error.response);
	}
};
