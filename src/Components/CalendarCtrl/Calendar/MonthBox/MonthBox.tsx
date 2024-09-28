import { ReactNode, Ref } from "react";
import DayBox from "./DayBox/DayBox";
import { TransactionAPIData } from "../../../../Types/APIDataTypes";
import { DateComponentInfo, LocalMonth } from "../../../../Types/CalendarTypes";

export default function MonthBox({
	monthObj,
	transactions,
	translateY,
	monthObserver,
	windowWidth,
}: {
	monthObj: LocalMonth;
	transactions: Map<string, TransactionAPIData[]>;
	translateY: number;
	monthObserver: Ref<HTMLDivElement>;
	windowWidth: string;
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
		<div
			ref={monthObserver}
			id={`${monthObj.year}-${monthObj.month.toString().padStart(2, "0")}`}
			className={`monthBox`}
			style={{ top: `-${windowWidth == "lg" || windowWidth == "md" ? translateY : monthObj.mobileY}vh` }}>
			<div className="grid grid-cols-2 lg:grid-cols-7" style={{ position: "static" }}>
				{[...Array(monthLength)].map((_, i) => {
					return (
						<DayBox
							transactions={transactions}
							dayGridSpot={i % 2 == 0 ? monthObj.mobileStart : monthObj.mobileStart == 1 ? 2 : 1}
							date={i + 1}
							dateObj={getDate({ month: monthObj, date: i + 1 })}
							key={`DayBox${i}`}
						/>
					);
				})}
			</div>
		</div>
	);
}
