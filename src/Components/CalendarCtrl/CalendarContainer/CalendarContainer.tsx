import { MutableRefObject, useContext } from "react";
import { DateValue } from "@nextui-org/react";
import { BankAccountAPIData, TransactionAPIData } from "../../../Types/APIDataTypes";
import { editTransOnDateFuncs } from "./Calendar/MonthBox/DayBox/DayBox";
import { CalendarContext, MonthRange } from "../CalendarCtrl";
import { getDragScrollYOffset } from "../../../Utilities/UtilityFuncs";
import Calendar from "./Calendar/Calendar";

export default function CalendarContainer({ selectAccount, monthRange, monthLabelCntl }: { selectAccount: BankAccountAPIData; monthRange: MonthRange | null; monthLabelCntl: (a: string[]) => void }) {
	return (
		<div id="calendarContainer" className="relative calendarContainer">
			<Calendar monthLabelCntl={monthLabelCntl} transactions={selectAccount.transactions} key="calendar" monthRange={monthRange} />
		</div>
	);
}
