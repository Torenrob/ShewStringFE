import { Ref, ReactNode } from "react";
import { DateComponentInfo } from "../../types/types";
import { Card, CardBody, Divider } from "@nextui-org/react";
import Transaction from "./budgetComponents/transaction";
import { BudgetTransaction } from "../../types/types";

export default function DayBox({ date, dateObj, endRef }: { date: number; dateObj: DateComponentInfo; endRef?: Ref<HTMLDivElement> }): ReactNode {
	const dateString: string = `${dateObj.month}/${dateObj.date}/${dateObj.year}`;

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	return (
		<Card ref={endRef} radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 outline-black `}>
			<CardBody className="p-1 py-0">
				<span className="text-right text-sm">{date}</span>
				<Divider />
				{dateObj.transactions && dateObj.transactions.map((trans, i) => <Transaction transaction={trans} key={`${dateObj.date}/${dateObj.month}/${dateObj.year}-Trans${i}`} />)}
			</CardBody>
		</Card>
	);
}
