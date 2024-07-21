import { Ref, ReactNode, useContext, useState, MouseEvent, DragEvent, useMemo, MutableRefObject, Dispatch, SetStateAction, useRef, useEffect, useCallback, LegacyRef, createElement } from "react";
import { DateComponentInfo } from "../../Types/CalendarTypes";
import { Button, Card, CardBody, Divider, Input, Pagination, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Transaction from "./BudgetComponents/Transaction";
import { CalendarContext } from "./CalendarContainer";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import AddTransactionIcon from "./Icons/AddTransactionIcon";
import { parseDate } from "@internationalized/date";
import CustomPaginator from "./CustomPaginator";
import { dragNDropUpdateTransactionAPI, postTransactionAPI } from "../../Services/API/TransactionAPI";

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
	const { toggle: openDrawer, dragObject, setDateTransactionsRef } = useContext(CalendarContext);
	const firstRender = useRef<boolean>(true);

	//CallBack Hooks
	const updateDateTransactions = useCallback((transactions: TransactionAPIData) => {
		setTodaysTransactions((p) => {
			if (!p) {
				return [[transactions]];
			} else if (p[p.length - 1].length < 5) {
				p[p.length - 1].push(transactions);
				return p;
			} else {
				p.push([transactions]);
				return p;
			}
		});
	}, []);

	const updatePaginationDragState = useCallback((dragOn: boolean) => {
		setPaginationDragState(dragOn);
	}, []);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		setDateTransactionsRef.current = updateDateTransactions;
	}, [setDateTransactionsRef, updateDateTransactions]);

	//Constants
	const dateString: string = `${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`;

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	//State Hooks
	const [addTransactionBtnVisible, setAddTransactionBtnVisible] = useState<boolean>(false);
	const [dragActive, setDragActive] = useState<boolean>(false);
	const [transactionPage, setTransactionPage] = useState<number>(0);
	const [paginationDragState, setPaginationDragState] = useState<boolean>(false);
	const [todaysTransactions, setTodaysTransactions] = useState<TransactionAPIData[][] | null>(transactionsPaginated());

	//Functions
	function transactionsPaginated(todayTransArr?: TransactionAPIData[]): TransactionAPIData[][] | null {
		const transArr = todayTransArr ? todayTransArr : transactions.get(dateString) ? transactions.get(dateString)! : [];
		if (transArr.length == 0) return null;
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
	}

	function toggleAddTransactionBtn(event: MouseEvent) {
		if (event.type === "mouseenter") setAddTransactionBtnVisible(true);
		if (event.type === "mouseleave") setAddTransactionBtnVisible(false);
	}

	function clickAddTransaction() {
		openDrawer({ date: parseDate(dateString) });
		setDateTransactionsRef.current = updateDateTransactions;
	}

	function handleClickOnTransaction(e: MouseEvent, trans: TransactionAPIData) {
		openDrawer({ date: parseDate(dateString), amount: trans.amount.toString(), bankAccountId: trans.bankAccountId, category: trans.category, description: trans.description, title: trans.title });
	}

	function pageChangeHandler(page: number) {
		setTransactionPage(page - 1);
	}

	function handleDragStart(dragItemY: number) {
		setDragActive(true);
		dragObject.current.dragItemTransactions = updateDragItemTransactions;
		dragObject.current.globalDragOn = true;
		dragObject.current.dragItemY = dragItemY;
		dragObject.current.paginationDragState.forEach((x) => {
			x(true);
		});
	}

	function handleDragOver(e: MouseEvent) {
		if (!dragObject.current.globalDragOn) return;
		setDateTransactionsRef.current = updateDateTransactions;
		dragObject.current.containerDropped = setDroppedPage;
		e.currentTarget.classList.add("dragOver");
	}

	function handleDragLeave(e: MouseEvent) {
		e.currentTarget.classList.remove("dragOver");
	}

	async function handleDragEnd(transaction: TransactionAPIData) {
		const dragOver = document.getElementsByClassName("dragOver");
		if (dragOver.length > 0) {
			const dropContainerDate = dragOver[0].id.substring(0, 10);
			console.log(dropContainerDate);
			if (!(dropContainerDate === transaction.date)) {
				dragObject.current.dragItemTransactions(transaction);
				try {
					console.log("ran");
					const updatedTransaction = await dragNDropUpdateTransactionAPI(transaction, dropContainerDate);
					console.log("ran");
					setDateTransactionsRef.current!(updatedTransaction?.data);
				} catch (error) {
					console.log(error);
				}
				dragObject.current.containerDropped();
			}
		}
		setDragActive(false);
		dragObject.current.globalDragOn = false;
		setDateTransactionsRef.current = undefined;
		dragObject.current.paginationDragState.forEach((x) => {
			x(false);
		});
	}

	function setDroppedPage() {
		if (todaysTransactions) {
			setTransactionPage(todaysTransactions?.length - 1);
		}
	}

	function updateDragItemTransactions(transaction: TransactionAPIData) {
		setTodaysTransactions((p) => {
			if (!p) return [[]];
			const flatTransArr = p.flat();
			flatTransArr.splice(flatTransArr.indexOf(transaction), 1);
			return transactionsPaginated(flatTransArr);
		});
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
