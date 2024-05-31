import { Ref, ReactNode, useContext, useState, MouseEvent } from "react";
import { DateComponentInfo } from "../../Types/CalendarTypes";
import { Button, Card, CardBody, Divider, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Transaction from "./BudgetComponents/Transaction";
import { CalendarContext } from "./CalendarContainer";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import AddTransactionIcon from "./Icons/AddTransactionIcon";

export default function DayBox({ date, dateObj, endRef }: { date: number; dateObj: DateComponentInfo; endRef?: Ref<HTMLDivElement> }): ReactNode {
	const [addTransactionBtnVisible, setAddTransactionBtnVisible] = useState<boolean>(false);

	const dateString: string = `Date${dateObj.month}-${dateObj.date}-${dateObj.year}`;

	function toggleAddTransactionBtn(event: MouseEvent) {
		if (event.type === "mouseenter") setAddTransactionBtnVisible(true);
		if (event.type === "mouseleave") setAddTransactionBtnVisible(false);
	}

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	const openDrawer = useContext(CalendarContext);

	function dateClick() {
		console.log("Card Clicked");
	}

	return (
		<Card ref={endRef} radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 outline-black`}>
			<CardBody onMouseEnter={toggleAddTransactionBtn} onMouseLeave={toggleAddTransactionBtn} className="p-1 py-0 overflow-x-hidden overflow-y-hidden">
				<span className="text-right text-sm">{date}</span>
				<Divider />
				<div className="transactionContainer overflow-y-scroll">
					{dateObj.transactions &&
						dateObj.transactions.map((trans: TransactionAPIData, i: number) => <Transaction transaction={trans} key={`${dateObj.date}/${dateObj.month}/${dateObj.year}-Trans${i}`} />)}
				</div>
				<Button
					onClick={openDrawer}
					variant="flat"
					isIconOnly
					radius="full"
					color="danger"
					size="sm"
					className={`absolute addTransactionBtn ${addTransactionBtnVisible ? "addTransactionBtnVisible" : ""}`}>
					<AddTransactionIcon />
				</Button>
			</CardBody>
		</Card>
	);
}
