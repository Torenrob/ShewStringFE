import { TransactionAPIData } from "./APIDataTypes";

export interface LocalMonth {
	month: number;
	monthName: string;
	year: number;
	styleYtransition: number;
}

export interface MonthComponentInfo {
	monthObj: LocalMonth;
	key: string;
}

export interface DateComponentInfo {
	date: number;
	dayOfWeek: number;
	month: number;
	monthName: string;
	year: number;
}

export interface CalendarRenderInfo {
	monthComponents: MonthComponentInfo[];
	calendarLoading: boolean;
}
