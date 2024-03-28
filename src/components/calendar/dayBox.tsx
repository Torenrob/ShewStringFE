import { ReactNode, useCallback, useRef } from "react";
import { CalDate } from "./monthBox";
import { Card, CardBody, Divider, checkbox } from "@nextui-org/react";

export default function DayBox({ date, dateObj }: { date: number; dateObj: CalDate }): ReactNode {
	const dateString: string = `${dateObj.month}/${dateObj.date}/${dateObj.year}`;

	const gridStyle = {
		gridColumnStart: dateObj.dayOfWeek,
		gridColumnEnd: dateObj.dayOfWeek + 1,
	};

	return (
		<Card radius="none" shadow="none" id={dateString} style={gridStyle} className={`dayBox outline outline-1 outline-black `}>
			<CardBody className="p-1 py-0">
				<span className="text-right text-sm">{date}</span>
				<Divider />
			</CardBody>
		</Card>
	);
}
