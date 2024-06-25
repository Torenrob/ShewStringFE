import { CSSProperties, MutableRefObject, useEffect, useState, useRef, useCallback, Ref, DragEventHandler, useMemo, SetStateAction } from "react";
import { Button } from "@nextui-org/react";
import Marquee from "react-fast-marquee";
import { TransactionAPIData } from "../../../Types/APIDataTypes";
import "./Transaction.css";
import { MotionStyle, motion } from "framer-motion";

export default function Transaction({
	transaction,
	index,
	handleDragStart,
	handleDragEnd,
}: {
	transaction: TransactionAPIData;
	index: number;
	handleDragStart: () => void;
	handleDragEnd: () => void;
}) {
	const [marqueePlay, setMarqueePlay] = useState(false);
	const [dragActive, setDragActive] = useState(false);

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
		fontWeight: "bold",
	};

	const btnRef = useRef<HTMLDivElement>(null);

	function getTransactionYpostion(): number {
		let elementPosition = btnRef.current?.getBoundingClientRect().top;
		elementPosition = elementPosition ? elementPosition / 2 : undefined;
		return elementPosition as number;
	}

	function handleStartDrag() {
		btnRef.current?.setAttribute("id", "draggedTransaction");
		handleDragStart();
		setDragActive(true);
	}

	function handleEndDrag() {
		handleDragEnd();
		setDragActive(false);
	}

	const dragStyle: MotionStyle = {
		position: "absolute",
		zIndex: 100,
	};

	return (
		// <motion.div ref={conref} drag>
		// 	<motion.span>Hello</motion.span>
		// </motion.div>
		<motion.div
			ref={btnRef}
			onDragStart={handleStartDrag}
			onDragEnd={handleEndDrag}
			drag
			dragSnapToOrigin
			whileDrag={{ position: "absolute", zIndex: 10, width: "200px", pointerEvents: "none", cursor: "grab" }}
			id={`transaction${transaction.id}`}>
			<Button
				onMouseEnter={marqueeSwitch}
				onMouseLeave={marqueeSwitch}
				variant={dragActive ? "solid" : "ghost"}
				color={transaction?.transactionType === "Credit" ? "success" : "danger"}
				radius="none"
				size="sm"
				className="transaction flex content-between border-0 mb-0.5 h-4 w-auto">
				<span style={{ fontWeight: "bold" }}>
					${transaction?.transactionType === "Credit" ? "" : "("}
					{Number.parseFloat(transaction?.amount.toString() as string).toFixed(2)}
					{transaction?.transactionType === "Debit" && ")"}
				</span>
				{marqueePlay && <Marquee children={transaction?.title} style={marqueeStyle} speed={25} play={true}></Marquee>}
				{!marqueePlay && <Marquee children={transaction?.title} style={marqueeStyle} play={false}></Marquee>}
			</Button>
		</motion.div>
	);
}
