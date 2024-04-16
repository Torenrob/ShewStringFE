import { useState } from "react";
import { Button } from "@nextui-org/react";
import Marquee from "react-fast-marquee";
import { BudgetTransaction } from "../../../types/types";
import "./transaction.css";

export default function Transaction({ transaction }: { transaction?: BudgetTransaction }) {
	const [marqueePlay, setMarqueePlay] = useState(false);

	const marquees: Element[] = Array.from(document.getElementsByClassName("transaction"));

	if (marquees[0]) {
		marquees[0].addEventListener("mouseenter", marquee);
		marquees[0].addEventListener("mouseleave", marquee);
	}

	function marquee() {
		const bool = marqueePlay ? false : true;
		setMarqueePlay(bool);
	}

	return (
		<Button variant="ghost" color={transaction?.type === "credit" ? "success" : "danger"} radius="none" size="sm" className="transaction flex content-between border-0 mt-1 h-4">
			<Marquee speed={25} play={marqueePlay}>
				<div style={{ marginRight: "3px" }}>{transaction?.title}</div>
			</Marquee>
			<span>
				{transaction?.type === "credit" ? "+" : "("}
				{transaction?.amount}
				{transaction?.type === "debit" && ")"}
			</span>
		</Button>
	);
}
