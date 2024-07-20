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

export function getDragScrollYOffset(dragItemRectY: number): number {
	if (dragItemRectY < 52) return -88;
	if (dragItemRectY < 69) return -70;
	if (dragItemRectY < 86) return -55;
	if (dragItemRectY < 103) return -35;
	if (dragItemRectY < 140) return -18;
	if (dragItemRectY < 179) return 40;
	if (dragItemRectY < 195) return 53;
	if (dragItemRectY < 215) return 75;
	if (dragItemRectY < 232) return 92;
	if (dragItemRectY < 275) return 110;
	if (dragItemRectY < 306) return 170;
	if (dragItemRectY < 323) return 185;
	if (dragItemRectY < 341) return 203;
	if (dragItemRectY < 360) return 221;
	if (dragItemRectY < 400) return 240;
	if (dragItemRectY < 433) return 297;
	if (dragItemRectY < 450) return 315;
	if (dragItemRectY < 470) return 330;
	if (dragItemRectY < 486) return 348;
	if (dragItemRectY < 525) return 367;
	if (dragItemRectY < 560) return 422;
	if (dragItemRectY < 579) return 440;
	if (dragItemRectY < 597) return 460;
	if (dragItemRectY < 614) return 480;
	if (dragItemRectY < 656) return 495;
	if (dragItemRectY < 688) return 550;
	if (dragItemRectY < 706) return 570;
	if (dragItemRectY < 724) return 587;
	if (dragItemRectY < 742) return 605;
	if (dragItemRectY < 760) return 622;
	return 0;
}

export function focusToday() {
	//Brings the current date into view on Calendar
	let currentDate = new Date().toLocaleDateString();
	const currentDateArr = currentDate.split("/");
	currentDate = currentDateArr[2] + "-" + currentDateArr[0].padStart(2, "0") + "-" + currentDateArr[1].padStart(2, "0");
	setTimeout(() => {
		const elem = document.getElementById(currentDate);
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
