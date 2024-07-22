import { CSSProperties, MutableRefObject, useEffect, useState, useRef, useCallback, Ref, DragEventHandler, useMemo, SetStateAction, MouseEventHandler, RefObject } from "react";
import { Button } from "@nextui-org/react";
import Marquee from "react-fast-marquee";
import { TransactionAPIData } from "../../../Types/APIDataTypes";
import "./Transaction.css";
import { MotionStyle, motion } from "framer-motion";

export default function Transaction({
	transaction,
	onClick,
	index,
	handleDragStart,
	handleDragEnd,
}: {
	transaction: TransactionAPIData;
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, transaction: TransactionAPIData, f: (t: TransactionAPIData) => void) => void;
	index: number;
	handleDragStart: (dragItemY: number) => void;
	handleDragEnd: (trans: TransactionAPIData) => void;
}) {
	const [marqueePlay, setMarqueePlay] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [transactionInfo, setTransactionInfo] = useState<TransactionAPIData>(transaction);

	function shouldMarqueePlay(): boolean {
		const transactionTitle = transactionInfo?.title ? transactionInfo.title : "";
		if (transactionTitle.length > 32) {
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

	function handleStartDrag(e: PointerEvent | MouseEvent | TouchEvent) {
		btnRef.current?.setAttribute("id", "draggedTransaction");
		handleDragStart(btnRef.current!.getBoundingClientRect().y);
		setDragActive(true);
	}

	function handleEndDrag(e: PointerEvent | MouseEvent | TouchEvent) {
		if (!btnRef.current?.style) return;
		btnRef.current.style.top = "";
		btnRef.current?.removeAttribute("id");
		handleDragEnd(transactionInfo);
		setDragActive(false);
	}

	function updateTransactionBanner(trans: TransactionAPIData) {
		setTransactionInfo(trans);
	}

	return (
		<motion.div
			ref={btnRef}
			onDragStart={(e) => handleStartDrag(e)}
			onDragEnd={handleEndDrag}
			drag
			dragSnapToOrigin
			className={`${transactionInfo.date}`}
			whileDrag={{ position: "absolute", zIndex: 10, width: "200px", pointerEvents: "none", cursor: "grab" }}
			id={`transaction${transaction.id}`}>
			<Button
				onClick={(e) => onClick(e, transactionInfo, updateTransactionBanner)}
				onMouseEnter={marqueeSwitch}
				onMouseLeave={marqueeSwitch}
				variant={dragActive ? "solid" : "ghost"}
				color={transactionInfo?.transactionType === "Credit" ? "success" : "danger"}
				radius="none"
				size="sm"
				className="transaction flex content-between border-0 mb-0.5 h-4 w-auto">
				<span style={{ fontWeight: "bold" }}>
					${transactionInfo?.transactionType === "Credit" ? "" : "("}
					{Number.parseFloat(transactionInfo?.amount.toString() as string).toFixed(2)}
					{transactionInfo?.transactionType === "Debit" && ")"}
				</span>
				{marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} speed={25} play={true}></Marquee>}
				{!marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} play={false}></Marquee>}
			</Button>
		</motion.div>
	);
}
