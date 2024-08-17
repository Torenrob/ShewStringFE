import axios, { AxiosResponse } from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { BankAccountAPIData, TransactionAPIData } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/bankaccounts";

export const getAllBankAccountsAPI = async (): Promise<BankAccountAPIData[]> => {
	try {
		const data: AxiosResponse<BankAccountAPIData[]> = await axios.get(api);
		data.data.forEach((bA) => {
			const transMap: Map<string, TransactionAPIData[]> = new Map(Object.entries(bA.transactions));
			bA.transactions = transMap;
		});
		return data.data;
	} catch (error) {
		ErrorHandler(error);
		return [];
	}
};
