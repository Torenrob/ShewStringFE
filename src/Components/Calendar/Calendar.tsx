import "./Calendar.css"
import {MutableRefObject, ReactNode, Ref, useCallback, useContext, useEffect, useRef, useState} from "react";
import MonthBox from "../MonthBox/MonthBox.tsx";
import {
	calcDailyBalances,
	createMonthObject,
	focusToday,
	getMonthName,
	setMobileProps,
	setYtrans
} from "../../Utilities/UtilityFuncs.tsx";
import {LocalMonth, MonthComponentInfo} from "../../Types/CalendarTypes.tsx";
import {TransactionAPIData} from "../../Types/APIDataTypes.tsx";
import {CalendarContext, MonthRange} from "../CalendarCtrl/CalendarCtrlExports.tsx";
import {dayBoxHeight} from "../../Utilities/GlobalVariables.tsx";

//Break Down Current UTC Date into Local Date Object for Current User Calendar(U.S.)
function _getCurrMonth(): LocalMonth {
	const locString: string = new Date()?.toLocaleDateString();
	const monthNumber: number = Number(locString?.match(/^([^/]+)/)![0]);
	const yearNumber: number = Number(locString?.match(/\/(\d{4})$/)![1]);
	return {
		month: monthNumber,
		monthName: getMonthName(monthNumber),
		year: yearNumber,
		styleYtransition: 0,
		mobileEnd: 0,
		mobileStart: 0,
		mobileY: 0,
	};
}

//Calculate Month Comp arr on initialization
function calcInitMonth({index,currentMonth,prevYtrans,prevMobileY,prevMobileEnd,}: {index: number;currentMonth: LocalMonth;
	prevYtrans: number;
	prevMobileY: number;
	prevMobileEnd: number;
}): LocalMonth {
	if (index === 7) {
		return applyIndexSeven(currentMonth, index, prevYtrans, prevMobileY, prevMobileEnd);
	}

	const monthDiff = currentMonth.month + (index - 7);
	const yearDiff = Math.floor((monthDiff - 1) / 12);

	if (monthDiff >= 1 && monthDiff <= 12) {
		return updateMonthObject(currentMonth, index, prevYtrans, prevMobileY, prevMobileEnd, monthDiff, 0);
	}

	const adjustedMonth = monthDiff > 12 ? monthDiff % 12 || 12 : 12 + (monthDiff % 12);
	return updateMonthObject(currentMonth, index, prevYtrans, prevMobileY, prevMobileEnd, adjustedMonth, yearDiff);
}

function applyIndexSeven(currentMonth: LocalMonth,index: number,prevYtrans: number, prevMobileY: number,prevMobileEnd: number
): LocalMonth {
	currentMonth.styleYtransition = setYtrans(index, prevYtrans, currentMonth);
	const { mobileY, mobileStart, mobileEnd } = setMobileProps(index, prevMobileY, prevMobileEnd, currentMonth);
	return { ...currentMonth, mobileY, mobileStart, mobileEnd };
}

function updateMonthObject(currentMonth: LocalMonth,index: number,prevYtrans: number,prevMobileY: number,prevMobileEnd: number,
	month: number,
	yearDiff: number
): LocalMonth {
	const updatedMonth = { ...currentMonth };
	updatedMonth.month = month;
	updatedMonth.monthName = getMonthName(month);
	updatedMonth.year += yearDiff;
	updatedMonth.styleYtransition = setYtrans(index, prevYtrans, updatedMonth);

	const mobileProps = setMobileProps(index, prevMobileY, prevMobileEnd, updatedMonth);
	return createMonthObject(updatedMonth, index, prevYtrans, mobileProps);
}

function mkMonthCompInfo(monthInfo: Date, prevYTrans: number, index: number, prevMobileY: number, prevMobileEnd: number): MonthComponentInfo {
	const monthHold: LocalMonth = { month: monthInfo.getMonth() + 1, year: monthInfo.getFullYear(), monthName: "", styleYtransition: 0, mobileStart: 0, mobileEnd: 0, mobileY: 0 };

	const { mobileStart, mobileEnd, mobileY } = setMobileProps(index, prevMobileY, prevMobileEnd, monthHold);

	const monthObj: LocalMonth = {
		month: monthHold.month,
		monthName: getMonthName(monthHold.month),
		year: monthHold.year,
		styleYtransition: setYtrans(index, prevYTrans, monthHold),
		mobileEnd: mobileEnd,
		mobileStart: mobileStart,
		mobileY: mobileY,
	};

	return {
		monthObj: monthObj,
		key: `${monthObj?.monthName}${monthObj?.year}`,
	};
}

function calcInputMonths(startDate: Date, endDate: Date): MonthComponentInfo[] {
	const startYear = startDate.getFullYear();
	const startMonth = startDate.getMonth();
	const endYear = endDate.getFullYear();
	const endMonth = endDate.getMonth();

	const yearDifference = endYear - startYear;
	const monthDifference = endMonth - startMonth;

	const numOfMnths = yearDifference * 12 + monthDifference + 1;

	let prevYTrans: number = 0;
	let prevMobileY: number = 0;
	let prevMobileEnd: number = 0;

	return [...Array(numOfMnths)].map((_, i) => {
		const newMonth = returnMonthYr(startMonth + i, startYear);
		const monthComp = mkMonthCompInfo(newMonth, prevYTrans, i + 1, prevMobileY, prevMobileEnd);
		prevYTrans = monthComp.monthObj.styleYtransition;
		prevMobileY = monthComp.monthObj.mobileY;
		prevMobileEnd = monthComp.monthObj.mobileEnd;
		return monthComp;
	});
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
	const [windowWidth, setWindowWidth] = useState(window.innerWidth >= 1024 ? "lg" : window.innerWidth >= 768 ? "md" : "sm");
	const [monthComps, setMonthComps] = useState<MonthComponentInfo[]>([]);
	const { dailyBalancesMap, dateTransactionsMap } = useContext(CalendarContext);

	const getTransactionData = useCallback(() => {
		dateTransactionsMap.current = transactions;
		dailyBalancesMap.current = calcDailyBalances(dateTransactionsMap.current!);
		let prevY: number = 0;
		let prevMobileY: number = 0;
		let prevMobileEnd: number = 0;

		if (!monthRange) {
			const monthArr = [...Array(13)].map((_, index) => {
				const month: LocalMonth = calcInitMonth({ index: index + 1, currentMonth: _getCurrMonth(), prevYtrans: prevY, prevMobileEnd: prevMobileEnd, prevMobileY: prevMobileY });
				prevY = month.styleYtransition;
				prevMobileY = month.mobileY;
				prevMobileEnd = month.mobileEnd;
				const monthBoxObj: MonthComponentInfo = {
					monthObj: month,
					key: `${month?.monthName}${month?.year}`,
				};
				return monthBoxObj;
			});
			setMonthComps(monthArr);
		} else {
			setMonthComps(() => calcInputMonths(new Date(monthRange.startMonth + "-1"), new Date(monthRange.endMonth + "-1")));
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
			entries.forEach((entry) => {
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
			monthObserver?.current?.observe(node);
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

	function handleWindowResize() {
		const newSize = window.innerWidth >= 1024 ? "lg" : window.innerWidth >= 768 ? "md" : "sm";

		if (newSize != windowWidth) {
			setWindowWidth(newSize);
		}
	}

	window.addEventListener("resize", handleWindowResize);

	return (
		<div key="Calendar" id="calendar" className="row-start-2 grid-column-3">
			<div className="calMonthsContainer" style={{ maxHeight: `${calcCalendarHeight() - 1.25}vh` }}>
				{monthComps.map((monthBoxObj) => {
					return (
						<MonthBox
							transactions={transactions}
							windowWidth={windowWidth}
							monthObj={monthBoxObj?.monthObj}
							key={monthBoxObj?.key}
							translateY={monthBoxObj.monthObj.styleYtransition}
							monthObserver={monthRef}
						/>
					);
				})}
			</div>
		</div>
	);
}

function calcMnthHt(monStDayOfWk: number, lengthOfMnth: number): number {
	if (monStDayOfWk === 0) {
		if (lengthOfMnth === 28) {
			return dayBoxHeight * 4;
		} else {
			return dayBoxHeight * 5;
		}
	} else if (monStDayOfWk === 1 || (monStDayOfWk > 1 && monStDayOfWk < 4) || monStDayOfWk === 4) {
		return dayBoxHeight * 5;
	} else if (monStDayOfWk === 5) {
		if (lengthOfMnth <= 30) {
			return dayBoxHeight * 5;
		} else {
			return dayBoxHeight * 6;
		}
	} else {
		if (lengthOfMnth <= 29) {
			return dayBoxHeight * 5;
		}
		return dayBoxHeight * 6;
	}
}
