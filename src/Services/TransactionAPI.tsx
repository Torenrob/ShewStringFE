import axios from "axios";
import { ErrorHandler } from "../Helpers/ErrorHandler";
import { TransactionAPIData } from "../types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/transactions";

export const getAllTransactionsAPI = async (): Promise<TransactionAPIData[] | null> => {
	try {
		const data = await axios.get(api);
		return data.data;
	} catch (error) {
		ErrorHandler(error);
		return null;
	}
};
