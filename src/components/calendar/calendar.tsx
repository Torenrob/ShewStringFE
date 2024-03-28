import { ReactNode, useState, useRef, useCallback, MutableRefObject, LegacyRef, useEffect } from "react";
import MonthBox from "./monthBox";
import { focusToday, getMonthName } from "../../utils/utils";

export interface LocalMonth {
	month: number;
	monthName: string;
	year: number;
}

interface MonthComponentInfo {
	monthObj: LocalMonth;
	key: string;
}

//Break Down Current UTC Date into Local Date Object for Current User Calendar(U.S.)
function _getMonth(): LocalMonth {
	const locString: string = new Date()?.toLocaleDateString();
	const monthNumber: number = Number(locString?.match(/^([^/]+)/)![0]);
	const monthObject: LocalMonth = {
		month: monthNumber,
		monthName: getMonthName(monthNumber),
		year: Number(locString?.match(/\/(\d{4})$/)![1]),
	};

	return monthObject;
}

//Calculate Month Comp arr on initialization
function calcInitMonth({ index }: { index: number }): LocalMonth {
	if (index == 4) return _getMonth();
	const monthObject: LocalMonth = _getMonth();
	const diff: number = monthObject?.month + (index - 4);
	if (diff <= 12 && diff >= 1) {
		monthObject.month = diff;
		monthObject.monthName = getMonthName(monthObject?.month);
		return monthObject;
	} else {
		if (diff > 12) {
			monthObject.month = diff - 12;
			monthObject.monthName = getMonthName(monthObject?.month);
			monthObject.year++;
			return monthObject;
		} else {
			monthObject.month = 12 + diff;
			monthObject.monthName = getMonthName(monthObject?.month);
			monthObject.year--;
			return monthObject;
		}
	}
}

//Calculate Month Comp arr when scrolling
function calcScrollMonth({ monthArr, scrollDirection }: { monthArr: MonthComponentInfo[]; scrollDirection: 1 | 0 }): MonthComponentInfo[] {}

export default function Calendar(): ReactNode {
	const [monthComps, setMonthComps] = useState(
		[...Array(7)].map((_, index) => {
			const month: LocalMonth = calcInitMonth({ index: index + 1 });
			const monthBoxObj = {
				monthObj: month,
				key: `${month?.monthName}${month?.year}`,
			};
			return monthBoxObj;
		})
	);

	useEffect(() => focusToday(), []);

	//Intersect Observer to highlight current month/year label
	const labelObserver: MutableRefObject<IntersectionObserver | undefined> = useRef();
	labelObserver.current = new IntersectionObserver(
		(entries: IntersectionObserverEntry[]) => {
			entries?.forEach((entry) => {
				const targetClassList = entry?.target?.classList;
				targetClassList?.toggle("focusLabel", entry?.isIntersecting);
				targetClassList?.toggle("shadow-xl", entry?.isIntersecting);
				if (targetClassList?.contains("col-start-1")) {
					targetClassList?.toggle("focusLabelLeft", entry?.isIntersecting);
				} else if (targetClassList?.contains("col-start-3")) {
					targetClassList?.toggle("focusLabelRight", entry?.isIntersecting);
				}
			});
		},
		{ threshold: 0.65 }
	);

	const addLabelObserver: LegacyRef<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
		try {
			await labelObserver?.current?.observe(node);
		} catch {
			return;
		}
	}, []);

	// const calInfiniteScrollObserver: MutableRefObject<IntersectionObserver | undefined> = useRef();
	// calInfiniteScrollObserver.current = new IntersectionObserver(
	// 	(entries: IntersectionObserverEntry[]) => {
	// 		entries.forEach((entry) => {
	// 			if (!entry?.isIntersecting) return;
	// 			const targetClassList = entry.target.classList;
	// 			if (targetClassList.contains("scrollFuture")) {
	// 				const month: LocalMonth = calcInitMonth({ monthArr: monthComps, scrollDirection: 1 });
	// 				const monthBoxObj = {
	// 					monthObj: month,
	// 					key: `${month.monthName}${month.year}`,
	// 				};
	// 				setMonthComps((prev) => prev.concat(monthBoxObj));
	// 			} else if (targetClassList.contains("scrollPast")) {
	// 				const month: LocalMonth = calcInitMonth({ index: 1 });
	// 				const monthBoxObj = [
	// 					{
	// 						monthObj: month,
	// 						key: `${month.monthName}${month.year}`,
	// 					},
	// 				];
	// 				setMonthComps((prev) => {
	// 					const arr = monthBoxObj.concat(prev);
	// 					return arr;
	// 				});
	// 			}
	// 		});
	// 	},
	// 	{ threshold: 0.65 }
	// );

	// const addCalInfiniteScrollObserver: LegacyRef<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
	// 	try {
	// 		await calInfiniteScrollObserver?.current?.observe(node);
	// 	} catch {
	// 		return;
	// 	}
	// }, []);

	return (
		<div key="Calendar" className={`calendar`}>
			{monthComps.map((monthBoxObj, index) => {
				// if (monthComps?.length === index + 2) {
				// 	return <MonthBox infiniteScrollRef={addCalInfiniteScrollObserver} monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} monthInd={index} />;
				// } else if (index === 1) {
				// 	return <MonthBox infiniteScrollRef={addCalInfiniteScrollObserver} monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} monthInd={index} />;
				// } else {
				return <MonthBox monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} monthInd={index} />;
				// }
			})}
		</div>
	);
}
