import { Ref, ReactNode, useContext, useState, MouseEvent, useRef, useEffect, useCallback } from "react";
import { DateComponentInfo } from "../../../../../../Types/CalendarTypes";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import Transaction from "./Transaction/Transaction";
import { CalendarContext } from "../../../CalendarContainer";
import { TransactionAPIData } from "../../../../../../Types/APIDataTypes";
import AddTransactionIcon from "../../../../../Icons/AddTransactionIcon";
import { parseDate } from "@internationalized/date";
import CustomPaginator from "./CustomPaginator";
import { updateTransactionAPI } from "../../../../../../Services/API/TransactionAPI";
import { highlightEditedTransactionSwitch, updateDailyBalances, updateDailyBalanceStates } from "../../../../../../Utilities/UtilityFuncs";
import { ErrorHandler } from "../../../../../../Helpers/ErrorHandler";

export type editTransOnDateFuncs = ((t: TransactionAPIData) => void)[];

export default function DayBox({
	date,
	dateObj,
	transactions,
	mthLength,
	endRef,
}: {
	date: number;
	dateObj: DateComponentInfo;
	transactions: Map<string, TransactionAPIData[]>;
	mthLength: number;
	endRef?: Ref<HTMLDivElement>;
}): ReactNode {
	//Constants
	const updatePaginationDragState = useCallback((dragOn: boolean) => {
		setPaginationDragState(dragOn);
	}, []);
	const dateString: string = `${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`;
	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};
	const { openDrawer, dragObject, addTransToDate, editTransOnDatesFuncsMap, dailyBalancesMap, setStateDailyBalanceMap } = useContext(CalendarContext);
	const firstRender = useRef<boolean>(true);

	const transactionsPaginated = useCallback(
		(todayTransArr?: TransactionAPIData[]): TransactionAPIData[][] => {
			const transArr = todayTransArr ? todayTransArr : transactions.get(dateString) ? transactions.get(dateString)! : [];
			if (transArr.length == 0) return [[]];
			else if (transArr.length <= 5) {
				return [transArr];
			} else {
				if (!dragObject.current.paginationDragState.includes(updatePaginationDragState)) {
					dragObject.current.paginationDragState.push(updatePaginationDragState);
				}
				const transactionsPaginated: TransactionAPIData[][] = [];
				const transactionCopy = [...transArr];
				do {
					const fourTransactions = transactionCopy.splice(0, 5);
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
	const [forceState, setForceState] = useState<number>(getRandomNum());

	//CallBack Hooks
	const addTransactionToList = useCallback((transaction: TransactionAPIData) => {
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
	}, []);

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
			amount: trans.amount.toString(),
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
		const isNewBalance: boolean = newBalance !== dailyBalance;

		setDailyBalance(newBalance);
		isNewBalance ? setForceState(getRandomNum()) : null;
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

	function mkMnthEndBdr(columnStart: number, date: number, mnthLength: number): string {
		if (date <= mnthLength - 7) {
			if (date === mnthLength - 7 && columnStart !== 7) {
				return "theLastDay";
			}
			return "";
		}

		if (date === mnthLength && columnStart !== 7) {
			return "mnthEndBrdrLastDayNotSat";
		}

		return "mnthEndBrdrBottom";
	}

	return (
		<Card ref={endRef} radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 ${mkMnthStrBdr(gridStyle.gridColumnStart, date)} outline-slate-500`}>
			<CardBody
				onMouseEnter={toggleAddTransactionBtn}
				onMouseLeave={toggleAddTransactionBtn}
				className="px-1 py-0 overflow-x-hidden overflow-y-hidden"
				style={{ position: `${dragActive ? "static" : "relative"}` }}>
				<div className="flex justify-between">
					<div className="flex">
						{date === 1 && <span className="text-right text-sm">{dateObj.monthName.substring(0, 3)} &nbsp;</span>}
						<span className="text-right text-sm">{date}</span>
					</div>
					<span>{dailyBalance}</span>
				</div>
				<Divider />
				<div style={{ position: "absolute", top: "107px", left: "5px", width: "60%" }}>
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
					<Button onClick={clickAddTransaction} variant="flat" isIconOnly radius="full" color="danger" size="sm" className={`absolute addTransactionBtn`}>
						<AddTransactionIcon />
					</Button>
				)}
			</CardBody>
		</Card>
	);
}

function getRandomNum(): number {
	return Math.floor(Math.random() * 10000000);
}

function getTodaysBalance(balMap: Map<string, number>, dateString: string): number {
	let daysBalance: number | undefined = balMap.get(dateString);

	if (daysBalance) return daysBalance;

	const mapIter = balMap.keys();
	let dateKey;
	while (new Date((dateKey = mapIter.next().value)) < new Date(dateString)) {
		daysBalance = balMap.get(dateKey);
	}

	return daysBalance!;
}
