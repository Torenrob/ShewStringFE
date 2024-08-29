import React, { act, ChangeEvent, createContext, FormEvent, FormEventHandler, Key, MutableRefObject, RefObject, UIEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BankAccountAPIData, TransactionAPIData } from "../../Types/APIDataTypes";
import { getAllBankAccountsAPI } from "../../Services/API/BankAccountAPI";
import { Button, DateRangePicker, DateValue, Input, Tab, Tabs, useTabs } from "@nextui-org/react";
import SpanIcon from "../Icons/SpanIcon";
import CheckIcon from "../Icons/CheckIcon";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import AddAccountModal from "./AddAccountModal";
import SettingsIcon from "../Icons/SettingsIcon";
import DelAccountModal from "./DelAccountModal";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "./TransactionInputDrawer";
import { editTransOnDateFuncs } from "./CalendarContainer/Calendar/MonthBox/DayBox/DayBox";
import CalendarContainer from "./CalendarContainer/CalendarContainer";
import { getDragScrollYOffset, getMonthName } from "../../Utilities/UtilityFuncs";
import Calendar from "./CalendarContainer/Calendar/Calendar";

export type MonthRange = {
	startMonth: string;
	endMonth: string;
};

export type DragObject = {
	globalDragOn: boolean;
	dropping: boolean | null;
	paginationDragState: { (dragOn: boolean): void }[];
	containerDropped: () => void;
	removeTransactionFromDate: (transaction: TransactionAPIData) => void;
	dragItemY: number;
};

export type UpdateTransactionContainerInfo = {
	id?: number;
	date?: DateValue;
	title?: string | null;
	amount?: string;
	transactionType?: "Debit" | "Credit";
	category?: string;
	description?: string | null;
	bankAccountId?: number;
	editingExisting: boolean;
	transactionObj?: TransactionAPIData;
	deleteTransactionFromDate?: (trans: TransactionAPIData) => void;
	editTransactionFunc?: (t: TransactionAPIData) => void;
};

export type CalendarContextType = {
	openDrawer: (arg: UpdateTransactionContainerInfo) => void;
	dragObject: MutableRefObject<DragObject>;
	dailyBalancesMap: MutableRefObject<Map<string, number>>;
	setStateDailyBalanceMap: MutableRefObject<Map<string, (arg: number) => void>>;
	dateTransactionsMap: MutableRefObject<Map<string, TransactionAPIData[]> | null>;
	addTransToDate: MutableRefObject<(transactions: TransactionAPIData) => void> | MutableRefObject<undefined>;
	editTransOnDatesFuncsMap: MutableRefObject<Map<string, editTransOnDateFuncs>>;
};

export const CalendarContext = createContext<CalendarContextType>(undefined!);

export default function CalendarCtrl() {
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([]);
	const [selectedAcct, setSelectedAcct] = useState<string>("0");
	const [addAcctModalOpen, setAddAcctModalOpen] = useState<boolean>(false);
	const [delAcctModalOpen, setDelAcctModalOpen] = useState<boolean>(false);
	const [monthRange, setMonthRange] = useState<MonthRange | null>(null);
	const [monthLabel, setMonthLabel] = useState<string>(`${new Date().toLocaleDateString()}`);
	const [isLoading, setLoading] = useState<boolean>(true);

	const childref = useRef<TransactionInputDrawerRef>(null!);

	const dragObject = useRef<DragObject>({
		globalDragOn: false,
		dropping: null,
		paginationDragState: [],
		containerDropped: () => {},
		removeTransactionFromDate: (transaction: TransactionAPIData) => {},
		dragItemY: 0,
	});

	const dailyBalancesMap = useRef(new Map());

	const dateTransactionsMap = useRef(new Map());

	const setStateDailyBalance = useRef(new Map());

	const addTransToDate = useRef(undefined);

	const editTransOnDatesFuncMap = useRef(new Map<string, editTransOnDateFuncs>());

	function openDrawer(arg: UpdateTransactionContainerInfo) {
		childref.current.updateContainer(arg);
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		if (drawer.classList.contains("drawerClosed")) {
			drawer.classList.remove("drawerClosed");
		}
		const titleInput: HTMLInputElement = document.getElementById("TransactionDrawerTitle") as HTMLInputElement;
		titleInput.focus();
	}

	//Just to save last choice after clicking add acct
	const curAcct: MutableRefObject<string> = useRef<string>("0");

	useEffect(() => {
		const AddAccountTabHolder: BankAccountAPIData = { title: "Add Account", repeatGroups: [], accountType: "Saving", id: 0, transactions: new Map() };

		const getAccountOptions = async () => {
			try {
				const bankAccounts: BankAccountAPIData[] | null = await getAllBankAccountsAPI();
				setBankAccounts((p) => bankAccounts.concat(AddAccountTabHolder));
				curAcct.current = bankAccounts[0].id.toString();
				setSelectedAcct(bankAccounts[0].id.toString());
			} catch (err) {
				ErrorHandler(err);
			} finally {
				setLoading(false);
			}
		};
		getAccountOptions();
	}, []);

	const tabsRef = useRef<HTMLDivElement>(null);
	const acctScrollCont = useRef<HTMLDivElement>(null);

	//Function for updating acct transactions when submitting trans for a different account than currently chosen
	const updateAcctTransactions = (arg0: TransactionAPIData) => {
		const subTransAcctMap: Map<string, TransactionAPIData[]> = bankAccounts.find((acct) => acct.id === arg0.bankAccountId)!.transactions;
		const updArr = subTransAcctMap.get(arg0.date) ? subTransAcctMap.get(arg0.date) : [arg0];
		setBankAccounts((p) => {
			const updAcctsArr: BankAccountAPIData[] = p.map((acct) => {
				if (acct.id === arg0.bankAccountId) {
					acct.transactions.set(arg0.date, updArr!);
				}
				return acct;
			});
			return updAcctsArr;
		});
	};

	const addNewAcct = (newAcct: BankAccountAPIData) => {
		setBankAccounts((p) => {
			const addAcctTab: BankAccountAPIData = p.pop()!;
			return p.concat(newAcct).concat(addAcctTab);
		});
		console.log(newAcct.id);
		setSelectedAcct(newAcct.id.toString());
	};

	const delAcct = (delAcct: BankAccountAPIData) => {
		setBankAccounts((p) => {
			p.splice(p.indexOf(delAcct), 1);
			return p;
		});
	};

	useEffect(() => {
		if (tabsRef.current === null) return;
		if (tabsRef.current.clientWidth === 0) return;
		const numAccts = bankAccounts.length;
		const updWidth = numAccts * 130 - numAccts * 15.5;
		tabsRef.current.style.width = `${updWidth.toString()}px`;
	}, [bankAccounts]);

	function acctTabCntrlr(e: Key) {
		if (e === "0") {
			setAddAcctModalOpen(true);
			curAcct.current = selectedAcct;
			return;
		}
		setSelectedAcct(e.toString());
	}

	function openAddAcctModal() {
		setAddAcctModalOpen(true);
	}

	function openDelAcctModal() {
		setDelAcctModalOpen(true);
	}

	function closeModal() {
		setDelAcctModalOpen(false);
		setAddAcctModalOpen(false);
		setSelectedAcct(curAcct.current);
	}

	function cntlMonthLabel(curMonths: string[]) {
		setMonthLabel((p) => {
			if (curMonths.length === 1) {
				return convertMonthLabel(curMonths[0]);
			} else {
				return `${convertMonthLabel(curMonths[1])}`;
			}
		});

		function convertMonthLabel(x: string): string {
			return `${getMonthName(Number(x.substring(5)))} ${x.substring(0, 4)}`;
		}
	}

	function tabScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
		e.preventDefault();
		//@ts-expect-error - deltaY is on nativeEvent
		if (e.nativeEvent.deltaY > 0) {
			acctScrollCont.current!.scrollLeft += 40;
		} else {
			acctScrollCont.current!.scrollLeft -= 40;
		}
	}

	const selectedAccount = useMemo((): BankAccountAPIData => {
		const sel: BankAccountAPIData | undefined = bankAccounts.find((bA) => bA.id.toString() === selectedAcct);

		if (!sel) {
			return bankAccounts[0];
		}

		return sel;
	}, [bankAccounts, selectedAcct]);

	function removeAddAcctTabHolder(): BankAccountAPIData[] {
		const bArr = [...bankAccounts];
		if (bArr.length === bankAccounts.length) {
			bArr.pop();
			return bArr;
		} else {
			return bArr;
		}
	}

	function submitMonthRange(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		setMonthRange((p): MonthRange => {
			//@ts-expect-error - ts says value prop does not exist
			return { startMonth: form[0].value, endMonth: form[1].value };
		});
	}

	function defaultMonthRange(): string[] {
		const todayDateObj = new Date();
		const startYear = todayDateObj.getFullYear();
		let startMonth = todayDateObj.getMonth() - 5;
		let endMonth = todayDateObj.getMonth() + 7;
		todayDateObj.setMonth(todayDateObj.getMonth() + 7);
		const endYear = todayDateObj.getFullYear();
		startMonth = startMonth >= 0 ? startMonth : 12 - startMonth;
		endMonth = endMonth <= 11 ? endMonth : endMonth - 12;
		const arr = [`${startYear}-${startMonth.toString().padStart(2, "0")}`, `${endYear}-${endMonth.toString().padStart(2, "0")}`];
		return arr;
	}

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

		const calendar = document.getElementById("calWrap");

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

	if (isLoading) {
		return <div></div>;
	}

	return (
		<div className="relative max-w-fit min-w-fit w-fit calCtrlWrap overflow-clip">
			<div className="fixed top-0 w-full">
				<div className="flex relative text-sm text-white bg-[#0A0A0A] py-0.5 h-fit">
					<div className="flex justify-center ml-80">
						<span>Accounts</span>
						<SettingsIcon openAcctModal={openAddAcctModal} openDelAcctModal={openDelAcctModal} />
					</div>
					<div className="ml-[410px] font-bold w-72">
						<span>{monthLabel}</span>
					</div>
					<div className="flex justify-center relative left-[255px]" style={{ width: "336px" }}>
						<span>Month Range</span>
					</div>
				</div>
				<div className="flex calCtrlCont">
					<div onWheel={tabScroll} className="tabCont" ref={acctScrollCont}>
						<Tabs
							ref={tabsRef}
							variant="underlined"
							color="primary"
							onSelectionChange={acctTabCntrlr}
							selectedKey={selectedAcct}
							motionProps={{
								transition: { duration: 0.9 },
							}}
							classNames={{
								tabList: "rounded-none p-0 bg-[#0A0A0A] tabListCont gap-0",
								cursor: "w-full bg-[#6EC4A7]",
								tab: "acctTabs min-w-32 max-w-32 px-0 h-6",
								tabContent: "group-data-[hover=true]:text-[white] group-data-[selected=true]:text-[#0a0a0a] group-data-[selected=true]:font-bold truncate pl-4 pr-4 pt-0.5",
							}}>
							{bankAccounts.map((bA, i) => {
								return (
									<Tab
										style={{
											position: "relative",
											transform: `translateX(-${i * 17}px)`,
											zIndex: `${selectedAcct === bA.id.toString() ? 55 : 49 - i}`,
											// background: `${}`,
										}}
										className={`${selectedAcct === bA.id.toString() ? "selTab" : ""}`}
										title={bA.title}
										key={bA.id}></Tab>
								);
							})}
						</Tabs>
					</div>
					<form id="monthRangeForm" className="flex pl-2 bg-[#6EC4A7] mnthPickBox" onSubmit={submitMonthRange}>
						<input
							name="startMonth"
							defaultValue={defaultMonthRange()[0]}
							// value={startMonth ? startMonth : defaultMonthRange()[0]}
							// onChange={updStartMnth}
							id="start"
							type="month"
							className="mnthPicker text-sm border-none bg-[#6EC4A7] shadow-none text-[#0a0a0a]"
						/>
						<SpanIcon />
						<input
							name="endMonth"
							defaultValue={defaultMonthRange()[1]}
							// onChange={updEndMnth}
							id="endMonth"
							type="month"
							className="mnthPicker text-sm border-none bg-[#6EC4A7] shadow-none text-[#0a0a0a]"
						/>
						<Button type="submit" form="monthRangeForm" isIconOnly className="submitDatesBtn self-center" radius="none" size="sm">
							<CheckIcon />
						</Button>
					</form>
				</div>
				<div className="grid grid-cols-7 text-xs font-semibold weekdayLabel">
					<div>Sunday</div>
					<div>Monday</div>
					<div>Tuesday</div>
					<div>Wednesday</div>
					<div>Thursday</div>
					<div>Friday</div>
					<div>Saturday</div>
				</div>
			</div>
			<CalendarContext.Provider
				value={{
					openDrawer: openDrawer,
					dailyBalancesMap: dailyBalancesMap,
					dateTransactionsMap: dateTransactionsMap,
					dragObject: dragObject,
					setStateDailyBalanceMap: setStateDailyBalance,
					addTransToDate: addTransToDate,
					editTransOnDatesFuncsMap: editTransOnDatesFuncMap,
				}}>
				<div id="calWrap" className="calWrap">
					<div id="topCalBound" onMouseOver={(e, direction = "up") => scrollDrag(direction)} className="flex justify-center">
						{/* <div className="self-end" style={{ position: "relative", top: "10px" }}>
					↑ Drag Scroll ↑
				</div> */}
					</div>
					{/* <CalendarContainer selectAccount={selectedAccount} monthRange={monthRange} monthLabelCntl={cntlMonthLabel} /> */}
					<Calendar monthLabelCntl={cntlMonthLabel} transactions={selectedAccount.transactions} monthRange={monthRange} key="calendar" />
				</div>
				<TransactionInputDrawer ref={childref} bankAccounts={bankAccounts} currentAcct={selectedAccount} updAcctTrans={updateAcctTransactions} />
				<div id="bottomCalBound" onMouseOver={(e, direction = "down") => scrollDrag(direction)}></div>
			</CalendarContext.Provider>
			{addAcctModalOpen && <AddAccountModal closeModal={closeModal} addNewAcct={addNewAcct} />}
			{delAcctModalOpen && <DelAccountModal closeModal={closeModal} deleteAcct={delAcct} bankAccounts={removeAddAcctTabHolder()} />}
		</div>
	);
}