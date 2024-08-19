import { ReactNode, Ref } from "react";
import DayBox from "./DayBox/DayBox";
import { TransactionAPIData } from "../../../../../Types/APIDataTypes";
import { DateComponentInfo, LocalMonth } from "../../../../../Types/CalendarTypes";

export default function MonthBox({
	monthObj,
	transactions,
	translateY,
}: {
	monthObj: LocalMonth;
	transactions: Map<string, TransactionAPIData[]>;
	translateY: number;
	endRef?: Ref<HTMLDivElement>;
	id?: string;
}): ReactNode {
	function getDaysOfMonth(monthObj: LocalMonth): number {
		return new Date(monthObj.year, monthObj.month, 0).getDate();
	}

	function getDate({ month, date }: { month: LocalMonth; date: number }): DateComponentInfo {
		const day = new Date(month.year, monthObj.month - 1, date).getDay();
		const dateObj: DateComponentInfo = {
			date: date,
			dayOfWeek: day + 1,
			month: month.month,
			monthName: month.monthName,
			year: month.year,
		};
		return dateObj;
	}

	const monthLength: number = getDaysOfMonth(monthObj);

	return (
		<div id={`${monthObj.year}-${monthObj.month.toString().padStart(2, "0")}`} className="monthBox" style={{ top: -translateY }}>
			<div className="grid grid-cols-7" style={{ position: "static" }}>
				{[...Array(monthLength)].map((_, i) => {
					if (monthLength === i + 1) {
						return <DayBox transactions={transactions} date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} mthLength={monthLength} key={`DayBox${i}`} />;
					} else {
						return <DayBox transactions={transactions} date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} mthLength={monthLength} key={`DayBox${i}`} />;
					}
				})}
			</div>
		</div>
	);
}
