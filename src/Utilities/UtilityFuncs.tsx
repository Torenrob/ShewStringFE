import { ErrorHandler } from "../Helpers/ErrorHandler";
import { getAllBankAccountsAPI } from "../Services/API/BankAccountAPI";
import { BankAccountAPIData, TransactionAPIData } from "../Types/APIDataTypes";
import { LocalMonth } from "../Types/CalendarTypes";

export function getDayOfWeek(num: number): string {
	switch (num) {
		case 1:
			return "Sunday";
		case 2:
			return "Monday";
		case 3:
			return "Tuesday";
		case 4:
			return "Wednesday";
		case 5:
			return "Thursday";
		case 6:
			return "Friday";
		case 7:
			return "Saturday";
		default:
			return "";
	}
}

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
	}, 1.2);
}

//Function to control Yaxis transition keeping months aligned in sync
export function setYtrans(index: number, prevYtrans: number, monthObj: LocalMonth): number {
	const firstDay = new Date(monthObj.year, monthObj.month - 1, 1).getDay();
	if (index === 1) return 0;
	if (firstDay === 0) {
		return prevYtrans;
	} else {
		return prevYtrans + 15;
	}
}

export function setMobileProps(index: number, prevMobileY: number, prevMobileEnd: number, monthObj: LocalMonth): { mobileEnd: number; mobileStart: number; mobileY: number } {
	const lengthOfMnth = new Date(monthObj.year, monthObj.month, 0).getDate();

	if (index == 1) {
		return { mobileStart: 1, mobileEnd: lengthOfMnth % 2 == 0 ? 2 : 1, mobileY: 0 };
	}

	const mS = prevMobileEnd == 1 ? 2 : 1;

	return { mobileStart: mS, mobileEnd: lengthOfMnth % 2 == 0 ? (mS == 1 ? 2 : 1) : mS, mobileY: mS == 1 ? prevMobileY : prevMobileY + 15 };
}

export function closeDrawer() {
	const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
	highlightEditedTransactionSwitch();
	if (!drawer.classList.contains("drawerClosed")) {
		drawer.classList.add("drawerClosed");
	}
}

export function highlightEditedTransactionSwitch(transID?: string) {
	const selectedTransaction = document.getElementsByClassName("selectedTransaction");
	if (transID) {
		if (selectedTransaction.length > 0) {
			Array.from(selectedTransaction).forEach((element) => {
				element.classList.remove("selectedTransaction");
			});
		}
		const transIdDivs = document.getElementsByClassName(`transClass${transID}`);
		Array.from(transIdDivs).forEach((el) => el.classList.add("selectedTransaction"));
		return;
	} else {
		Array.from(selectedTransaction).forEach((element) => {
			element.classList.remove("selectedTransaction");
		});
	}
}

export function calcDailyBalances(allTransactions: Map<string, TransactionAPIData[]>, dontRun?: string): Map<string, number> {
	const dailyBalanceMap = new Map();
	let balanceKeeper: number = 0;

	const sortedTransMap = Array.from(allTransactions);
	sortedTransMap.sort((a, b) => {
		return new Date(a[0]) < new Date(b[0]) ? -1 : 1;
	});

	sortedTransMap.forEach((day) => {
		balanceKeeper = day[1].reduce((balAcc, trans): number => {
			return parseFloat(balAcc.toFixed(2)) + (trans.transactionType === "Debit" ? -trans.amount : trans.amount);
		}, balanceKeeper);

		dailyBalanceMap.delete(day[0]);
		dailyBalanceMap.set(day[0], balanceKeeper.toFixed(2));
	});

	return dailyBalanceMap;
}

export function updateDailyBalances(
	transMap: Map<string, TransactionAPIData[]>,
	dateBalMap: Map<string, number>,
	newTransInfo?: TransactionAPIData,
	oldTransInfo?: TransactionAPIData
): [Map<string, number>, boolean] {
	if (!newTransInfo) {
		const oldTransDateArr = transMap.get(oldTransInfo!.date)!;
		oldTransDateArr?.splice(oldTransDateArr.indexOf(oldTransInfo!), 1);
		if (oldTransDateArr?.length == 0) {
			transMap.delete(oldTransInfo!.date);
		} else {
			transMap.set(oldTransInfo!.date, oldTransDateArr);
		}
		return [calcDailyBalances(transMap), true];
	}

	if (!oldTransInfo || Object.keys(oldTransInfo).length === 0) {
		const targetArr = transMap.get(newTransInfo.date);

		//Due to func call being inside setTimeout newTransInfo gets added to targetArr twice
		//Ensuring it isn't added again if it already exists
		const newTrsDateTrsArr = stopArrDups(targetArr, newTransInfo);

		transMap.set(newTransInfo.date, newTrsDateTrsArr);

		return [calcDailyBalances(transMap), true];
	}

	if (newTransInfo.date === oldTransInfo.date && newTransInfo.amount === oldTransInfo.amount && newTransInfo.transactionType === oldTransInfo.transactionType) {
		return [dateBalMap, false];
	}

	if (newTransInfo.date === oldTransInfo.date) {
		const updatedDateTransArr = transMap.get(newTransInfo.date)!;
		updatedDateTransArr[updatedDateTransArr.indexOf(oldTransInfo)].amount = newTransInfo.amount;
		updatedDateTransArr[updatedDateTransArr.indexOf(oldTransInfo)].transactionType = newTransInfo.transactionType;
		transMap.set(newTransInfo.date, updatedDateTransArr);
		return [calcDailyBalances(transMap), true];
	}

	const oldTrsDateTrsArr = transMap.get(oldTransInfo.date)!;
	const newTrsDateTrsArr = stopArrDups(transMap.get(newTransInfo.date), newTransInfo);
	oldTrsDateTrsArr.splice(oldTrsDateTrsArr.indexOf(oldTransInfo), 1);

	transMap.set(newTransInfo.date, newTrsDateTrsArr);
	if (oldTrsDateTrsArr.length === 0) {
		transMap.delete(oldTransInfo.date);
	} else {
		transMap.set(oldTransInfo.date, oldTrsDateTrsArr);
	}

	return [calcDailyBalances(transMap), true];
}

export function updateDailyBalanceStates(setBalStateMap: Map<string, (arg: number) => void>, dailyBalMap: Map<string, number>): void {
	let balanceKeeper: number = 0;
	const dailyBalArr = Array.from(dailyBalMap.entries());

	const sortedBalStateMap = Array.from(setBalStateMap.entries());
	sortedBalStateMap.sort((a, b) => {
		return new Date(a[0]) < new Date(b[0]) ? -1 : 1;
	});

	sortedBalStateMap.forEach((entry, i) => {
		if (i == 0) {
			if (new Date(dailyBalArr[0][0]).toDateString() === new Date(entry[0]).toDateString() || new Date(dailyBalArr[0][0]) < new Date(entry[0])) {
				balanceKeeper = dailyBalArr[0][1];
				entry[1](balanceKeeper);
				return;
			} else {
				entry[1](balanceKeeper);
				return;
			}
		}

		if (!dailyBalMap.get(entry[0])) {
			entry[1](balanceKeeper);
			return;
		}

		balanceKeeper = dailyBalMap.get(entry[0])!;
		entry[1](balanceKeeper);
	});
}

function stopArrDups(targetArr: TransactionAPIData[] | undefined, newTransInfo: TransactionAPIData): TransactionAPIData[] {
	let newTrsDateTrsArr;
	if (targetArr) {
		if (!targetArr.includes(newTransInfo)) {
			newTrsDateTrsArr = targetArr.concat(newTransInfo);
		} else {
			newTrsDateTrsArr = targetArr;
		}
	} else {
		newTrsDateTrsArr = [newTransInfo];
	}
	return newTrsDateTrsArr;
}

export function getRandomNum(): number {
	return Math.floor(Math.random() * 10000000);
}

export function checkForUser(): boolean {
	if (localStorage.getItem("token")) {
		return true;
	}
	return false;
}
