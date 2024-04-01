import { LegacyRef, ReactNode } from "react";
import { CalDate } from "./monthBox";
import { Card, CardBody, Divider } from "@nextui-org/react";
import Transactions from "./budgetComponents/transactions";

export default function DayBox({ date, dateObj, endRef, ta }: { date: number; dateObj: CalDate; endRef?: LegacyRef<HTMLDivElement>; ta: boolean }): ReactNode {
	const dateString: string = `${dateObj.month}/${dateObj.date}/${dateObj.year}`;

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	return (
		<Card isPressable ref={endRef} radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 outline-black `}>
			<CardBody className="p-1 py-0">
				<span className="text-right text-sm">{date}</span>
				<Divider />
				{ta && <Transactions />}
			</CardBody>
		</Card>
	);
}
