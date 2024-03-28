import { ReactNode, useRef, useCallback } from "react";
import DayBox from "./dayBox";
import { LocalMonth } from "./calendar";

export interface CalDate {
	date: number;
	dayOfWeek: number;
	month: number;
	monthName: string;
	year: number;
}

export default function MonthBox({ monthObj, monthInd, innerRef }: { monthObj: LocalMonth; monthInd: number; innerRef: any }): ReactNode {
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

	const alignMonths = {
		transform: `translateY(${monthInd * -13.75}vh)`,
	};

	const observer = useRef();
	observer.current = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				entry.target.classList.toggle("focusMonthCal", entry.isIntersecting);
			});
		},
		{ threshold: 0.7 }
	);

	const addObserver = useCallback(
		(node) => {
			observer?.current?.observe(node);
		},
		[alignMonths]
	);

	return (
		<div style={alignMonths} className="grid grid-cols-3 monthBox ">
			<div ref={innerRef} className="col-start-1 grid content-center">
				<h1 className="calLabelText">{monthObj.monthName}</h1>
			</div>
			<div className="grid grid-cols-7 ">
				{[...Array(getDaysOfMonth(monthObj))].map((_, i) => (
					<DayBox date={i + 1} dateObj={getDate({ month: monthObj, date: i + 1 })} key={`DayBox${i}`} />
				))}
			</div>
			<div ref={innerRef} className="col-start-3 grid content-center">
				<h1 className="calLabelText">{monthObj.year}</h1>
			</div>
		</div>
	);
}
