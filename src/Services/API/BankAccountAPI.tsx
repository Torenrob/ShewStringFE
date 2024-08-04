import axios from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { BankAccountAPIData } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/bankaccounts";

export const getAllBankAccountsAPI = async (): Promise<BankAccountAPIData[]> => {
	try {
		const data = await axios.get(api);
		return data.data;
	} catch (error) {
		ErrorHandler(error);
		return [];
	}
};
