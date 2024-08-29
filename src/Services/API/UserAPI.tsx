import axios from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { UserProfile } from "../../Types/APIDataTypes";

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

export const userRegisterAPI = async ({ username, password, firstname, lastname, email }: { username: string; password: string; firstname: string; lastname: string; email: string }) => {
	try {
		const data = await axios.post<UserProfile>(api + "/login", {
			userName: username,
			password: password,
			firstName: firstname,
			lastName: lastname,
			email: email,
		});
		return data;
	} catch (err) {
		ErrorHandler(err);
	}
};
