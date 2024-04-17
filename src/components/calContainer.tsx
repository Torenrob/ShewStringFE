import { useContext, createContext, useState } from "react";
import Calendar from "./calendar/calendar";
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import styled from "styled-components";

export const CalendarContext = createContext<(() => void) | undefined>(undefined);

export default function CalContainer() {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const drawerStyle = {
		zIndex: 2,
		backgroundColor: "rgba(43, 43, 43, 0.384)",
		width: "100%",
	};

	function toggleDrawer() {
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		if ([...drawer.classList].includes("drawerClosed")) {
			drawer.classList.remove("drawerClosed");
		} else {
			drawer.classList.add("drawerClosed");
		}
	}

	return (
		<div className="relative flex calendarContainer overflow-hidden">
			<div id="calendarDrawer" className="absolute self-end rounded-t-full transactionDrawer py-3 drawerClosed" style={drawerStyle}>
				<form className="w-full px-60 grid grid-col-3 grid-rows-3 gap-3 transactionForm">
					<Input radius="sm" size="sm" className="w-3/5 h-9 text-slate-500 col-start-1 row-start-1 justify-self-end" type="text" label="Title" />
					<Input radius="sm" size="sm" className="w-3/5 h-9 text-slate-500 col-start-1 row-start-2 justify-self-end" type="number" label="Amount" />
					<Select className="w-3/5 h-4 text-slate-500 col-start-1 row-start-3 justify-self-end" radius="sm" size="sm" label="Type">
						<SelectItem key="debit">Debit</SelectItem>
						<SelectItem key="credit">Credit</SelectItem>
					</Select>
					<Textarea className="col-start-2 row-start-1 row-span-3" label="Notes" />
					<Select size="sm" radius="sm" label="Category" className="h-4 text-slate-500 col-start-3 row-start-1 ">
						<SelectItem key="income">Income</SelectItem>
						<SelectItem key="groceries">Groceries</SelectItem>
						<SelectItem key="bills">Bills</SelectItem>
					</Select>
				</form>
			</div>
			<CalendarContext.Provider value={toggleDrawer}>
				<Calendar />
			</CalendarContext.Provider>
		</div>
	);
}
