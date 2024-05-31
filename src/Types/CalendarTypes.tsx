import { TransactionAPIData } from "./APIDataTypes";

export interface LocalMonth {
	month: number;
	monthName: string;
	year: number;
	styleYtransition: number;
}

export interface MonthComponentInfo {
	monthObj: LocalMonth;
	transactions: TransactionAPIData[];
	key: string;
}

export interface DateComponentInfo {
	date: number;
	dayOfWeek: number;
	month: number;
	monthName: string;
	year: number;
	transactions: TransactionAPIData[];
}

export interface CalendarRenderInfo {
	monthComponents: MonthComponentInfo[];
	calendarLoading: boolean;
}
