import axios, { AxiosResponse } from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { BankAccountAPIData, TransactionAPIData } from "../../Types/APIDataTypes";
import { string } from "yup";

const api = import.meta.env.VITE_API_URL + "/bankaccounts";

export const getAllBankAccountsAPI = async (): Promise<BankAccountAPIData[]> => {
	try {
		const resp: AxiosResponse<BankAccountAPIData[]> = await axios.get(api);
		resp.data.map((bA) => {
			const transMap: Map<string, TransactionAPIData[]> = new Map(Object.entries(bA.transactions));
			bA.transactions = transMap;
			return bA;
		});
		return resp.data;
	} catch (error) {
		ErrorHandler(error);
		return [];
	}
};

export const getUserBankAccountsAPI = async (userId: string): Promise<BankAccountAPIData[]> => {
	try {
		const resp: AxiosResponse<BankAccountAPIData[]> = await axios.get(api + "/user/" + userId);

		console.log("ran");
		resp.data.map((bA) => {
			const transMap: Map<string, TransactionAPIData[]> = new Map(Object.entries(bA.transactions));
			bA.transactions = transMap;
			return bA;
		});
		return resp.data;
	} catch (error) {
		ErrorHandler(error);
		return [];
	}
};

export const createBankAccountAPI = async (bankAcctInfo: { title: string; accountType: number; userId: string }): Promise<BankAccountAPIData> => {
	try {
		const resp: AxiosResponse<BankAccountAPIData> = await axios.post(api, bankAcctInfo);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return {} as BankAccountAPIData;
	}
};

export const deleteBankAccountAPI = async (bankAccountInfo: BankAccountAPIData): Promise<string> => {
	try {
		const resp: AxiosResponse<string> = await axios.delete(api + `/${bankAccountInfo.id}`);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return "";
	}
};
