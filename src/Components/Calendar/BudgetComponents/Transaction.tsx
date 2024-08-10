import { CSSProperties, MutableRefObject, useEffect, useState, useRef, useContext } from "react";
import { Button } from "@nextui-org/react";
import Marquee from "react-fast-marquee";
import { TransactionAPIData } from "../../../Types/APIDataTypes";
import "./Transaction.css";
import { MotionStyle, motion } from "framer-motion";
import { CalendarContext } from "../CalendarContainer";
import { closeDrawer } from "../../../Utilities/CalendarComponentUtils";

export default function Transaction({
	transaction,
	onClick,
	index,
	handleDragStart,
	handleDragEnd,
}: {
	transaction: TransactionAPIData;
	onClick: (transaction: TransactionAPIData, f: (t: TransactionAPIData) => void) => void;
	index: number;
	handleDragStart: (dragItemY: number) => void;
	handleDragEnd: (trans: TransactionAPIData) => void;
}) {
	const [marqueePlay, setMarqueePlay] = useState(false);
	const [dragActive, setDragActive] = useState(false);
	const [mouseOver, setMouseOver] = useState(false);
	const [transactionInfo, setTransactionInfo] = useState<TransactionAPIData>(transaction);

	const { dragObject } = useContext(CalendarContext);

	useEffect(() => {
		setTransactionInfo(transaction);
	}, [transaction]);

	function shouldMarqueePlay(): boolean {
		const transactionTitle = transactionInfo?.title ? transactionInfo.title : "";
		if (transactionTitle.length > 32) {
			return true;
		} else {
			return false;
		}
	}

	function marqueeOn(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		if (!shouldMarqueePlay()) return;
		setMarqueePlay(true);
	}

	function marqueeOff(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		if (!shouldMarqueePlay()) return;
		setMarqueePlay(false);
	}

	const marqueeStyle: CSSProperties = {
		marginRight: "3px",
		position: "relative",
		fontWeight: "bold",
	};

	const btnRef = useRef<HTMLDivElement>(null);

	function handleStartDrag(e: PointerEvent | MouseEvent | TouchEvent) {
		closeDrawer();
		btnRef.current?.setAttribute("id", "draggedTransaction");
		dragObject.current.globalDragOn = true;
		handleDragStart(btnRef.current!.getBoundingClientRect().y);
		setDragActive(true);
	}

	function handleEndDrag(e: PointerEvent | MouseEvent | TouchEvent) {
		setMouseOver(false);
		dragObject.current.globalDragOn = false;
		if (!btnRef.current?.style) return;
		btnRef.current.style.top = "";
		btnRef.current?.removeAttribute("id");
		handleDragEnd(transactionInfo);
		setDragActive(false);
	}

	function updateTransactionBanner(trans: TransactionAPIData) {
		setTransactionInfo(trans);
	}

	function onMouseEnter() {
		setMouseOver(true);
	}

	function onMouseLeave() {
		if (!dragActive) setMouseOver(false);
	}

	return (
		<div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			<motion.div
				ref={btnRef}
				onDragStart={(e) => handleStartDrag(e)}
				onDragEnd={handleEndDrag}
				drag
				dragSnapToOrigin
				style={{ display: mouseOver || dragActive ? "block" : "none" }}
				className={`${transactionInfo.date}`}
				whileDrag={{ position: "absolute", zIndex: 10, width: "200px", pointerEvents: "none", cursor: "grab" }}
				id={`transaction${transactionInfo.id}`}>
				<Button
					onClick={(e) => onClick(transactionInfo, updateTransactionBanner)}
					onMouseEnter={marqueeOn}
					onMouseLeave={marqueeOff}
					variant={dragActive ? "solid" : "ghost"}
					color={transactionInfo?.transactionType === "Credit" ? "success" : "danger"}
					radius="none"
					size="sm"
					className={`transaction flex content-between border-0 mb-0.5 h-4 w-auto transClass${transactionInfo.id}`}>
					<span style={{ fontWeight: "bold" }}>
						${transactionInfo?.transactionType === "Credit" ? "" : "("}
						{Number.parseFloat(transactionInfo?.amount.toString() as string).toFixed(2)}
						{transactionInfo?.transactionType === "Debit" && ")"}
					</span>
					{marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} speed={25} play={true}></Marquee>}
					{!marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} play={false}></Marquee>}
				</Button>
			</motion.div>
			{!dragActive && (
				<Button
					onClick={(e) => onClick(transactionInfo, updateTransactionBanner)}
					onMouseEnter={marqueeOn}
					onMouseLeave={marqueeOff}
					style={{ display: !mouseOver ? "flex" : "none" }}
					variant={dragActive ? "solid" : "ghost"}
					color={transactionInfo?.transactionType === "Credit" ? "success" : "danger"}
					radius="none"
					size="sm"
					className={`transaction flex content-between border-0 mb-0.5 h-4 w-auto transClass${transactionInfo.id}`}>
					<span style={{ fontWeight: "bold" }}>
						${transactionInfo?.transactionType === "Credit" ? "" : "("}
						{Number.parseFloat(transactionInfo?.amount.toString() as string).toFixed(2)}
						{transactionInfo?.transactionType === "Debit" && ")"}
					</span>
					{marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} speed={25} play={true}></Marquee>}
					{!marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} play={false}></Marquee>}
				</Button>
			)}
		</div>
	);
}
