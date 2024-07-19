import { Ref, ReactNode, useContext, useState, MouseEvent, DragEvent, useMemo, MutableRefObject, Dispatch, SetStateAction, useRef, useEffect, useCallback, LegacyRef, createElement } from "react";
import { DateComponentInfo } from "../../Types/CalendarTypes";
import { Button, Card, CardBody, Divider, Input, Pagination, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Transaction from "./BudgetComponents/Transaction";
import { CalendarContext } from "./CalendarContainer";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import AddTransactionIcon from "./Icons/AddTransactionIcon";
import { parseDate } from "@internationalized/date";
import CustomPaginator from "./CustomPaginator";
import { postTransactionAPI } from "../../Services/API/TransactionAPI";

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
	const [addTransactionBtnVisible, setAddTransactionBtnVisible] = useState<boolean>(false);
	const [dragActive, setDragActive] = useState<boolean>(false);
	const [transactionPage, setTransactionPage] = useState<number>(0);
	const [paginationDragState, setPaginationDragState] = useState<boolean>(false);
	const [todaysTransactions, setTodaysTransactions] = useState<TransactionAPIData[]>(
		transactions.get(`${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`)
			? transactions.get(`${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`)!
			: []
	);

	const firstRender = useRef<boolean>(true);

	const { toggle: openDrawer, dragObject, setDateTransactionsRef } = useContext(CalendarContext);

	const updateDateTransactions = useCallback(
		(transactions: TransactionAPIData) => {
			setTodaysTransactions([...(todaysTransactions as TransactionAPIData[]), transactions]);
		},
		[todaysTransactions]
	);

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

	const dateString: string = `${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`;

	const transactionsPaginated = useMemo((): TransactionAPIData[][] | null => {
		if (todaysTransactions.length == 0) return null;
		else if (todaysTransactions.length <= 5) {
			return [todaysTransactions];
		} else {
			console.log("ran");
			dragObject.current.paginationDragState.push(updatePaginationDragState);
			const transactionsPaginated: TransactionAPIData[][] = [];
			const transactionCopy = [...todaysTransactions];
			do {
				const fourTransactions = transactionCopy.splice(0, 5);
				transactionsPaginated.push(fourTransactions);
			} while (transactionCopy.length > 0);
			return transactionsPaginated;
		}
	}, [todaysTransactions, dragObject, updatePaginationDragState]);

	function toggleAddTransactionBtn(event: MouseEvent) {
		if (event.type === "mouseenter") setAddTransactionBtnVisible(true);
		if (event.type === "mouseleave") setAddTransactionBtnVisible(false);
	}

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	function clickAddTransaction() {
		openDrawer(parseDate(`${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`));
		setDateTransactionsRef.current = updateDateTransactions;
	}

	function pageChangeHandler(page: number) {
		setTransactionPage(page - 1);
	}

	function handleDragOver(e: MouseEvent) {
		if (!dragObject.current.globalDragOn) return;
		setDateTransactionsRef.current = updateDateTransactions;
		dragObject.current.containerDropped = () => {
			if (transactionsPaginated) {
				setTransactionPage(transactionsPaginated?.length - 1);
			}
		};
		e.currentTarget.classList.add("dragOver");
	}

	function handleDragLeave(e: MouseEvent) {
		e.currentTarget.classList.remove("dragOver");
	}

	function handleDrop() {
		console.log("ran");
	}

	function handleDragStart(dragItemY: number) {
		setDragActive(true);
		dragObject.current.dragItemTransactions = (transaction: TransactionAPIData) => {
			setTodaysTransactions((p) => {
				p.splice(p.indexOf(transaction), 1);
				return p;
			});
		};
		dragObject.current.globalDragOn = true;
		dragObject.current.dragItemY = dragItemY;
		dragObject.current.paginationDragState.forEach((x) => {
			x(true);
		});
	}

	function handleDragEnd(transaction: TransactionAPIData) {
		const dateO = date;
		const dragOver = document.getElementsByClassName("dragOver");
		if (dragOver.length > 0) {
			const dropContainerDate = dragOver[0].id.substring(0, 10);
			if (!(dropContainerDate === transaction.date)) {
				setDateTransactionsRef.current!(transaction);
				dragObject.current.containerDropped();
			}
		}

		setDragActive(false);
		dragObject.current.globalDragOn = false;
		setDateTransactionsRef.current = undefined;
		dragObject.current.paginationDragState.forEach((x) => {
			x(false);
		});
		dragObject.current.dragItemTransactions(transaction);
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
					{transactionsPaginated &&
						transactionsPaginated[paginationDragState && !dragActive ? transactionsPaginated.length - 1 : transactionPage].map((trans: TransactionAPIData, i: number) => (
							<Transaction index={i} transaction={trans} key={`${dateObj.date}/${dateObj.month}/${dateObj.year}-Trans${i}`} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
						))}
				</div>
				<div style={{ position: "relative", bottom: "15px", left: "1.5px", width: "60%" }}>
					{transactionsPaginated && transactionsPaginated.length > 1 && !dragObject.current.globalDragOn && (
						<CustomPaginator total={transactionsPaginated.length} onChange={pageChangeHandler} currentPage={transactionPage + 1} />
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
