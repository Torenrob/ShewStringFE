import { ReactNode, Ref } from "react";
import DayBox from "./DayBox";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import { DateComponentInfo, LocalMonth } from "../../Types/CalendarTypes";
import { Dropdown, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

export default function MonthBox({ monthObj, endRef, transactions, id }: { monthObj: LocalMonth; transactions: TransactionAPIData[]; endRef?: Ref<HTMLDivElement>; id?: string }): ReactNode {
	function getDaysOfMonth(monthObj: LocalMonth): number {
		return new Date(monthObj.year, monthObj.month, 0).getDate();
	}

	function getTransactions({ date, transactions }: { date: number; transactions: TransactionAPIData[] }): TransactionAPIData[] {
		const dateTransactions: TransactionAPIData[] = [];
		transactions.forEach((trans) => {
			if (trans.date.substring(8) === date.toString().padStart(2, "0")) {
				dateTransactions.push(trans);
			}
		});
		return dateTransactions;
	}

	function getDate({ month, date }: { month: LocalMonth; date: number }): DateComponentInfo {
		const day = new Date(month.year, monthObj.month - 1, date).getDay();
		const dateObj: DateComponentInfo = {
			date: date,
			dayOfWeek: day + 1,
			month: month.month,
			monthName: month.monthName,
			year: month.year,
			transactions: getTransactions({ date: date, transactions: transactions }),
		};
		return dateObj;
	}

	const monthLength: number = getDaysOfMonth(monthObj);

	const alignMonths = {
		transform: `translateY(-${monthObj.styleYtransition}px)`,
	};

	return (
		<div id={id} className="monthBox">
			<div className="grid grid-cols-7">
				{[...Array(monthLength)].map((_, i) => {
					if (monthLength === i + 1) {
						return <DayBox endRef={endRef} date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} key={`DayBox${i}`} />;
					} else {
						return <DayBox date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} key={`DayBox${i}`} />;
					}
				})}
			</div>
			{/* Hidden div to keep calendar from scrolling past last month rendered */}
			{endRef && <div className="h-px w-px" ref={endRef}></div>}
		</div>
	);
}
