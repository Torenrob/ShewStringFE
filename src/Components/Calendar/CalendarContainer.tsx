import { createContext, useState, SetStateAction, Dispatch, useRef, MutableRefObject, Ref, RefObject } from "react";
import Calendar from "./Calendar";
import { DateInput, DateValue } from "@nextui-org/react";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "./TransactionInputDrawer";
import { parseDate } from "@internationalized/date";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import { useMotionValue } from "framer-motion";

export type CalendarContextType = {
	toggle: (arg0: DateValue) => void;
	activeDrag: MutableRefObject<boolean>;
	setDateTransactionsRef: MutableRefObject<(transactions: TransactionAPIData) => void> | MutableRefObject<undefined>;
};

export const CalendarContext = createContext<CalendarContextType>(undefined!);

export default function CalendarContainer() {
	const childref = useRef<TransactionInputDrawerRef>(null!);

	const dragActive = useRef<boolean>(false);

	const setDateTransactionsRef = useRef(undefined);

	const mouse = {
		y: useMotionValue(0),
	};

	function toggleDrawer(newDate: DateValue) {
		childref.current.updateDate(newDate);
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		if (drawer.classList.contains("drawerClosed")) {
			drawer.classList.remove("drawerClosed");
		}
		const titleInput: HTMLInputElement = document.getElementById("TransactionDrawerTitle") as HTMLInputElement;
		titleInput.focus();
	}

	function scrollUp(e: React.MouseEvent) {
		if (!dragActive.current) {
			return;
		}
		const draggedItem = document.getElementById("draggedTransaction");
		if (!draggedItem) {
			return;
		}

		mouse.y.set(e.pageY);

		const rect1 = draggedItem.getBoundingClientRect();

		setTimeout(() => (draggedItem.style.top = "25px"), 90);

		const rect = draggedItem.getBoundingClientRect();

		console.log(rect1.top);
		console.log(rect.top);

		const calendar = document.getElementById("calendar");
		calendar?.scrollBy({
			top: -5,
			behavior: "smooth",
		});
		// CalendarDiv.current?.scrollBy(0, 5);
	}

	return (
		<div className="relative flex flex-col calendarContainer overflow-clip">
			<div id="topCalBound" onMouseOver={scrollUp}></div>
			<div className="grid grid-cols-7 w-full text-xs font-semibold weekdayLabel">
				<div>Sunday</div>
				<div>Monday</div>
				<div>Tuesday</div>
				<div>Wednesday</div>
				<div>Thursday</div>
				<div>Friday</div>
				<div>Saturday</div>
			</div>
			<CalendarContext.Provider value={{ toggle: toggleDrawer, activeDrag: dragActive, setDateTransactionsRef: setDateTransactionsRef }}>
				<TransactionInputDrawer ref={childref} />
				<Calendar />
			</CalendarContext.Provider>
			<div id="bottomCalBound"></div>
		</div>
	);
}
