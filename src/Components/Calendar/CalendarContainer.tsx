import { createContext, useState, SetStateAction, Dispatch, useRef, MutableRefObject, Ref, RefObject, useCallback, useEffect } from "react";
import Calendar from "./Calendar";
import { Button, DateInput, DateValue } from "@nextui-org/react";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "./TransactionInputDrawer";
import { parseDate } from "@internationalized/date";
import { TransactionAPIData } from "../../Types/APIDataTypes";
import { useMotionValue } from "framer-motion";
import { getDragScrollYOffset } from "../../Utilities/CalendarComponentUtils";
import InvalidSubmitIcon from "./Icons/InvalidSubmitIcon";

export type DragObject = {
	globalDragOn: boolean;
	dropping: boolean | null;
	paginationDragState: { (dragOn: boolean): void }[];
	containerDropped: () => void;
	dragItemTransactions: (transaction: TransactionAPIData) => void;
	dragItemY: number;
};

export type UpdateTransactionContainerInfo = {
	id?: number;
	date?: DateValue;
	title?: string | null;
	amount?: string;
	category?: string;
	description?: string | null;
	bankAccountId?: number;
	editingExisting: boolean;
	transactionObj?: TransactionAPIData;
	deleteTransactionFunc?: (trans: TransactionAPIData) => void;
	editTransactionFunc?: (t: TransactionAPIData) => void;
};

export type editTransDatesFuncsObj = {
	addTransToDate: (t: TransactionAPIData) => void;
	removeTransFromDate: (t: TransactionAPIData) => void;
};

export type CalendarContextType = {
	toggle: (arg: UpdateTransactionContainerInfo) => void;
	dragObject: MutableRefObject<DragObject>;
	dragScrollTrigger: MutableRefObject<boolean>;
	setDateTransactionsRef: MutableRefObject<(transactions: TransactionAPIData) => void> | MutableRefObject<undefined>;
	updateEditTransDatesFuncMap: MutableRefObject<Map<string, editTransDatesFuncsObj>>;
};

export const CalendarContext = createContext<CalendarContextType>(undefined!);

export default function CalendarContainer() {
	const childref = useRef<TransactionInputDrawerRef>(null!);

	const dragObject = useRef<DragObject>({
		globalDragOn: false,
		dropping: null,
		paginationDragState: [],
		containerDropped: () => {},
		dragItemTransactions: (transaction: TransactionAPIData) => {},
		dragItemY: 0,
	});

	const updateEditTransDatesFuncArr = useRef(new Map());

	const setDateTransactionsRef = useRef(undefined);

	const firstDragScrollTrigger = useRef(true);

	function toggleDrawer(arg: UpdateTransactionContainerInfo) {
		childref.current.updateContainer(arg);
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		if (drawer.classList.contains("drawerClosed")) {
			drawer.classList.remove("drawerClosed");
		}
		const titleInput: HTMLInputElement = document.getElementById("TransactionDrawerTitle") as HTMLInputElement;
		titleInput.focus();
	}

	function scrollDrag(direction: string) {
		if (!dragObject.current?.globalDragOn) {
			return;
		}
		const draggedItem = document.getElementById("draggedTransaction");
		if (!draggedItem) {
			return;
		}

		const draggedDate = draggedItem.classList;
		const draggedMonthBox = document.getElementById(`${draggedDate.value.substring(0, 7)}`);
		const monthBoxRectTop = draggedMonthBox!.getBoundingClientRect().top;

		const calendar = document.getElementById("calendar");

		if (direction === "down") {
			calendar?.scrollBy({
				top: 5,
				behavior: "smooth",
			});

			setTimeout(() => (draggedItem.style.top = `${-monthBoxRectTop + getDragScrollYOffset(dragObject.current.dragItemY) + 257}px`), 70);
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
			<CalendarContext.Provider
				value={{
					toggle: toggleDrawer,
					dragObject: dragObject,
					dragScrollTrigger: firstDragScrollTrigger,
					setDateTransactionsRef: setDateTransactionsRef,
					updateEditTransDatesFuncMap: updateEditTransDatesFuncArr,
				}}>
				<TransactionInputDrawer ref={childref} />
				<Calendar />
			</CalendarContext.Provider>
			<div id="bottomCalBound" onMouseOver={(e, direction = "down") => scrollDrag(direction)}></div>
		</div>
	);
}
