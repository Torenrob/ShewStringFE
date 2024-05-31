import axios from "axios";
import { ErrorHandler } from "../Helpers/ErrorHandler";

const api = "http://localhost:5217/api";

export const transactionAPI = async () => {
	try {
		const data = await axios.get(`${api}/transactions`);
		return data;
	} catch (error) {
		ErrorHandler(error);
	}
};
