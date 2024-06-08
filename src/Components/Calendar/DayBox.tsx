import { Ref, ReactNode, useContext, useState, MouseEvent, createRef, useEffect, useRef, MutableRefObject, useCallback, DragEventHandler, SetStateAction, Dispatch, useMemo } from "react";
import { DateComponentInfo } from "../../Types/CalendarTypes";
import { Button, Card, CardBody, Divider, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Transaction from "./BudgetComponents/Transaction";
import { CalendarContext } from "./CalendarContainer";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import AddTransactionIcon from "./Icons/AddTransactionIcon";
import { parseDate } from "@internationalized/date";

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

	const dateString: string = `${dateObj.year}-${dateObj.month.toString().padStart(2, "0")}-${dateObj.date.toString().padStart(2, "0")}`;

	const getDatesTransactions = useMemo((): TransactionAPIData[] | undefined => {
		const todayTransactions = transactions.get(dateString);
		return todayTransactions;
	}, [transactions, dateString]);

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

	function handleDrop() {}
	function handleDragOver() {}
	function handleDragLeave() {}
	function handleDragStart() {}

	return (
		<Card ref={endRef} radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 outline-black`}>
			<CardBody onMouseEnter={toggleAddTransactionBtn} onMouseLeave={toggleAddTransactionBtn} className="px-1 py-0 overflow-x-hidden overflow-y-hidden" style={{ position: "static" }}>
				<span className="text-right text-sm">{date}</span>
				<Divider />
				<div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} id={`${dateString}Transactions`} className="transactionContainer overflow-y-scroll">
					{getDatesTransactions &&
						getDatesTransactions.map((trans: TransactionAPIData, i: number) => <Transaction index={i} transaction={trans} key={`${dateObj.date}/${dateObj.month}/${dateObj.year}-Trans${i}`} />)}
				</div>
				{addTransactionBtnVisible && (
					<Button onClick={clickAddTransaction} variant="flat" isIconOnly radius="full" color="danger" size="sm" className={`absolute addTransactionBtn`}>
						<AddTransactionIcon />
					</Button>
				)}
			</CardBody>
		</Card>
	);
}
