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

export const deleteTransactionAPI = async (transId: number): Promise<AxiosResponse | null> => {
	try {
		return await axios.delete(api + `/${transId}`);
	} catch (error) {
		ErrorHandler(error);
		return null;
	}
};

export const updateTransactionAPI = async (transaction: TransactionAPIData, newDate?: string): Promise<AxiosResponse | null> => {
	let updateTransactionAPIData;
	const { id, createdOn, time, ...TransactionData } = transaction;
	if (newDate) {
		updateTransactionAPIData = { ...TransactionData, date: newDate };
	} else {
		updateTransactionAPIData = TransactionData;
	}
	try {
		const data = await axios.put(api + `/${transaction.id}`, updateTransactionAPIData);

		return data;
	} catch (error) {
		ErrorHandler(error);
		return null;
	}
};
