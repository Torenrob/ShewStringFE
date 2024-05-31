import { ReactNode, useState, useRef, useCallback, MutableRefObject, useEffect, Ref, useMemo, createContext } from "react";
import MonthBox from "./MonthBox";
import { focusToday, getMonthName, setYtrans } from "../../Utilities/Functions";
import { LocalMonth, MonthComponentInfo } from "../../Types/CalendarTypes";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import { Skeleton, Input, Select, SelectItem } from "@nextui-org/react";
import { getAllTransactionsAPI } from "../../Services/TransactionAPI";

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

export default function Calendar(): ReactNode {
	const [monthComps, setMonthComps] = useState<MonthComponentInfo[]>([]);
	const [open, setOpen] = useState<boolean>(false);

	function toggleDrawer() {
		const isOpen = !open;
		setOpen(isOpen);
	}

	function assignTransactions(monthInfo: LocalMonth, transactionData: TransactionAPIData[] | null) {
		const transactionArray: TransactionAPIData[] = [];
		transactionData?.forEach((trans) => {
			const monthYrMnth = monthInfo.year.toString() + "-" + monthInfo.month.toString().padStart(2, "0");
			if (trans.date.substring(0, 7) === monthYrMnth) {
				transactionArray.push(trans);
			}
		});
		return transactionArray;
	}

	const calendarLoaded = useRef(false);

	const getTransactionData = useCallback(async () => {
		const res: TransactionAPIData[] | null = await getAllTransactionsAPI();
		let yTrans: number = 0;
		const monthArr = [...Array(23)].map((_, index) => {
			const month: LocalMonth = calcInitMonth({ index: index + 1, currentMonth: _getMonth(), prevYtrans: yTrans });
			yTrans = month.styleYtransition;
			const monthBoxObj: MonthComponentInfo = {
				monthObj: month,
				transactions: assignTransactions(month, res),
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
				if (targetClassList?.contains("col-start-1")) {
					targetClassList?.toggle("focusLabelLeft", entry?.isIntersecting);
				} else if (targetClassList?.contains("col-start-3")) {
					targetClassList?.toggle("focusLabelRight", entry?.isIntersecting);
				}
			}
		},
		{ threshold: 0.7 }
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
		<div key="Calendar" id="calendar">
			<Skeleton isLoaded={calendarLoaded.current} className="rounded-lg">
				{monthComps.map((monthBoxObj, index) => {
					if (monthComps.length === index + 1) {
						return (
							<div key={`leftLabel${index}`} className="grid grid-column-3 labelGridContainer" style={{ transform: `translateY(-${monthBoxObj.monthObj.styleYtransition}px` }}>
								<div ref={addLabelObserver} className="col-start-1 calLabelContainer">
									<h1 className="calLabelText">{monthBoxObj.monthObj.monthName + " - " + monthBoxObj.monthObj.year}</h1>
								</div>
								<MonthBox transactions={monthBoxObj.transactions} endRef={addEndRefObserver} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} id="lastMonth" />
								<div key={`rightLabel${index}`} ref={addLabelObserver} className="col-start-3 calLabelContainer">
									<h1 className="calLabelText">{monthBoxObj.monthObj.monthName + " - " + monthBoxObj.monthObj.year}</h1>
								</div>
							</div>
						);
					}
					return (
						<div key={`leftLabel${index}`} className="grid grid-column-3 labelGridContainer" style={{ transform: `translateY(-${monthBoxObj.monthObj.styleYtransition}px` }}>
							<div ref={addLabelObserver} className="col-start-1 calLabelContainer unfocusedLabel">
								<h1 className="calLabelText">{monthBoxObj.monthObj.monthName + " - " + monthBoxObj.monthObj.year}</h1>
							</div>
							<MonthBox transactions={monthBoxObj.transactions} monthObj={monthBoxObj?.monthObj} key={monthBoxObj?.key} />
							<div key={`rightLabel${index}`} ref={addLabelObserver} className="col-start-3 calLabelContainer unfocusedLabel">
								<h1 className="calLabelText">{monthBoxObj.monthObj.monthName + " - " + monthBoxObj.monthObj.year}</h1>
							</div>
						</div>
					);
				})}
			</Skeleton>
		</div>
	);
}