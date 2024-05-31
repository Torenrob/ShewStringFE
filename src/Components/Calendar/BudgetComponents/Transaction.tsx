import { CSSProperties, MutableRefObject, useEffect, useState, useRef, useCallback, Ref } from "react";
import { Button } from "@nextui-org/react";
import Marquee from "react-fast-marquee";
import { TransactionAPIData } from "../../../Types/APIDataTypes";
import "./Transaction.css";

export default function Transaction({ transaction }: { transaction?: TransactionAPIData }) {
	const [marqueePlay, setMarqueePlay] = useState(false);

	function shouldMarqueePlay(): boolean {
		const transactionTitle = transaction?.title as string;
		if (transactionTitle.length > 38) {
			return true;
		} else {
			return false;
		}
	}

	function marqueeSwitch(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		if (!shouldMarqueePlay()) return;
		const bool = event.type == "mouseenter" ? true : false;
		setMarqueePlay(bool);
	}

	const marqueeStyle: CSSProperties = {
		marginRight: "3px",
		position: "relative",
	};

	return (
		<Button
			onMouseEnter={marqueeSwitch}
			onMouseLeave={marqueeSwitch}
			variant="ghost"
			color={transaction?.transactionType === "Credit" ? "success" : "danger"}
			radius="none"
			size="sm"
			className="transaction flex content-between border-0 mt-1 h-4 w-auto">
			<span>
				{transaction?.transactionType === "Credit" ? "+" : "("}
				{Number.parseFloat(transaction?.amount.toString() as string).toFixed(2)}
				{transaction?.transactionType === "Debit" && ")"}
			</span>
			<Marquee children={transaction?.title} style={marqueeStyle} speed={25} play={marqueePlay}></Marquee>
		</Button>
	);
}
