import { LocalMonth } from "../Types/CalendarTypes";

export function getMonthName(num: number) {
	let name: string = "";

	switch (num) {
		case 1:
			name = "JANUARY";
			break;
		case 2:
			name = "FEBRUARY";
			break;
		case 3:
			name = "MARCH";
			break;
		case 4:
			name = "APRIL";
			break;
		case 5:
			name = "MAY";
			break;
		case 6:
			name = "JUNE";
			break;
		case 7:
			name = "JULY";
			break;
		case 8:
			name = "AUGUST";
			break;
		case 9:
			name = "SEPTEMBER";
			break;
		case 10:
			name = "OCTOBER";
			break;
		case 11:
			name = "NOVEMBER";
			break;
		case 12:
			name = "DECEMBER";
			break;
	}

	return name;
}

export function focusToday() {
	//Brings the current date into view on Calendar
	let currentDate = new Date().toLocaleDateString();
	console.log(currentDate);
	const currentDateArr = currentDate.split("/");
	currentDate = currentDateArr[2] + "-" + currentDateArr[0].padStart(2, "0") + "-" + currentDateArr[1].padStart(2, "0");
	setTimeout(() => {
		const elem = document.getElementById(`Date${currentDate}`);
		elem?.scrollIntoView({ behavior: "instant" });
	}, 0.5);
}

//Function to control Yaxis transition keeping months aligned in sync
export function setYtrans(index: number, prevYtrans: number, monthObj: LocalMonth): number {
	const firstDay = new Date(monthObj.year, monthObj.month - 1, 1).getDay();
	if (index === 0) return prevYtrans;
	if (firstDay === 0) {
		return prevYtrans;
	} else {
		return prevYtrans + 128;
	}
}
