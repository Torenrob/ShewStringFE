import { useContext, createContext, useState, useCallback } from "react";
import Calendar from "./Calendar";
import { Input, Select, SelectItem, Textarea, DateInput, Card, CardBody, Chip } from "@nextui-org/react";
import styled from "styled-components";
import CalendarDrawer from "./CalendarDrawer";

export const CalendarContext = createContext<(() => void) | undefined>(undefined);

export default function CalContainer() {
	function toggleDrawer() {
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
			<CalendarDrawer />
			<CalendarContext.Provider value={toggleDrawer}>
				<Calendar />
			</CalendarContext.Provider>
		</div>
	);
}
