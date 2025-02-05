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

export async function getUserCategories(userId: string) {
	const resp: AxiosResponse<Category[]> = await axios.get(api + "/user/" + userId);
	return resp.data;
}

export async function createCategoryExistingBudgetAPI(cat: CreateCategory): Promise<Budget | null> {
	try {
		const resp: AxiosResponse<Budget> = await axios.post(api, cat);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return null;
	}
}

export async function deleteCategoryAPI(categoryId: number, userId: string): Promise<Budget | null> {
	try {
		const resp: AxiosResponse<Budget> = await axios.delete(api + "/" + categoryId + "/" + userId);
		return resp.data;
	} catch (err) {
		ErrorHandler(err);
		return null;
	}
}
