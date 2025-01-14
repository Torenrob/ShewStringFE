import axios, { AxiosResponse } from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { Budget, Category, CreateCategory } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/category";

export async function createCategoryNewBudgetAPI(cat: CreateCategory): Promise<Budget | null> {
	try {
		const resp: AxiosResponse<Budget> = await axios.post(api + "/newBudget", cat);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return null;
	}
}

export async function createCategoryExistingBudgetAPI(cat: CreateCategory): Promise<Budget | null> {
	try {
		console.log("ran api");
		const resp: AxiosResponse<Budget> = await axios.post(api, cat);
		console.log(resp);
		console.log(resp.data);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return null;
	}
}
