import axios, {AxiosResponse} from "axios";
import {ErrorHandler} from "../../Helpers/ErrorHandler";
import { Budget, Category, CreateCategory } from "../../Types/APIDataTypes";

const api = import.meta.env.VITE_API_URL + "/category";

export async function createCategoryNewBudgetAPI (cat: CreateCategory): Promise<Budget | void> {
  try {
    const resp: AxiosResponse<Budget> = await axios.get(api + "/newBudget");
    return resp.data;
  } catch (err) {
    ErrorHandler(err);
    return;
  }
}