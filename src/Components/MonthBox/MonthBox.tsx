import "./MonthBox.css";
import { ReactNode, Ref } from "react";
import DayBox from "../DayBox/DayBox.tsx";
import { TransactionAPIData } from "../../Types/APIDataTypes.tsx";
import { DateComponentInfo, LocalMonth } from "../../Types/CalendarTypes.tsx";

export default function MonthBox({
	monthObj,
	transactions,
	translateY,
	monthObserver,
	windowWidth,
	calChartWrapHeight,
}: {
	monthObj: LocalMonth;
	transactions: Map<string, TransactionAPIData[]>;
	translateY: number;
	monthObserver: Ref<HTMLDivElement>;
	windowWidth: string;
	calChartWrapHeight: number;
}): ReactNode {
	function getDaysOfMonth(monthObj: LocalMonth): number {
		return new Date(monthObj.year, monthObj.month, 0).getDate();
	}

	function getDate({ month, date }: { month: LocalMonth; date: number }): DateComponentInfo {
		const day = new Date(month.year, monthObj.month - 1, date).getDay();
		return {
			date: date,
			dayOfWeek: day + 1,
			month: month.month,
			monthName: month.monthName,
			year: month.year,
		};
	}

	const monthLength: number = getDaysOfMonth(monthObj);

	const translateYValue = windowWidth === "lg" || windowWidth === "md" ? (calChartWrapHeight * translateY) / 100 : monthObj.mobileY;

	return (
		<div ref={monthObserver} id={`${monthObj.year}-${monthObj.month.toString().padStart(2, "0")}`} className="monthBox" style={{ top: `-${translateYValue / 16}rem` }}>
			<div className="grid grid-cols-2 lg:grid-cols-7 static">
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
