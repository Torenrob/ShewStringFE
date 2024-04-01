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
function calcInitMonth({ index, currentMonth }: { index: number; currentMonth: LocalMonth }): LocalMonth {
	if (index == 24) return currentMonth;
	const monthObject: LocalMonth = currentMonth;
	const monthDiff: number = monthObject?.month + (index - 24);
	let yearDiff: number = monthDiff % 12 === 0 ? Math.floor(monthDiff / 12) - 1 : Math.floor(monthDiff / 12);
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
			monthObject.month = 12 + monthDiff == 0 ? 12 : monthDiff > -12 ? 12 + monthDiff : 12 + (monthDiff % 12);
			monthObject.monthName = getMonthName(monthObject?.month);
			if (monthObject.month === 12) {
				yearDiff--;
			}
			monthObject.year = monthObject.year + yearDiff;
			return monthObject;
		}
	}
}

export default function Calendar(): ReactNode {
	const [calLoaded, setCalLoaded] = useState(false);
	const [monthComps, setMonthComps] = useState(
		[...Array(47)].map((_, index) => {
			const month: LocalMonth = calcInitMonth({ index: index + 1, currentMonth: _getMonth() });
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

	const endObserver: MutableRefObject<IntersectionObserver | null> = useRef(null);

	const addEndRefObserver: LegacyRef<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
		if (endObserver.current) endObserver.current?.disconnect();
		endObserver.current = new IntersectionObserver(
			(entry: IntersectionObserverEntry[]) => {
				const bcr = entry[0].boundingClientRect;
				console.log(bcr.top);
				if (bcr.top < 700) document.getElementById("lastMonth")?.scrollIntoView({ behavior: "instant" });
			},
			{ root: document.getElementsByClassName("calendar")[0], rootMargin: "-250px 0px" }
		);
		if (node) {
			console.log(endObserver.current);
			endObserver.current.observe(node);
		}
	}, []);

	return (
		<div key="Calendar" className={`calendar`}>
			<Skeleton isLoaded={calLoaded} className="rounded-lg">
				{monthComps.map((monthBoxObj, index) => {
					if (monthComps.length === index + 1) {
						return <MonthBox ta={true} endRef={addEndRefObserver} monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} monthInd={index} id="lastMonth" />;
					}
					return <MonthBox monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} monthInd={index} />;
				})}
			</Skeleton>
		</div>
	);
}
