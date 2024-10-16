import axios, {AxiosResponse} from "axios";
import {ErrorHandler} from "../../Helpers/ErrorHandler";
import {PostTransactionAPIData, TransactionAPIData} from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/transactions";
export const postTransactionAPI = async (transaction: PostTransactionAPIData): Promise<AxiosResponse | null> => {
	try {
		return await axios.post(api, transaction);
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

export const updateTransactionAPI = async (transaction: TransactionAPIData, userId: string, newDate?: string): Promise<AxiosResponse | null> => {
	let updateTransactionAPIData;
	if (newDate) {
		updateTransactionAPIData = { ...transaction, date: newDate, userId };
	} else {
		updateTransactionAPIData = transaction;
	}
	try {
		return await axios.put(api + `/${transaction.id}`, updateTransactionAPIData);
	} catch (error) {
		ErrorHandler(error);
		return null;
	}
};
