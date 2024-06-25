import { createContext, useState, SetStateAction, Dispatch, useRef, MutableRefObject, Ref, RefObject } from "react";
import Calendar from "./Calendar";
import { DateInput, DateValue } from "@nextui-org/react";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "./TransactionInputDrawer";
import { parseDate } from "@internationalized/date";
import { TransactionAPIData } from "../../Types/APIDataTypes";

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

	function toggleDrawer(newDate: DateValue) {
		childref.current.updateDate(newDate);
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		if (drawer.classList.contains("drawerClosed")) {
			drawer.classList.remove("drawerClosed");
		}
		const titleInput: HTMLInputElement = document.getElementById("TransactionDrawerTitle") as HTMLInputElement;
		titleInput.focus();
	}

	return (
		<div className="relative flex flex-col calendarContainer overflow-clip">
			<div id="topCalBound"></div>
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
