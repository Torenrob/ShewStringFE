import { useContext, createContext, useState, useCallback } from "react";
import Calendar from "./calendar/calendar";
import { Input, Select, SelectItem, Textarea, DateInput, Card, CardBody, Chip } from "@nextui-org/react";
import styled from "styled-components";

export const CalendarContext = createContext<(() => void) | undefined>(undefined);

export default function CalContainer() {
	const drawerStyle = {
		zIndex: 2,
		backgroundColor: "rgba(0, 0, 0,.8)",
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
			<div className="absolute grid grid-cols-7 w-full h-fit text-xs font-semibold" style={{ padding: "0px 28.8px" }}>
				<div className="weekdayLabel">Sunday</div>
				<div className="weekdayLabel">Monday</div>
				<div className="weekdayLabel">Tuesday</div>
				<div className="weekdayLabel">Wednesday</div>
				<div className="weekdayLabel">Thursday</div>
				<div className="weekdayLabel">Friday</div>
				<div className="weekdayLabel">Saturday</div>
			</div>
			<div id="calendarDrawer" className="absolute self-end transactionDrawer py-2 drawerClosed" style={drawerStyle}>
				<form className="w-full px-64 grid grid-col-4 grid-rows-2 gap-3 transactionForm">
					<div className=" col-start-1 row-start-1 col-span-2 flex gap-3">
						<Input radius="none" size="sm" className="w-3/5 text-slate-500 basis-3/4" type="text" label="Title" />
						<Select radius="none" className="text-slate-500 col-start-2 row-start-1 basis-1/4" size="sm" label="Type">
							<SelectItem key="debit">Debit</SelectItem>
							<SelectItem key="credit">Credit</SelectItem>
						</Select>
					</div>
					<DateInput radius="none" className="col-start-1 row-start-2" label="Transaction Date" size="sm" />
					<Input radius="none" size="sm" className="text-slate-500 col-start-2 row-start-2 " type="number" label="Amount" />
					<Select radius="none" size="sm" label="Account" className="h-4 text-slate-500 col-start-3 row-start-1 ">
						<SelectItem key="income">Bank of America</SelectItem>
						<SelectItem key="groceries">Chase</SelectItem>
					</Select>
					<Select radius="none" size="sm" label="Category" className="h-4 text-slate-500 col-start-3 row-start-2 ">
						<SelectItem key="income">Income</SelectItem>
						<SelectItem key="groceries">Groceries</SelectItem>
						<SelectItem key="bills">Bills</SelectItem>
					</Select>
					<Textarea radius="none" className="col-start-4 row-start-1 row-span-2 mt-1" label="Description" />
				</form>
			</div>
			<CalendarContext.Provider value={toggleDrawer}>
				<Calendar />
			</CalendarContext.Provider>
		</div>
	);
}
