import { useEffect, useState } from "react";
import MonthBox from "./monthBox";

interface LocalDate {
	dayOfWeek: number;
	date: number;
	month: number;
	year: number;
}

const currentUTC: Date = new Date();

//Break Down Current UTC Date into Local Date Object for Current User Calendar(U.S.)
function getLocalDate(curDate: Date): LocalDate {
	const locString: string = curDate.toLocaleDateString();
	const dateObject: LocalDate = {
		dayOfWeek: curDate.getDay(),
		date: Number(locString.match(/\/([^/]+)\//)![1]),
		month: Number(locString.match(/^([^/]+)/)),
		year: Number(locString.match(/(?:\/[^/]+){2}\/(.+)/)),
	};

	return dateObject;
}

function calDate({ index, curDate }: { index: number; curDate: Date }): number {
	if (index === 3) {
		return getLocalDate(curDate).date;
	} else {
		const diff: number = index - 3;
		const newDate: Date = new Date(curDate.month + diff);
		return getLocalDate(newDate).date;
	}
}

const monthComponents = [...Array(7)].map((x, i) => <MonthBox dateToInit={calDate({ index: i, curDate: currentUTC })} />);

export default function useCalendarScroll(direction: string) {
	const [loading, setLoading] = useState(false);
	const [months, setMonths] = useState(monthComponents);

	setMonths((prev) => {
		if (direction === "future") prev.push();
	});

	return { loading, months };
}
