import { createContext, useState, SetStateAction, Dispatch, useRef, MutableRefObject, Ref, RefObject, useCallback, useEffect } from "react";
import Calendar from "./Calendar";
import { DateInput, DateValue } from "@nextui-org/react";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "./TransactionInputDrawer";
import { parseDate } from "@internationalized/date";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import { useMotionValue } from "framer-motion";
import { getDragScrollYOffset } from "../../Utilities/CalendarComponentUtils";

export type DragObject = {
	dragOn: boolean;
	dragItemY: number;
};

export type CalendarContextType = {
	toggle: (arg0: DateValue) => void;
	dragObject: MutableRefObject<DragObject>;
	dragScrollTrigger: MutableRefObject<boolean>;
	setDateTransactionsRef: MutableRefObject<(transactions: TransactionAPIData) => void> | MutableRefObject<undefined>;
};

export const CalendarContext = createContext<CalendarContextType>(undefined!);

export default function CalendarContainer() {
	const childref = useRef<TransactionInputDrawerRef>(null!);

	const dragObject = useRef<DragObject>({
		dragOn: false,
		dragItemY: 0,
	});

	const setDateTransactionsRef = useRef(undefined);

	const firstDragScrollTrigger = useRef(true);

	function toggleDrawer(newDate: DateValue) {
		childref.current.updateDate(newDate);
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		if (drawer.classList.contains("drawerClosed")) {
			drawer.classList.remove("drawerClosed");
		}
		const titleInput: HTMLInputElement = document.getElementById("TransactionDrawerTitle") as HTMLInputElement;
		titleInput.focus();
	}

	function scrollDrag(direction: string) {
		if (!dragObject.current?.dragOn) {
			return;
		}
		const draggedItem = document.getElementById("draggedTransaction");
		if (!draggedItem) {
			return;
		}

		const draggedDate = draggedItem.classList;
		const draggedMonthBox = document.getElementById(`${draggedDate.value.substring(0, 7)}`);
		const monthBoxRectTop = draggedMonthBox!.getBoundingClientRect().top;

		// const draggedOffSet = firstDragScrollTrigger ? monthBoxRectTop + dragItemTop : monthBoxRectTop;

		const calendar = document.getElementById("calendar");

		if (direction === "down") {
			calendar?.scrollBy({
				top: 5,
				behavior: "smooth",
			});

			setTimeout(() => (draggedItem.style.top = `${-monthBoxRectTop + getDragScrollYOffset(dragObject.current.dragItemY) + 260}px`), 70);
		} else if (direction === "up") {
			calendar?.scrollBy({
				top: -5,
				behavior: "smooth",
			});

			setTimeout(() => (draggedItem.style.top = `${-monthBoxRectTop + getDragScrollYOffset(dragObject.current.dragItemY)}px`), 70);
		}
	}

	return (
		<div id="calendarContainer" className="relative flex flex-col calendarContainer overflow-clip">
			<div id="topCalBound" onMouseOver={(e, direction = "up") => scrollDrag(direction)}></div>
			<div className="grid grid-cols-7 w-full text-xs font-semibold weekdayLabel">
				<div>Sunday</div>
				<div>Monday</div>
				<div>Tuesday</div>
				<div>Wednesday</div>
				<div>Thursday</div>
				<div>Friday</div>
				<div>Saturday</div>
			</div>
			<CalendarContext.Provider value={{ toggle: toggleDrawer, dragObject: dragObject, dragScrollTrigger: firstDragScrollTrigger, setDateTransactionsRef: setDateTransactionsRef }}>
				<TransactionInputDrawer ref={childref} />
				<Calendar />
			</CalendarContext.Provider>
			<div id="bottomCalBound" onMouseOver={(e, direction = "down") => scrollDrag(direction)}></div>
		</div>
	);
}
