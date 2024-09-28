import axios from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { RegisterUserInfo, TransactionAPIData, UserProfile, UserProfile_BankAccts } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/user";

export const userLoginAPI = async (username: string, password: string) => {
	try {
		const data = await axios.post<UserProfile_BankAccts>(api + "/login", {
			userName: username,
			password: password,
		});
		data.data.bankAccounts.map((bA) => {
			const transMap: Map<string, TransactionAPIData[]> = new Map(Object.entries(bA.transactions));
			bA.transactions = transMap;
			return bA;
		});

		return data;
	} catch (err) {
		ErrorHandler(err);
	}
};

export const userRegisterAPI = async (registerUser: RegisterUserInfo) => {
	try {
		const data = await axios.post<UserProfile>(api + "/register", registerUser);
		return data;
	} catch (err) {
		ErrorHandler(err);
	}
};
