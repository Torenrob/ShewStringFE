import axios, { AxiosResponse } from "axios";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { Budget, Category, CreateCategory } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/category";

export async function createCategoryNewBudgetAPI(cat: CreateCategory): Promise<Budget | void> {
	try {
		const resp: AxiosResponse<Budget> = await axios.post(api + "/newBudget", cat);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return;
	}
}

export async function createCategoryExistingBudgetAPI(cat: CreateCategory): Promise<Budget | void> {
	try {
		const resp: AxiosResponse<Budget> = await axios.post(api, cat);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return;
	}
}
