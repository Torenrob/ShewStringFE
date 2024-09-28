import { Ref, ReactNode, useContext, useState, MouseEvent, useRef, useEffect, useCallback } from "react";
import { DateComponentInfo } from "../../../../../Types/CalendarTypes";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import Transaction from "./Transaction/Transaction";
import { CalendarContext } from "../../../CalendarCtrl";
import { TransactionAPIData } from "../../../../../Types/APIDataTypes";
import AddTransactionIcon from "../../../../Icons/AddTransactionIcon";
import { parseDate } from "@internationalized/date";
import CustomPaginator from "./CustomPaginator";
import { updateTransactionAPI } from "../../../../../Services/API/TransactionAPI";
import { calcDailyBalances, getDayOfWeek, getRandomNum, highlightEditedTransactionSwitch, updateDailyBalances, updateDailyBalanceStates } from "../../../../../Utilities/UtilityFuncs";
import { ErrorHandler } from "../../../../../Helpers/ErrorHandler";

export type editTransOnDateFuncs = ((t: TransactionAPIData) => void)[];

export default function DayBox({
	date,
	dateObj,
	transactions,
	dayGridSpot,
}: {
	date: number;
	dateObj: DateComponentInfo;
	transactions: Map<string, TransactionAPIData[]>;
	dayGridSpot: number;
}): ReactNode {
	const [forceState, setForceState] = useState<number>(getRandomNum());

	//Constants
	const updatePaginationDragState = useCallback((dragOn: boolean) => {
		setPaginationDragState(dragOn);
	}, []);
	const dateString: string = `${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`;

	const gridStyle = {
		gridColumnStart: 1,
	};

	const { openDrawer, dragObject, addTransToDate, editTransOnDatesFuncsMap, dailyBalancesMap, setStateDailyBalanceMap, dateTransactionsMap } = useContext(CalendarContext);
	const firstRender = useRef<boolean>(true);

	const transactionsPaginated = useCallback(
		(todayTransArr?: TransactionAPIData[]): TransactionAPIData[][] => {
			const transArr = todayTransArr ? todayTransArr : transactions.get(dateString) ? transactions.get(dateString)! : [];
			if (transArr.length == 0) return [[]];
			else if (transArr.length <= 6) {
				return [transArr];
			} else {
				if (!dragObject.current.paginationDragState.includes(updatePaginationDragState)) {
					dragObject.current.paginationDragState.push(updatePaginationDragState);
				}
				const transactionsPaginated: TransactionAPIData[][] = [];
				const transactionCopy = [...transArr];
				do {
					const fourTransactions = transactionCopy.splice(0, 6);
					transactionsPaginated.push(fourTransactions);
				} while (transactionCopy.length > 0);
				return transactionsPaginated;
			}
		},
		[dateString, dragObject, transactions, updatePaginationDragState]
	);

	//State Hooks
	const [addTransactionBtnVisible, setAddTransactionBtnVisible] = useState<boolean>(false);
	const [dragActive, setDragActive] = useState<boolean>(false);
	const [transactionPage, setTransactionPage] = useState<number>(0);
	const [paginationDragState, setPaginationDragState] = useState<boolean>(false);
	const [todaysTransactions, setTodaysTransactions] = useState<TransactionAPIData[][]>(transactionsPaginated());
	const [dailyBalance, setDailyBalance] = useState<number>(getTodaysBalance(dailyBalancesMap.current, dateString));

	//CallBack Hooks
	const addTransactionToList = useCallback(
		(transaction: TransactionAPIData) => {
			setTodaysTransactions((p) => {
				if (!p) {
					p = [[transaction]];
				} else if (p[p.length - 1].length < 5) {
					p[p.length - 1].push(transaction);
				} else {
					p.push([transaction]);
				}
				return p;
			});
			setForceState(getRandomNum());
		},
		[setForceState, setTodaysTransactions]
	);

	const removeTransactionFromList = (transaction: TransactionAPIData) => {
		if (todaysTransactions!.length > 1 && todaysTransactions![todaysTransactions!.length - 1].length === 1) {
			setTransactionPage(todaysTransactions!.length - 2);
		}

		setTodaysTransactions((p) => {
			if (!p) return [[]];
			const res = p.flat().filter((e) => e.id !== transaction.id);
			return transactionsPaginated(res);
		});
	};

	useEffect(() => {
		const updatedTransactions = transactionsPaginated();
		dateTransactionsMap.current = transactions;
		dailyBalancesMap.current = calcDailyBalances(dateTransactionsMap.current!, dateString);
		setTodaysTransactions(updatedTransactions);
		setDailyBalance(getTodaysBalance(dailyBalancesMap.current, dateString));
	}, [transactions, transactionsPaginated, dailyBalancesMap, dateString, dateTransactionsMap]);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		addTransToDate.current = addTransactionToList;
	}, [addTransToDate, addTransactionToList]);

	//Collect state funcs in calendar context with no duplicates
	if (editTransOnDatesFuncsMap.current.get(dateString)) {
		editTransOnDatesFuncsMap.current.delete(dateString);
	}
	editTransOnDatesFuncsMap.current.set(dateString, [addTransactionToList, removeTransactionFromList]);

	if (setStateDailyBalanceMap.current.get(dateString)) {
		setStateDailyBalanceMap.current.delete(dateString);
	}
	setStateDailyBalanceMap.current.set(dateString, updateDaysBalance);

	//Functions
	function toggleAddTransactionBtn(event: MouseEvent) {
		if (event.type === "mouseenter") setAddTransactionBtnVisible(true);
		if (event.type === "mouseleave") setAddTransactionBtnVisible(false);
	}

	function clickAddTransaction() {
		highlightEditedTransactionSwitch();
		openDrawer({ date: parseDate(dateString), editingExisting: false });
		addTransToDate.current = addTransactionToList;
	}

	function handleClickOnTransaction(trans: TransactionAPIData, updateTransBanner: (t: TransactionAPIData) => void) {
		highlightEditedTransactionSwitch(trans.id.toString());

		openDrawer({
			id: trans.id,
			date: parseDate(dateString),
			amount: trans.amount.toFixed(2).toString(),
			bankAccountId: trans.bankAccountId,
			category: trans.category,
			description: trans.description,
			title: trans.title,
			editingExisting: true,
			transactionObj: trans,
			deleteTransactionFromDate: removeTransactionFromList,
			editTransactionFunc: updateTransBanner,
		});
	}

	function pageChangeHandler(page: number) {
		setTransactionPage(page - 1);
	}

	function handleDragStart(dragItemY: number) {
		setDragActive(true);
		dragObject.current.removeTransactionFromDate = removeTransactionFromList;
		dragObject.current.dragItemY = dragItemY;
		dragObject.current.paginationDragState.forEach((x) => {
			x(true);
		});
	}

	function handleDragOver(e: MouseEvent) {
		if (!dragObject.current.globalDragOn) return;
		addTransToDate.current = addTransactionToList;
		dragObject.current.containerDropped = setDroppedPage;
		e.currentTarget.classList.add("dragOver");
	}

	function handleDragLeave(e: MouseEvent) {
		e.currentTarget.classList.remove("dragOver");
	}

	async function handleDragEnd(transaction: TransactionAPIData) {
		const dragOver = document.getElementsByClassName("dragOver")[0];
		dragOver.classList.remove("dragOver");
		const dropContainerDate = dragOver.id.substring(0, 10);
		if (dropContainerDate !== transaction.date) {
			dragObject.current.removeTransactionFromDate(transaction);
			try {
				const updatedTransaction = await updateTransactionAPI(transaction, dropContainerDate);
				addTransToDate.current!(updatedTransaction?.data);
				const updBalanceMap = updateDailyBalances(transactions, dailyBalancesMap.current, updatedTransaction?.data, transaction);
				updateDailyBalanceStates(setStateDailyBalanceMap.current, updBalanceMap[0]);
			} catch (error) {
				ErrorHandler(error);
			}
		}
		addTransToDate.current = undefined;
		dragObject.current.containerDropped();
		setDragActive(false);
		dragObject.current.paginationDragState.forEach((x) => {
			x(false);
		});
	}

	function setDroppedPage() {
		if (todaysTransactions) {
			setTransactionPage(todaysTransactions?.length - 1);
		}
	}

	function updateDaysBalance(newBalance: number) {
		setDailyBalance(newBalance);
	}

	//Check to make sure no transaction is added twice to container.
	//A certain bug during DND was adding transactions twice.
	const lastTransIndex = todaysTransactions[todaysTransactions.length - 1];
	if (lastTransIndex.length > 1) {
		lastTransIndex.forEach((x) => {
			const indexes = [];
			let i = -1;
			while ((i = lastTransIndex.indexOf(x, i + 1)) !== -1) {
				indexes.push(i);
			}
			indexes.length > 1 ? removeDups(indexes.reverse()) : null;
		});
	}

	function removeDups(indexList: number[]) {
		setTodaysTransactions((p) => {
			indexList.forEach((y) => {
				p[p.length - 1].slice(y, 1);
			});
			return p;
		});
	}

	function mkMnthStrBdr(columnStart: number, date: number): string {
		if (date > 7) {
			if (date === 8 && columnStart !== 1) {
				return "the8th";
			}
			return "";
		}

		if (date === columnStart) {
			return "mnthStartBrdrTop";
		}

		if (date === 1 && date !== columnStart) {
			return "mnthStartBrdr1stNotSun";
		}

		return "mnthStartBrdrTop";
	}

	function mkMobileMnthStrBrdr(columnStart: number, date: number) {
		if (date > 2) {
			if (date == 3 && columnStart == 2) {
				return "theMobile3rd";
			}
			return "";
		}

		if (date == 1 && columnStart == 2) {
			return "mob1st2colborder";
		}

		return "mobileTopBorder";
	}

	return (
		<Card
			radius="none"
			shadow="none"
			id={dateString}
			style={{}}
			className={`dayBox mobCol${dayGridSpot} ${mkMobileMnthStrBrdr(dayGridSpot, date)} col${dateObj.dayOfWeek} outline outline-1 ${mkMnthStrBdr(dateObj.dayOfWeek, date)} outline-slate-500`}>
			<CardBody
				onMouseEnter={toggleAddTransactionBtn}
				onMouseLeave={toggleAddTransactionBtn}
				className="px-1 py-0 overflow-x-hidden overflow-y-hidden"
				style={{ position: `${dragActive ? "static" : "relative"}` }}>
				<div className="flex justify-between">
					<div className="flex">
						<span className="text-sm md:hidden">{`${dateObj.month}-${date}-${dateObj.year.toString().substring(2)} ${getDayOfWeek(dateObj.dayOfWeek).substring(0, 3).toUpperCase()}`}</span>
						{date === 1 && <span className="text-right text-sm dayBoxMonthLabel">{dateObj.monthName.substring(0, 3)} &nbsp;</span>}
						<span className="hidden md:inline text-sm">{date}</span>
					</div>
					<span className={`${Number(dailyBalance) >= 0 ? "text-black" : "text-red-600"} text-small`}>${Number(dailyBalance).toFixed(2)}</span>
				</div>
				<Divider />
				<div style={{ position: "absolute", top: "84%", left: "5%", width: "60%" }}>
					{todaysTransactions && todaysTransactions.length > 1 && !dragObject.current.globalDragOn && (
						<CustomPaginator total={todaysTransactions.length} onChange={pageChangeHandler} currentPage={transactionPage + 1} />
					)}
				</div>
				<div onMouseEnter={handleDragOver} onMouseLeave={handleDragLeave} id={`${dateString}Transactions`} className="transactionContainer overflow-y-scroll pt-0.5">
					{todaysTransactions &&
						todaysTransactions[paginationDragState && !dragActive ? todaysTransactions.length - 1 : transactionPage].map((trans: TransactionAPIData, i: number) => (
							<Transaction
								index={i}
								transaction={trans}
								key={`${dateObj.date}/${dateObj.month}/${dateObj.year}-Trans${i}`}
								handleDragStart={handleDragStart}
								handleDragEnd={handleDragEnd}
								onClick={handleClickOnTransaction}
							/>
						))}
				</div>
				{addTransactionBtnVisible && !dragObject.current.globalDragOn && (
					<Button onClick={clickAddTransaction} variant="flat" isIconOnly radius="full" size="sm" className="absolute addTransactionBtn bg-[#6EC4A7]">
						<AddTransactionIcon />
					</Button>
				)}
			</CardBody>
		</Card>
	);
}

function getTodaysBalance(balMap: Map<string, number>, dateString: string): number {
	if (balMap.size === 0) return 0;

	let daysBalance: number | undefined = balMap.get(dateString);

	if (daysBalance) return daysBalance;

	if (new Date(balMap.keys().next().value as string) > new Date(dateString)) {
		return 0.0;
	}

	const mapIter = balMap.keys();
	let dateKey;
	while (new Date((dateKey = mapIter.next().value as string)) < new Date(dateString)) {
		daysBalance = balMap.get(dateKey as string);
	}

	return daysBalance!;
}
