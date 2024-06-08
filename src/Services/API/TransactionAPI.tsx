import axios, { AxiosResponse } from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { PostTransactionAPIData, TransactionAPIData } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/transactions";

export const getAllTransactionsAPI = async (): Promise<Map<string, TransactionAPIData[]> | null> => {
	try {
		const data = await axios.get(api);
		const dataMap: Map<string, TransactionAPIData[]> = new Map(Object.entries(data.data));
		return dataMap;
	} catch (error) {
		ErrorHandler(error);
		return null;
	}
};

export const postTransactionAPI = async (transaction: PostTransactionAPIData): Promise<AxiosResponse | null> => {
	try {
		const data = await axios.post(api, transaction);
		return data;
	} catch (error) {
		ErrorHandler(error);
		return null;
	}
};
