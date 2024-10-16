export interface LocalMonth {
	month: number;
	monthName: string;
	year: number;
	styleYtransition: number;
	mobileStart: number;
	mobileEnd: number;
	mobileY: number;
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
