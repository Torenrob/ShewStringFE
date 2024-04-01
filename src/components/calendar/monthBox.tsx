import { ReactNode, LegacyRef } from "react";
import DayBox from "./dayBox";
import { LocalMonth } from "./calendar";

export interface CalDate {
	date: number;
	dayOfWeek: number;
	month: number;
	monthName: string;
	year: number;
}

export default function MonthBox({
	monthObj,
	monthInd,
	monthYearLabelRef,
	endRef,
	ta,
	id,
}: {
	monthObj: LocalMonth;
	monthInd: number;
	monthYearLabelRef: LegacyRef<HTMLDivElement>;
	endRef?: LegacyRef<HTMLDivElement>;
	ta?: boolean;
	id?: string;
}): ReactNode {
	function getDaysOfMonth(monthObj: LocalMonth): number {
		return new Date(monthObj.year, monthObj.month, 0).getDate();
	}

	function getDate({ month, date }: { month: LocalMonth; date: number }): CalDate {
		const day = new Date(month.year, monthObj.month - 1, date).getDay();
		const dateObj: CalDate = {
			date: date,
			dayOfWeek: day + 1,
			month: month.month,
			monthName: month.monthName,
			year: month.year,
		};
		return dateObj;
	}

	const monthLength: number = getDaysOfMonth(monthObj);

	const alignMonths = {
		transform: `translateY(${monthInd * -128}px)`,
	};

	return (
		<div id={id} style={alignMonths} className={`grid grid-cols-3 monthBox`}>
			<div ref={monthYearLabelRef} className="col-start-1 calLabelContainer unfocusedLabel">
				<h1 className="calLabelText">{monthObj.year}</h1>
			</div>
			<div className="grid grid-cols-7">
				{[...Array(monthLength)].map((_, i) => {
					if (monthLength === i + 1) {
						return <DayBox ta={ta} endRef={endRef} date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} key={`DayBox${i}`} />;
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
