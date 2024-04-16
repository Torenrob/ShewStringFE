import { ReactNode, useState, useRef, useCallback, MutableRefObject, useEffect, Ref, useMemo } from "react";
import MonthBox from "./monthBox";
import { focusToday, getMonthName, setYtrans } from "../../utilities/functions";
import { BudgetTransaction, LocalMonth, MonthComponentInfo } from "../../types/types";
import { Skeleton } from "@nextui-org/react";
import { supabase } from "../../utilities/supabase";

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
	if (index == 24) {
		currentMonth.styleYtransition = setYtrans(index, prevYtrans, currentMonth);
		return currentMonth;
	}
	const monthObject: LocalMonth = currentMonth;
	const monthDiff: number = monthObject?.month + (index - 24);
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

export default function Calendar(): ReactNode {
	const [monthComps, setMonthComps] = useState<MonthComponentInfo[]>([]);

	function assignTransactions(monthInfo: LocalMonth, transactionData: BudgetTransaction[]) {
		const transactionArray: BudgetTransaction[] = [];
		transactionData?.forEach((trans) => {
			if (trans.month === monthInfo.month && trans.year === monthInfo.year) {
				transactionArray.push(trans);
			}
		});
		return transactionArray;
	}

	const calendarLoaded = useRef(false);

	const getTransactionData = useCallback(async () => {
		const res = await supabase.from("transaction").select();
		let yTrans: number = 0;
		const monthArr = [...Array(47)].map((_, index) => {
			console.log(yTrans);
			const month: LocalMonth = calcInitMonth({ index: index + 1, currentMonth: _getMonth(), prevYtrans: yTrans });
			yTrans = month.styleYtransition;
			const monthBoxObj: MonthComponentInfo = {
				monthObj: month,
				transactions: assignTransactions(month, res.data as BudgetTransaction[]),
				key: `${month?.monthName}${month?.year}`,
			};
			return monthBoxObj;
		});
		setMonthComps(monthArr);
		focusToday();
		calendarLoaded.current = true;
	}, []);

	useEffect(() => {
		getTransactionData();
	}, [getTransactionData]);

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

	const addLabelObserver: Ref<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
		try {
			await labelObserver?.current?.observe(node);
		} catch {
			return;
		}
	}, []);

	const endObserver: MutableRefObject<IntersectionObserver | null> = useRef(null);

	const addEndRefObserver: Ref<HTMLDivElement> = useCallback(async (node: HTMLDivElement) => {
		if (endObserver.current) endObserver.current?.disconnect();
		endObserver.current = new IntersectionObserver(
			(entry: IntersectionObserverEntry[]) => {
				const bcr = entry[0].boundingClientRect;
				if (bcr.top < 700) document.getElementById("lastMonth")?.scrollIntoView({ behavior: "instant" });
			},
			{ root: document.getElementsByClassName("calendar")[0], rootMargin: "-250px 0px" }
		);
		if (node) {
			endObserver.current.observe(node);
		}
	}, []);

	return (
		<div key="Calendar" className={`calendar`}>
			<Skeleton isLoaded={calendarLoaded.current} className="rounded-lg">
				{monthComps.map((monthBoxObj, index) => {
					if (monthComps.length === index + 1) {
						return (
							<MonthBox
								transactions={monthBoxObj.transactions}
								endRef={addEndRefObserver}
								monthYearLabelRef={addLabelObserver}
								monthObj={monthBoxObj?.monthObj}
								key={monthBoxObj?.key}
								id="lastMonth"
							/>
						);
					}
					return <MonthBox transactions={monthBoxObj.transactions} monthYearLabelRef={addLabelObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} />;
				})}
			</Skeleton>
		</div>
	);
}
