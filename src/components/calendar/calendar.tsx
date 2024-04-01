import { ReactNode, useState, useRef, useCallback, MutableRefObject, LegacyRef, useEffect } from "react";
import MonthBox from "./monthBox";
import { focusToday, getMonthName } from "../../utils/utils";
import { Skeleton } from "@nextui-org/react";

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
	if (index == 24) return _getMonth();
	const monthObject: LocalMonth = _getMonth();
	const monthDiff: number = monthObject?.month + (index - 24);
	let yearDiff: number = Math.floor(monthDiff / 12);
	if (monthDiff <= 12 && monthDiff >= 1) {
		monthObject.month = monthDiff;
		monthObject.monthName = getMonthName(monthObject?.month);
		return monthObject;
	} else {
		if (monthDiff > 12) {
			monthObject.month = monthDiff % 12 === 0 ? 12 : monthDiff % 12;
			monthObject.monthName = getMonthName(monthObject?.month);
			monthObject.year = monthObject.year + yearDiff;
			return monthObject;
		} else {
			console.log(monthDiff);
			monthObject.month = 12 + monthDiff == 0 ? 12 : monthDiff > -12 ? 12 + monthDiff : 12 + (monthDiff % 12);
			console.log(monthObject.month);
			monthObject.monthName = getMonthName(monthObject?.month);
			if (monthObject.month === 12) {
				yearDiff--;
			}
			monthObject.year = monthObject.year + yearDiff;
			return monthObject;
		}
	}
}

//Calculate Month Comp arr when scrolling
function calcScrollMonth({ monthArr, scrollDirection, pastScrollCount }: { monthArr: MonthComponentInfo[]; scrollDirection: 1 | 0; pastScrollCount: number }): MonthComponentInfo[] {
	if (scrollDirection === 1) {
		const month: LocalMonth = calcInitMonth({ index: monthArr.length + 1 });
		const monthBoxObj: MonthComponentInfo = {
			monthObj: month,
			key: `${month?.monthName}${month?.year}`,
		};
		return monthArr.concat(monthBoxObj);
	} else {
		const additionalMonths: MonthComponentInfo[] = [];
		for (let i = 0; i < 4; i++) {
			const month: LocalMonth = calcInitMonth({ index: pastScrollCount });
			const monthBoxObj: MonthComponentInfo = {
				monthObj: month,
				key: `${month?.monthName}${month?.year}`,
			};
			additionalMonths.push(monthBoxObj);
			pastScrollCount--;
		}
		return additionalMonths.concat(monthArr);
	}
}

export default function Calendar(): ReactNode {
	const [calLoaded, setCalLoaded] = useState(false);
	const [monthComps, setMonthComps] = useState(
		[...Array(47)].map((_, index) => {
			const month: LocalMonth = calcInitMonth({ index: index + 1 });
			const monthBoxObj: MonthComponentInfo = {
				monthObj: month,
				key: `${month?.monthName}${month?.year}`,
			};
			return monthBoxObj;
		})
	);
	useEffect(() => {
		focusToday();
		setTimeout(() => setCalLoaded(true), 1000);
	}, []);

	//Intersect Observer to highlight current month/year label
	const labelObserver: MutableRefObject<IntersectionObserver | undefined> = useRef();
	labelObserver.current = new IntersectionObserver(
		async (entries: IntersectionObserverEntry[]) => {
			for (const entry of entries) {
				const targetClassList = entry?.target?.classList;
				targetClassList?.toggle("focusLabel", entry?.isIntersecting);
				targetClassList?.toggle("shadow-xl", entry?.isIntersecting);
				targetClassList?.toggle("unfocusedLabel", entry?.isIntersecting);
				if (targetClassList?.contains("col-start-1")) {
					targetClassList?.toggle("focusLabelLeft", entry?.isIntersecting);
				} else if (targetClassList?.contains("col-start-3")) {
					targetClassList?.toggle("focusLabelRight", entry?.isIntersecting);
				}
			}
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

	const futureScrollObserver: MutableRefObject<IntersectionObserver | undefined> = useRef();
	futureScrollObserver.current = new IntersectionObserver(
		(entry: IntersectionObserverEntry[]) => {
			if (!entry[0]?.isIntersecting) return;
			const month: MonthComponentInfo[] = calcScrollMonth({ monthArr: monthComps, scrollDirection: 1, pastScrollCount: 0 });
			const newMonthArr = month.slice();
			setMonthComps(newMonthArr);
		},
		{ threshold: 0.9 }
	);

	const addFutureScrollObserver: LegacyRef<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
		futureScrollObserver.current?.disconnect();
		try {
			await futureScrollObserver?.current?.observe(node);
		} catch {
			return;
		}
	}, []);

	return (
		<div key="Calendar" className={`calendar`}>
			<Skeleton isLoaded={calLoaded} className="rounded-lg">
				{monthComps.map((monthBoxObj, index) => {
					if (monthComps?.length === index + 2) {
						return (
							<MonthBox id="FutureScroll" infiniteScrollRef={addFutureScrollObserver} monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} monthInd={index} />
						);
					} else {
						return <MonthBox monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} monthInd={index} />;
					}
				})}
			</Skeleton>
		</div>
	);
}
