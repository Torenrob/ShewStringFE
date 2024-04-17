import { Ref, ReactNode, useContext } from "react";
import { DateComponentInfo } from "../../types/types";
import { Card, CardBody, Divider, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import Transaction from "./budgetComponents/transaction";
import { BudgetTransaction } from "../../types/types";
import { CalendarContext } from "../calContainer";

export default function DayBox({ date, dateObj, endRef }: { date: number; dateObj: DateComponentInfo; endRef?: Ref<HTMLDivElement> }): ReactNode {
	const dateString: string = `Date${dateObj.month}-${dateObj.date}-${dateObj.year}`;

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	const openDrawer = useContext(CalendarContext);

	function dateClick() {
		console.log("Card Clicked");
	}

	return (
		<Card ref={endRef} radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 outline-black `}>
			<CardBody onClick={openDrawer} className="p-1 py-0">
				<span className="text-right text-sm">{date}</span>
				<Divider />
				{dateObj.transactions && dateObj.transactions.map((trans, i) => <Transaction transaction={trans} key={`${dateObj.date}/${dateObj.month}/${dateObj.year}-Trans${i}`} />)}
			</CardBody>
		</Card>
	);
}
