export interface BudgetTransaction {
	id: string;
	title: string;
	date: number;
	month: number;
	year: number;
	amount: number;
	type: "debit" | "credit";
}

export interface LocalMonth {
	month: number;
	monthName: string;
	year: number;
	styleYtransition: number;
}

export interface MonthComponentInfo {
	monthObj: LocalMonth;
	transactions: BudgetTransaction[];
	key: string;
}

export interface DateComponentInfo {
	date: number;
	dayOfWeek: number;
	month: number;
	monthName: string;
	year: number;
	transactions: BudgetTransaction[];
}

export interface CalendarRenderInfo {
	monthComponents: MonthComponentInfo[];
	calendarLoading: boolean;
}
