import {
	Ref,
	ReactNode,
	useContext,
	useState,
	MouseEvent,
	DragEvent,
	useMemo,
	MutableRefObject,
	Dispatch,
	SetStateAction,
	useRef,
	useEffect,
	useCallback,
	LegacyRef,
	createElement,
	RefObject,
} from "react";
import { DateComponentInfo } from "../../Types/CalendarTypes";
import { Button, Card, CardBody, dateInput, Divider, Input, Pagination, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Transaction from "./BudgetComponents/Transaction";
import { CalendarContext } from "./CalendarContainer";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import AddTransactionIcon from "./Icons/AddTransactionIcon";
import { parseDate, today } from "@internationalized/date";
import CustomPaginator from "./CustomPaginator";
import { updateTransactionAPI, postTransactionAPI } from "../../Services/API/TransactionAPI";
import { highlightEditedTransactionSwitch } from "../../Utilities/CalendarComponentUtils";
import { ErrorHandler } from "../../Helpers/ErrorHandler";

export type editTransOnDateFuncs = ((t: TransactionAPIData) => void)[];

export default function DayBox({
	date,
	dateObj,
	transactions,
	endRef,
}: {
	date: number;
	dateObj: DateComponentInfo;
	transactions: Map<string, TransactionAPIData[]>;
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
	const { toggle: openDrawer, dragObject, addTransToDate, editTransOnDatesFuncsMap: addTransToDatesMap } = useContext(CalendarContext);
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

	if (addTransToDatesMap.current.get(dateString)) {
		addTransToDatesMap.current.delete(dateString);
		addTransToDatesMap.current.set(dateString, [addTransactionToList, removeTransactionFromList]);
	} else {
		addTransToDatesMap.current.set(dateString, [addTransactionToList, removeTransactionFromList]);
	}

	//Functions
	function toggleAddTransactionBtn(event: MouseEvent) {
		if (event.type === "mouseenter") setAddTransactionBtnVisible(true);
		if (event.type === "mouseleave") setAddTransactionBtnVisible(false);
	}

	function clickAddTransaction() {
		openDrawer({ date: parseDate(dateString), editingExisting: false });
		addTransToDate.current = addTransactionToList;
	}

	function handleClickOnTransaction(e: MouseEvent, trans: TransactionAPIData, updateTransBanner: (t: TransactionAPIData) => void) {
		highlightEditedTransactionSwitch(e.currentTarget as HTMLDivElement);

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

	return (
		<Card ref={endRef} radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 outline-black`}>
			<CardBody
				onMouseEnter={toggleAddTransactionBtn}
				onMouseLeave={toggleAddTransactionBtn}
				className="px-1 py-0 overflow-x-hidden overflow-y-hidden"
				style={{ position: `${dragActive ? "static" : "relative"}` }}>
				<span className="text-right text-sm">{date}</span>
				<Divider />
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
				<div style={{ position: "relative", bottom: "15px", left: "1.5px", width: "60%" }}>
					{todaysTransactions && todaysTransactions.length > 1 && !dragObject.current.globalDragOn && (
						<CustomPaginator total={todaysTransactions.length} onChange={pageChangeHandler} currentPage={transactionPage + 1} />
					)}
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
