import "./Calendar.css"
import {MutableRefObject, ReactNode, Ref, useCallback, useContext, useEffect, useRef, useState} from "react";
import MonthBox from "../MonthBox/MonthBox.tsx";
import {
	calcDailyBalances,
	focusToday
} from "../../Utilities/UtilityFuncs.tsx";
import {LocalMonth, MonthComponentInfo} from "../../Types/CalendarTypes.tsx";
import {TransactionAPIData} from "../../Types/APIDataTypes.tsx";
import {
	_getCurrMonth,
	calcInitMonth,
	calcInputMonths, getTotalNumberOfDays,
} from "./CalendarExports.tsx";
import {CalendarContext, MonthRange} from "../CalendarCtrl/CalendarCtrlExports.tsx"
import {dayBoxHeight} from "../../Utilities/GlobalVariables.tsx";



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
	const { dailyBalancesMap, dateTransactionsMap, setNumberOfDays } = useContext(CalendarContext);

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
			setNumberOfDays(getTotalNumberOfDays(monthArr));
			setMonthComps(monthArr);
		} else {
			const monthArr = calcInputMonths(new Date(monthRange.startMonth + "-1"), new Date(monthRange.endMonth + "-1"))
			setNumberOfDays(getTotalNumberOfDays(monthArr))
			setMonthComps(monthArr);
		}
	}, [dailyBalancesMap, dateTransactionsMap, transactions, monthRange]);

	useEffect(() => {
		getTransactionData();
	}, [getTransactionData]);

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
