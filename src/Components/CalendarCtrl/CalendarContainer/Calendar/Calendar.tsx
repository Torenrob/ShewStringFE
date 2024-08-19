import { ReactNode, useState, useRef, useCallback, MutableRefObject, useEffect, Ref, Fragment, useContext } from "react";
import MonthBox from "./MonthBox/MonthBox";
import { calcDailyBalances, focusToday, getMonthName, setYtrans } from "../../../../Utilities/UtilityFuncs";
import { LocalMonth, MonthComponentInfo } from "../../../../Types/CalendarTypes";
import { TransactionAPIData } from "../../../../Types/APIDataTypes";
import { getAllTransactionsAPI } from "../../../../Services/API/TransactionAPI";
import { CalendarContext } from "../CalendarContainer";
import { ErrorHandler } from "../../../../Helpers/ErrorHandler";

//Break Down Current UTC Date into Local Date Object for Current User Calendar(U.S.)
function _getMonth(): LocalMonth {
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
	if (index == 12) {
		currentMonth.styleYtransition = setYtrans(index, prevYtrans, currentMonth);
		return currentMonth;
	}
	const monthObject: LocalMonth = currentMonth;
	const monthDiff: number = monthObject?.month + (index - 12);
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

export default function Calendar({ transactions }: { transactions: Map<string, TransactionAPIData[]> }): ReactNode {
	const [monthComps, setMonthComps] = useState<MonthComponentInfo[]>([]);
	const { dailyBalancesMap, dateTransactionsMap } = useContext(CalendarContext);

	const getTransactionData = useCallback(() => {
		dateTransactionsMap.current = transactions;
		dailyBalancesMap.current = calcDailyBalances(dateTransactionsMap.current!);
		let yTrans: number = 0;
		const monthArr = [...Array(23)].map((_, index) => {
			const month: LocalMonth = calcInitMonth({ index: index + 1, currentMonth: _getMonth(), prevYtrans: yTrans });
			yTrans = month.styleYtransition;
			const monthBoxObj: MonthComponentInfo = {
				monthObj: month,
				key: `${month?.monthName}${month?.year}`,
			};
			return monthBoxObj;
		});
		setMonthComps(monthArr);
	}, [dailyBalancesMap, dateTransactionsMap, transactions]);

	useEffect(() => {
		getTransactionData();
	}, [getTransactionData]);

	useEffect(() => focusToday(), []);

	//Intersect Observer to highlight current month/year label
	const labelObserver: MutableRefObject<IntersectionObserver | undefined> = useRef();
	labelObserver.current = new IntersectionObserver(
		async (entries: IntersectionObserverEntry[]) => {
			for (const entry of entries) {
				const targetClassList = entry?.target?.classList;
				targetClassList?.toggle("focusLabel", entry?.isIntersecting);
				if (targetClassList?.contains("col-start-1")) {
					targetClassList?.toggle("focusLabelLeft", entry?.isIntersecting);
				} else if (targetClassList?.contains("col-start-3")) {
					targetClassList?.toggle("focusLabelRight", entry?.isIntersecting);
				}
			}
		},
		{ threshold: 0.62 }
	);

	const addLabelObserver: Ref<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
		try {
			await labelObserver?.current?.observe(node);
		} catch {
			return;
		}
	}, []);

	function calcCalendarHeight(): number {
		if (monthComps.length === 0) return 0;

		const initCalHt: number = monthComps.reduce((prevMCHt, nextMC) => {
			const firstDayOfWk: number = new Date(nextMC.monthObj.year, nextMC.monthObj.month - 1, 1).getDay();
			const monthLength: number = new Date(nextMC.monthObj.year, nextMC.monthObj.month - 1, 0).getDate();
			const mnthHt: number = calcMnthHt(firstDayOfWk, monthLength);
			return prevMCHt + mnthHt;
		}, 0);

		return initCalHt - monthComps[monthComps.length - 1].monthObj.styleYtransition + 1;
	}

	return (
		<div key="Calendar" id="calendar" className="row-start-2 grid-column-3">
			<div className="grid labelGridContainer" style={{ maxHeight: `${calcCalendarHeight()}px` }}>
				{monthComps.map((monthBoxObj, index) => {
					return (
						<Fragment key={`month${index}`}>
							<div
								key={`leftLabel${index}`}
								ref={addLabelObserver}
								className="col-start-1 calLabelContainer unfocusedLabel"
								style={{ transform: `translateY(-${monthBoxObj.monthObj.styleYtransition}px` }}>
								<h1 key={`leftLabelTitle${index}`} className="calLabelText">
									{monthBoxObj.monthObj.monthName + "   " + monthBoxObj.monthObj.year}
								</h1>
							</div>
							<MonthBox transactions={transactions} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} translateY={monthBoxObj.monthObj.styleYtransition} />
							<div
								key={`rightLabel${index}`}
								ref={addLabelObserver}
								className="col-start-3 calLabelContainer unfocusedLabel"
								style={{ transform: `translateY(-${monthBoxObj.monthObj.styleYtransition}px` }}>
								<h1 key={`rightLabelTitle${index}`} className="calLabelText">
									{monthBoxObj.monthObj.monthName + "   " + monthBoxObj.monthObj.year}
								</h1>
							</div>
						</Fragment>
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
		if (lengthOfMnth === 28) {
			return 128 * 5;
		}
		return 128 * 6;
	}
}
