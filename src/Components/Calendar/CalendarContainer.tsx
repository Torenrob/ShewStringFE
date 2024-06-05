import { createContext, useState, SetStateAction, Dispatch, useRef, MutableRefObject, Ref, RefObject } from "react";
import Calendar from "./Calendar";
import { DateInput, DateValue } from "@nextui-org/react";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "./TransactionInputDrawer";
import { parseDate } from "@internationalized/date";

export type CalendarContextType = {
	toggle: (newDate: DateValue) => void;
};

export const CalendarContext = createContext<CalendarContextType>(undefined!);

export default function CalContainer() {
	const childref = useRef<TransactionInputDrawerRef>(null!);

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
			<div className="grid grid-cols-7 w-full text-xs font-semibold weekdayLabel">
				<div>Sunday</div>
				<div>Monday</div>
				<div>Tuesday</div>
				<div>Wednesday</div>
				<div>Thursday</div>
				<div>Friday</div>
				<div>Saturday</div>
			</div>
			<CalendarContext.Provider value={{ toggle: toggleDrawer }}>
				<TransactionInputDrawer ref={childref} />
				<Calendar />
			</CalendarContext.Provider>
		</div>
	);
}
