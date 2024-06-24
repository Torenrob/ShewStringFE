import { Ref, ReactNode, useContext, useState, MouseEvent, DragEvent, useMemo } from "react";
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

	const dateString: string = `${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`;

	const getDatesTransactions = useMemo((): TransactionAPIData[] | undefined => {
		const todayTransactions = transactions.get(dateString);
		return todayTransactions;
	}, [transactions, dateString]);

	const transactionsPaginated = useMemo((): TransactionAPIData[][] | null => {
		if (!getDatesTransactions) return null;
		else if (getDatesTransactions.length <= 5) {
			return [getDatesTransactions];
		} else {
			const transactionsPaginated: TransactionAPIData[][] = [];
			const transactionCopy = [...getDatesTransactions];
			do {
				const fourTransactions = transactionCopy.splice(0, 4);
				transactionsPaginated.push(fourTransactions);
			} while (transactionCopy.length > 0);
			return transactionsPaginated;
		}
	}, [getDatesTransactions]);

	function toggleAddTransactionBtn(event: MouseEvent) {
		if (event.type === "mouseenter") setAddTransactionBtnVisible(true);
		if (event.type === "mouseleave") setAddTransactionBtnVisible(false);
	}

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	const { toggle: openDrawer } = useContext(CalendarContext);

	function clickAddTransaction() {
		openDrawer(parseDate(`${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`));
	}

	function pageChangeHandler(page: number) {
		setTransactionPage(page - 1);
	}

	function handleDrop() {}
	function handleDragOver(e: DragEvent<HTMLElement>) {
		console.log("ran");
	}
	function handleDragLeave() {}
	function handleDragStart() {
		setDragActive(true);
	}
	function handleDragEnd() {
		setDragActive(false);
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
				<div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} id={`${dateString}Transactions`} className="transactionContainer overflow-y-scroll pt-1">
					{transactionsPaginated &&
						transactionsPaginated[transactionPage].map((trans: TransactionAPIData, i: number) => (
							<Transaction index={i} transaction={trans} key={`${dateObj.date}/${dateObj.month}/${dateObj.year}-Trans${i}`} handleDragStart={handleDragStart} handleDragEnd={handleDragEnd} />
						))}
				</div>
				{transactionsPaginated && transactionsPaginated.length > 1 && !dragActive && (
					<CustomPaginator total={transactionsPaginated.length} onChange={pageChangeHandler} currentPage={transactionPage + 1} />
				)}
				{addTransactionBtnVisible && (
					<Button onClick={clickAddTransaction} variant="flat" isIconOnly radius="full" color="danger" size="sm" className={`absolute addTransactionBtn`}>
						<AddTransactionIcon />
					</Button>
				)}
			</CardBody>
		</Card>
	);
}
