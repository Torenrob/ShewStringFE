import { MutableRefObject, useContext } from "react";
import { DateValue } from "@nextui-org/react";
import { BankAccountAPIData, TransactionAPIData } from "../../../Types/APIDataTypes";
import { editTransOnDateFuncs } from "./Calendar/MonthBox/DayBox/DayBox";
import { CalendarContext, MonthRange } from "../CalendarCtrl";
import { getDragScrollYOffset } from "../../../Utilities/UtilityFuncs";
import Calendar from "./Calendar/Calendar";

export default function CalendarContainer({ selectAccount, monthRange }: { selectAccount: BankAccountAPIData; monthRange: MonthRange | null }) {
	const { dragObject } = useContext(CalendarContext);

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

		// const draggedOffSet = firstDragScrollTrigger ? monthBoxRectTop + dragItemTop : monthBoxRectTop;

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

	console.log(selectAccount);

	return (
		<div id="calendarContainer" className="relative calendarContainer">
			<div id="topCalBound" onMouseOver={(e, direction = "up") => scrollDrag(direction)} className="flex justify-center">
				{/* <div className="self-end" style={{ position: "relative", top: "10px" }}>
					↑ Drag Scroll ↑
				</div> */}
			</div>
			<Calendar transactions={selectAccount.transactions} key="calendar" monthRange={monthRange} />
			<div id="bottomCalBound" onMouseOver={(e, direction = "down") => scrollDrag(direction)}></div>
		</div>
	);
}
