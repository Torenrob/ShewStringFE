import { createContext, useState, SetStateAction, Dispatch, useRef, MutableRefObject, Ref, RefObject } from "react";
import Calendar from "./Calendar";
import { DateInput, DateValue } from "@nextui-org/react";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "./CalendarDrawer";
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
	}

	return (
		<div className="relative flex calendarContainer overflow-hidden">
			<div className="absolute grid grid-cols-7 w-full h-fit text-xs font-semibold" style={{ padding: "0px 26px" }}>
				<div className="weekdayLabel">Sunday</div>
				<div className="weekdayLabel">Monday</div>
				<div className="weekdayLabel">Tuesday</div>
				<div className="weekdayLabel">Wednesday</div>
				<div className="weekdayLabel">Thursday</div>
				<div className="weekdayLabel">Friday</div>
				<div className="weekdayLabel">Saturday</div>
			</div>
			<TransactionInputDrawer ref={childref} />
			<CalendarContext.Provider value={{ toggle: toggleDrawer }}>
				<Calendar />
			</CalendarContext.Provider>
		</div>
	);
}
