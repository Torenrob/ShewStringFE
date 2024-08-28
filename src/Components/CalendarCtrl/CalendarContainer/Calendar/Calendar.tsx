import { ReactNode, useState, useRef, useCallback, MutableRefObject, useEffect, Ref, Fragment, useContext } from "react";
import MonthBox from "./MonthBox/MonthBox";
import { calcDailyBalances, focusToday, getMonthName, setYtrans } from "../../../../Utilities/UtilityFuncs";
import { LocalMonth, MonthComponentInfo } from "../../../../Types/CalendarTypes";
import { TransactionAPIData } from "../../../../Types/APIDataTypes";
import { getAllTransactionsAPI } from "../../../../Services/API/TransactionAPI";
import { ErrorHandler } from "../../../../Helpers/ErrorHandler";
import { CalendarContext, MonthRange } from "../../CalendarCtrl";

//Break Down Current UTC Date into Local Date Object for Current User Calendar(U.S.)
function _getCurrMonth(): LocalMonth {
	const locString: string = new Date()?.toLocaleDateString();
	const monthNumber: number = Number(locString?.match(/^([^/]+)/)![0]);
	const yearNumber: number = Number(locString?.match(/\/(\d{4})$/)![1]);
	const monthObject: LocalMonth = {
		month: monthNumber,
		monthName: getMonthName(monthNumber),
		year: yearNumber,
		styleYtransition: 0,
	};

	return monthObject;
}

//Calculate Month Comp arr on initialization
function calcInitMonth({ index, currentMonth, prevYtrans }: { index: number; currentMonth: LocalMonth; prevYtrans: number }): LocalMonth {
	if (index == 7) {
		currentMonth.styleYtransition = setYtrans(index, prevYtrans, currentMonth);
		return currentMonth;
	}
	const monthObject: LocalMonth = currentMonth;
	const monthDiff: number = monthObject?.month + (index - 7);
	const yearDiff: number = monthDiff % 12 === 0 ? Math.floor(monthDiff / 12) - 1 : Math.floor(monthDiff / 12);
	if (monthDiff <= 12 && monthDiff >= 1) {
		monthObject.month = monthDiff;
		monthObject.monthName = getMonthName(monthObject?.month);
		monthObject.styleYtransition = setYtrans(index, prevYtrans, monthObject);
		return monthObject;
	} else {
		if (monthDiff > 12) {
			monthObject.month = monthDiff % 12 === 0 ? 12 : monthDiff % 12;
			monthObject.monthName = getMonthName(monthObject?.month);
			monthObject.year = monthObject.year + yearDiff;
			monthObject.styleYtransition = setYtrans(index, prevYtrans, monthObject);
			return monthObject;
		} else {
			monthObject.month = 12 + monthDiff == 0 ? 12 : monthDiff > -12 ? 12 + monthDiff : 12 + (monthDiff % 12);
			monthObject.monthName = getMonthName(monthObject?.month);
			monthObject.year = monthObject.year + yearDiff;
			monthObject.styleYtransition = setYtrans(index, prevYtrans, monthObject);
			return monthObject;
		}
	}
}

function mkMonthCompInfo(monthInfo: Date, prevYTrans: number, index: number): MonthComponentInfo {
	const monthHold: LocalMonth = { month: monthInfo.getMonth() + 1, year: monthInfo.getFullYear(), monthName: "", styleYtransition: 0 };

	const monthObj: LocalMonth = {
		month: monthHold.month,
		monthName: getMonthName(monthHold.month),
		year: monthHold.year,
		styleYtransition: setYtrans(index, prevYTrans, monthHold),
	};

	const monthComponentInfo: MonthComponentInfo = {
		monthObj: monthObj,
		key: `${monthObj?.monthName}${monthObj?.year}`,
	};

	return monthComponentInfo;
}

function calcInputMonths(startDate: Date, endDate: Date): MonthComponentInfo[] {
	const startYear = startDate.getFullYear();
	const startMonth = startDate.getMonth();
	const endYear = endDate.getFullYear();
	const endMonth = endDate.getMonth();

	const yearDifference = endYear - startYear;
	const monthDifference = endMonth - startMonth;

	const numOfMnths = yearDifference * 12 + monthDifference + 1;

	let yTrans: number = 0;

	const mArr = [...Array(numOfMnths)].map((_, i) => {
		const newMonth = returnMonthYr(startMonth + i, startYear);
		const monthComp = mkMonthCompInfo(newMonth, yTrans, i + 1);
		yTrans = monthComp.monthObj.styleYtransition;
		return monthComp;
	});

	return mArr;
}

function returnMonthYr(compMonthNum: number, year: number): Date {
	if (compMonthNum >= 0 && compMonthNum <= 11) {
		return new Date(`${year}-${compMonthNum + 1}-1`);
	} else {
		return returnMonthYr(compMonthNum - 12, year + 1);
	}
}

export default function Calendar({
	transactions,
	monthRange,
	monthLabelCntl,
}: {
	transactions: Map<string, TransactionAPIData[]>;
	monthRange: MonthRange | null;
	monthLabelCntl: (a: string[]) => void;
}): ReactNode {
	const [monthComps, setMonthComps] = useState<MonthComponentInfo[]>([]);
	const { dailyBalancesMap, dateTransactionsMap } = useContext(CalendarContext);

	const getTransactionData = useCallback(() => {
		dateTransactionsMap.current = transactions;
		dailyBalancesMap.current = calcDailyBalances(dateTransactionsMap.current!);
		let yTrans: number = 0;

		if (!monthRange) {
			const monthArr = [...Array(13)].map((_, index) => {
				const month: LocalMonth = calcInitMonth({ index: index + 1, currentMonth: _getCurrMonth(), prevYtrans: yTrans });
				yTrans = month.styleYtransition;
				const monthBoxObj: MonthComponentInfo = {
					monthObj: month,
					key: `${month?.monthName}${month?.year}`,
				};
				return monthBoxObj;
			});
			setMonthComps(monthArr);
		} else {
			setMonthComps((p) => calcInputMonths(new Date(monthRange.startMonth + "-1"), new Date(monthRange.endMonth + "-1")));
		}
	}, [dailyBalancesMap, dateTransactionsMap, transactions, monthRange]);

	useEffect(() => {
		getTransactionData();
	}, [getTransactionData]);

	useEffect(() => focusToday(), []);

	//Intersect Observer to highlight current month/year label
	const monthObserver: MutableRefObject<IntersectionObserver | undefined> = useRef();
	monthObserver.current = new IntersectionObserver(
		async (entries: IntersectionObserverEntry[]) => {
			const monthLabels: string[] = [];
			entries.forEach((entry, i) => {
				const target = entry?.target;
				target.classList?.toggle("focusMonth", entry?.isIntersecting);
				if (target.classList.contains("focusMonth")) {
					monthLabels.push(target.id);
				}
			});
			if (monthLabels.length > 0) {
				monthLabelCntl(monthLabels);
			}
		},
		{ threshold: 0.62 }
	);

	const monthRef: Ref<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
		try {
			await monthObserver?.current?.observe(node);
		} catch {
			return;
		}
	}, []);

	function calcCalendarHeight(): number {
		if (monthComps.length === 0) return 0;

		const initCalHt: number = monthComps.reduce((prevMCHt, nextMC) => {
			const firstDayOfWk: number = new Date(nextMC.monthObj.year, nextMC.monthObj.month - 1, 1).getDay();
			const monthLength: number = new Date(nextMC.monthObj.year, nextMC.monthObj.month, 0).getDate();
			const mnthHt: number = calcMnthHt(firstDayOfWk, monthLength);
			return prevMCHt + mnthHt;
		}, 0);

		return initCalHt - monthComps[monthComps.length - 1].monthObj.styleYtransition + 1;
	}

	return (
		<div key="Calendar" id="calendar" className="row-start-2 grid-column-3">
			<div className="calMonthsContainer" style={{ maxHeight: `${calcCalendarHeight()}px` }}>
				{monthComps.map((monthBoxObj, index) => {
					return (
						// <Fragment key={`month${index}`}>
						// 	<div
						// 		key={`leftLabel${index}`}
						// 		ref={addLabelObserver}
						// 		className="col-start-1 calLabelContainer unfocusedLabel"
						// 		style={{ transform: `translateY(-${monthBoxObj.monthObj.styleYtransition}px` }}>
						// 		<h1 key={`leftLabelTitle${index}`} className="calLabelText">
						// 			{monthBoxObj.monthObj.monthName + "   " + monthBoxObj.monthObj.year}
						// 		</h1>
						// 	</div>
						<MonthBox transactions={transactions} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} translateY={monthBoxObj.monthObj.styleYtransition} monthObserver={monthRef} />
						// 	<div
						// 		key={`rightLabel${index}`}
						// 		ref={addLabelObserver}
						// 		className="col-start-3 calLabelContainer unfocusedLabel"
						// 		style={{ transform: `translateY(-${monthBoxObj.monthObj.styleYtransition}px` }}>
						// 		<h1 key={`rightLabelTitle${index}`} className="calLabelText">
						// 			{monthBoxObj.monthObj.monthName + "   " + monthBoxObj.monthObj.year}
						// 		</h1>
						// 	</div>
						// </Fragment>
					);
				})}
			</div>
		</div>
	);
}

function calcMnthHt(monStDayOfWk: number, lengthOfMnth: number): number {
	if (monStDayOfWk === 0) {
		if (lengthOfMnth === 28) {
			return 128 * 4;
		} else {
			return 128 * 5;
		}
	} else if (monStDayOfWk === 1 || (monStDayOfWk > 1 && monStDayOfWk < 4) || monStDayOfWk === 4) {
		return 128 * 5;
	} else if (monStDayOfWk === 5) {
		if (lengthOfMnth <= 30) {
			return 128 * 5;
		} else {
			return 128 * 6;
		}
	} else {
		if (lengthOfMnth <= 29) {
			return 128 * 5;
		}
		return 128 * 6;
	}
}
