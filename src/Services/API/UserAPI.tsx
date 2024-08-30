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

export const userRegisterAPI = async ({ userName, password, firstName, lastName, email }: { userName: string; password: string; firstName: string; lastName: string; email: string }) => {
	console.log("ran");
	try {
		const data = await axios.post<UserProfile>(api + "/register", {
			userName: userName,
			password: password,
			firstName: firstName,
			lastName: lastName,
			email: email,
		});
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
		ErrorHandler(err);
	}
};
