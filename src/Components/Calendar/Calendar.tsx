import "./Calendar.css";
import { MutableRefObject, ReactNode, Ref, useCallback, useContext, useEffect, useRef, useState, useMemo } from "react";
import MonthBox from "../MonthBox/MonthBox.tsx";
import { calcDailyBalances, focusToday } from "../../Utilities/UtilityFuncs.tsx";
import { LocalMonth, MonthComponentInfo } from "../../Types/CalendarTypes.tsx";
import { TransactionAPIData } from "../../Types/APIDataTypes.tsx";
import { _getCurrMonth, calcInitMonth, calcInputMonths, getTotalNumberOfDays } from "./CalendarExports.tsx";
import { CalendarContext, MonthRange } from "../CalendarCtrl/CalendarCtrlExports.tsx";
import { dayBoxHeightPercent } from "../../Utilities/GlobalVariables.tsx";

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
	const [calChartWrapHeight, setCalChartWrapHeight] = useState<number>(0);
	//Watching screen size to trigger rerender if device scaling changes
	const [screenWidth, setScreenWidth] = useState<number>(screen.width);

	useEffect(() => {
		const calChartWrapElement = document.getElementById("calChartWrap");

		if (calChartWrapElement) {
			setCalChartWrapHeight(calChartWrapElement.clientHeight);
		}
	}, []);

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
			const monthArr = calcInputMonths(new Date(monthRange.startMonth + "-1"), new Date(monthRange.endMonth + "-1"));
			setNumberOfDays(getTotalNumberOfDays(monthArr));
			setMonthComps(monthArr);
		}
	}, [dailyBalancesMap, dateTransactionsMap, transactions, monthRange, setNumberOfDays]);

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

	function calcCalendarHeight() {
		const calElement = document.getElementById("calendar");
		const monthDivArr = document.getElementsByClassName("monthBox");
		const lastMonthDiv = monthDivArr[monthDivArr.length - 1];

		if (!calElement || !lastMonthDiv) return 0;

		return calElement.clientHeight - (calElement.getBoundingClientRect().bottom - lastMonthDiv.getBoundingClientRect().bottom);
	}

	function handleWindowResize() {
		const newSize = window.innerWidth >= 1024 ? "lg" : window.innerWidth >= 768 ? "md" : "sm";

		if (newSize != windowWidth) {
			setWindowWidth(newSize);
		}
	}

	window.addEventListener("resize", handleWindowResize);

	useEffect(() => {
		const checkForZoomChange = setInterval(() => {
			if (screenWidth !== screen.width) {
				console.log("Should run");
				setScreenWidth(screen.width);
			}
		}, 1000);

		return () => clearInterval(checkForZoomChange);
	}, [setScreenWidth, screenWidth]);

	return (
		<div key="Calendar" id="calendar" className={`row-start-2 grid-column-3`}>
			<div className={`calMonthsContainer`} style={{ maxHeight: `${calcCalendarHeight() / 16}rem` }}>
				{monthComps.map((monthBoxObj) => {
					return (
						<MonthBox
							calChartWrapHeight={calChartWrapHeight}
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

function calcMnthHt(monStDayOfWk: number, lengthOfMnth: number, calWrapHeight: number): number {
	const dayBoxHeightPx: number = (calWrapHeight * dayBoxHeightPercent) / 100;

	if (monStDayOfWk === 0) {
		if (lengthOfMnth === 28) {
			return dayBoxHeightPx * 4;
		} else {
			return dayBoxHeightPx * 5;
		}
	} else if (monStDayOfWk === 1 || (monStDayOfWk > 1 && monStDayOfWk < 4) || monStDayOfWk === 4) {
		return dayBoxHeightPx * 5;
	} else if (monStDayOfWk === 5) {
		if (lengthOfMnth <= 30) {
			return dayBoxHeightPx * 5;
		} else {
			return dayBoxHeightPx * 6;
		}
	} else {
		if (lengthOfMnth <= 29) {
			return dayBoxHeightPx * 5;
		}
		return dayBoxHeightPx * 6;
	}
}
