import { ReactNode, Ref } from "react";
import DayBox from "./dayBox";
import { BudgetTransaction, LocalMonth } from "../../types/types";
import { DateComponentInfo } from "../../types/types";

export default function MonthBox({
	monthObj,
	monthYearLabelRef,
	endRef,
	transactions,
	id,
}: {
	monthObj: LocalMonth;
	monthYearLabelRef: Ref<HTMLDivElement>;
	transactions: BudgetTransaction[];
	endRef?: Ref<HTMLDivElement>;
	id?: string;
}): ReactNode {
	function getDaysOfMonth(monthObj: LocalMonth): number {
		return new Date(monthObj.year, monthObj.month, 0).getDate();
	}

	function getTransactions({ date, transactions }: { date: number; transactions: BudgetTransaction[] }): BudgetTransaction[] {
		const dateTransactions: BudgetTransaction[] = [];
		transactions.forEach((trans) => {
			if (trans.date === date) {
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
		<div id={id} style={alignMonths} className={`grid grid-cols-3 monthBox`}>
			<div ref={monthYearLabelRef} className="col-start-1 calLabelContainer unfocusedLabel">
				<h1 className="calLabelText">{monthObj.year}</h1>
			</div>
			<div className="grid grid-cols-7">
				{[...Array(monthLength)].map((_, i) => {
					if (monthLength === i + 1) {
						return <DayBox endRef={endRef} date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} key={`DayBox${i}`} />;
					} else {
						return <DayBox date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} key={`DayBox${i}`} />;
					}
				})}
			</div>
			<div ref={monthYearLabelRef} className="col-start-3 calLabelContainer unfocusedLabel">
				<h1 className="calLabelText">{monthObj.monthName}</h1>
			</div>
			{endRef && <div className="h-px w-px" ref={endRef}></div>}
		</div>
	);
}
