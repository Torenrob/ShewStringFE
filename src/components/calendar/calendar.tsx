import { ReactNode, useState } from "react";
import MonthBox from "./monthBox";
import { getMonthName } from "../../utils/utils";

export interface LocalMonth {
	month: number;
	monthName: string;
	year: number;
}

//Break Down Current UTC Date into Local Date Object for Current User Calendar(U.S.)
function _getMonth(): LocalMonth {
	const locString: string = new Date().toLocaleDateString();
	const monthNumber: number = Number(locString.match(/^([^/]+)/)![0]);
	const monthObject: LocalMonth = {
		month: monthNumber,
		monthName: getMonthName(monthNumber),
		year: Number(locString.match(/\/(\d{4})$/)![1]),
	};

	return monthObject;
}

function calcMonth({ index, monthArr }: { index?: number | undefined; monthArr?: undefined | ReactNode[] }): LocalMonth {
	if (index) {
		if (index == 4) return _getMonth();
		const monthObject: LocalMonth = _getMonth();
		const diff: number = monthObject.month + (index - 4);
		if (diff <= 12 && diff >= 1) {
			monthObject.month = diff;
			monthObject.monthName = getMonthName(monthObject.month);
			return monthObject;
		} else {
			if (diff > 12) {
				monthObject.month = diff - 12;
				monthObject.monthName = getMonthName(monthObject.month);
				monthObject.year++;
				return monthObject;
			} else {
				monthObject.month = 12 + diff;
				monthObject.monthName = getMonthName(monthObject.month);
				monthObject.year--;
				return monthObject;
			}
		}
	}

	return _getMonth();
}

export default function Calendar(): ReactNode {
	const [monthComps, setMonthComps] = useState(
		[...Array(7)].map((_, index) => {
			const month: LocalMonth = calcMonth({ index: index + 1 });
			return <MonthBox monthObj={month} key={`${month.monthName}${month.year}`} monthInd={index} />;
		})
	);

	return (
		<div key="Calendar" className={`calendar`}>
			{monthComps.map((monthDiv) => monthDiv)}
		</div>
	);
}
