import "./Transaction.css"
import { CSSProperties, useEffect, useState, useRef, useContext } from "react";
import { Button } from "@nextui-org/react";
import Marquee from "react-fast-marquee";
import { TransactionAPIData } from "../../Types/APIDataTypes.tsx";
import "./Transaction.css";
import { motion } from "framer-motion";
import { CalendarContext } from "../CalendarCtrl/CalendarCtrlExports.tsx";
import { closeDrawer } from "../../Utilities/UtilityFuncs.tsx";

export default function Transaction({
	transaction,
	onClick,
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
		return transactionTitle.length > 32;
	}

	function marqueeOn() {
		if (!shouldMarqueePlay()) return;
		setMarqueePlay(true);
	}

	function marqueeOff() {
		if (!shouldMarqueePlay()) return;
		setMarqueePlay(false);
	}

	const marqueeStyle: CSSProperties = {
		marginRight: "3px",
		position: "relative",
		paddingTop: "1%",
		paddingBottom: "1%",
		fontSize: "0.7rem"
	};

	const btnRef = useRef<HTMLDivElement>(null);

	function handleStartDrag() {
		closeDrawer();
		btnRef.current?.setAttribute("id", "draggedTransaction");
		dragObject.current.globalDragOn = true;
		handleDragStart(btnRef.current!.getBoundingClientRect().y);
		setDragActive(true);
	}

	function handleEndDrag() {
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
		<div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="transWrap">
			<motion.div
				ref={btnRef}
				onDragStart={() => handleStartDrag()}
				onDragEnd={handleEndDrag}
				drag
				dragSnapToOrigin
				style={{ display: mouseOver || dragActive ? "block" : "none" }}
				className={`${transactionInfo.date}`}
				whileDrag={{ position: "absolute", zIndex: 10, width: "200px", pointerEvents: "none", cursor: "grab" }}
				id={`transaction${transactionInfo.id}`}>
				<Button
					onClick={() => onClick(transactionInfo, updateTransactionBanner)}
					onMouseEnter={marqueeOn}
					onMouseLeave={marqueeOff}
					variant={dragActive ? "solid" : "ghost"}
					color={"secondary"}
					radius="none"
					size="sm"
					className={`transaction align-middle flex content-center border-0 mb-0.5 h-4 w-auto rounded-[0.25rem] transClass${transactionInfo.id}`}>
					<span className={`${transactionInfo.transactionType == "Debit" ? "text-red-600" : "text-green-600"} pt-[0.25%] pl-[0.25%] text-[0.7rem]`}>
						${transactionInfo.transactionType === "Credit" ? "" : "("}
						{transactionInfo.amount.toFixed(2)}
						{transactionInfo.transactionType === "Debit" && ")"}
					</span>
					{marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} speed={25} play={true}></Marquee>}
					{!marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} play={false}></Marquee>}
				</Button>
			</motion.div>
			{!dragActive && (
				<Button
					onClick={() => onClick(transactionInfo, updateTransactionBanner)}
					onMouseEnter={marqueeOn}
					onMouseLeave={marqueeOff}
					style={{ display: !mouseOver ? "flex" : "none" }}
					variant={dragActive ? "solid" : "ghost"}
					radius="none"
					size="sm"
					className={`transaction flex border-0 mb-0.5 h-4 w-auto rounded-[0.25rem]  transClass${transactionInfo.id}`}>
					<span className={`${transactionInfo.transactionType == "Debit" ? "text-red-600" : "text-green-600"} font-extrabold pt-[0.25%] pl-[0.25%] text-[0.7rem]`}>
						${transactionInfo?.transactionType === "Credit" ? "" : "("}
						{transactionInfo?.amount.toFixed(2)}
						{transactionInfo?.transactionType === "Debit" && ")"}
					</span>
					{marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} speed={25} play={true}></Marquee>}
					{!marqueePlay && <Marquee children={transactionInfo?.title} style={marqueeStyle} play={false}></Marquee>}
				</Button>
			)}
		</div>
	);
}
