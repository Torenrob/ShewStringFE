import axios from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { RegisterUserInfo, UserProfile } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/user";

export const userLoginAPI = async (username: string, password: string) => {
	try {
		const data = await axios.post<UserProfile>(api + "/login", {
			userName: username,
			password: password,
		});
		return data;
	} catch (err) {
		ErrorHandler(err);
	}
};

export const userRegisterAPI = async (registerUser: RegisterUserInfo) => {
	try {
		const data = await axios.post<UserProfile>(api + "/register", registerUser);
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
		ErrorHandler(err);
	}
};
