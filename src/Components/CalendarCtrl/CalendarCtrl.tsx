import "./CalendarCtrl.css";
import React, { FormEvent, Key, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BankAccountAPIData, TransactionAPIData } from "../../Types/APIDataTypes";
import { Button, Spinner, Tab, Tabs } from "@nextui-org/react";
import SpanIcon from "../Icons/SpanIcon/SpanIcon.tsx";
import CheckIcon from "../Icons/CheckIcon/CheckIcon.tsx";
import AddAccountModal from "../AddAccountModal/AddAccountModal.tsx";
import SettingsIcon from "../Icons/SettingsIcon/SettingsIcon.tsx";
import DelAccountModal from "../DelAccountModal/DelAccountModal.tsx";
import TransactionInputDrawer, { TransactionInputDrawerRef } from "../TransactionInputDrawer/TransactionInputDrawer.tsx";
import { editTransOnDateFuncs } from "../DayBox/DayBox";
import { focusToday, getDragScrollYOffset, getMonthName } from "../../Utilities/UtilityFuncs";
import Calendar from "../Calendar/Calendar";
import { UserContext } from "../../Services/Auth/UserAuthExports.tsx";
import { CalendarContext, DragObject, MonthRange, UpdateTransactionContainerInfo } from "./CalendarCtrlExports.tsx";
import { DateComponentInfo } from "../../Types/CalendarTypes.tsx";

export default function CalendarCtrl() {
	const { bankAccounts } = useContext(UserContext);
	const [selectedAcct, setSelectedAcct] = useState<string>(bankAccounts[0]?.id.toString() ?? "0");
	const [addAcctModalOpen, setAddAcctModalOpen] = useState<boolean>(false);
	const [delAcctModalOpen, setDelAcctModalOpen] = useState<boolean>(false);
	const [monthRange, setMonthRange] = useState<MonthRange | null>(null);
	const [monthLabel, setMonthLabel] = useState<string>(`${new Date().getFullYear()}`);
	const [tabShouldScroll, setTabShouldScroll] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [daysToLoad, setDaysToLoad] = useState<number | null>(null);
	const [loadedDays, setLoadedDays] = useState<Set<string> | null>(null);

	console.log(bankAccounts);

	useEffect(() => {
		setSelectedAcct(bankAccounts[0].id.toString() ?? "0");

		if (tabsRef.current === null || tabContRef.current === null) {
			console.log("not generating calcntrl");
			return;
		}

		if (!daysToLoad || !loadedDays) {
			return;
		}

		if (daysToLoad === loadedDays.size) {
			setLoading(false);
			focusToday();
		}

		if (tabsRef.current.clientWidth === 0) {
			return;
		}

		const numAccts = bankAccounts.length;
		let updWidth = numAccts * 128 - (numAccts - 1) * 13;

		if (updWidth > Number(tabContRef.current.clientWidth)) {
			setTabShouldScroll(true);
			updWidth = Number(tabContRef.current.clientWidth);
		}
		tabsRef.current.style.width = `${updWidth.toString()}px`;
	}, [bankAccounts, setLoading, daysToLoad, loadedDays]);

	const childref = useRef<TransactionInputDrawerRef>(null!);

	const dragObject = useRef<DragObject>({
		globalDragOn: false,
		dropping: null,
		paginationDragState: [],
		containerDropped: () => {},
		removeTransactionFromDate: () => {},
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

	const tabsRef = useRef<HTMLDivElement>(null);
	const tabContRef = useRef<HTMLDivElement>(null);
	const acctScrollCont = useRef<HTMLDivElement>(null);

	//Function for updating acct transactions when submitting trans for a different account than currently chosen
	const updateAcctTransactions = (arg0: TransactionAPIData, updBankAcctStateFunc: (newBAarr: BankAccountAPIData[]) => void) => {
		const subTransAcctMap: Map<string, TransactionAPIData[]> = bankAccounts.find((acct) => acct.id === arg0.bankAccountId)!.transactions;
		const updArr = subTransAcctMap.get(arg0.date) ? subTransAcctMap.get(arg0.date) : [arg0];
		const updAcctsArr: BankAccountAPIData[] = bankAccounts.map((acct: BankAccountAPIData) => {
			if (acct.id === arg0.bankAccountId) {
				acct.transactions.set(arg0.date, updArr!);
			}
			return acct;
		});
		updBankAcctStateFunc(updAcctsArr);
	};

	const addNewAcct = (newAcct: BankAccountAPIData, updBankAcctStateFunc: (newBAarr: BankAccountAPIData[]) => void) => {
		const addAcctTab: BankAccountAPIData = bankAccounts.pop()!;
		updBankAcctStateFunc(bankAccounts.concat({ ...newAcct, transactions: new Map() }).concat(addAcctTab));
		setSelectedAcct(newAcct.id.toString());
	};

	const delAcct = (delAcct: BankAccountAPIData, updBankAcctStateFunc: (newBAarr: BankAccountAPIData[]) => void) => {
		bankAccounts.splice(bankAccounts.indexOf(delAcct), 1);
		updBankAcctStateFunc(bankAccounts);
	};

	function acctTabCntrlr(e: Key) {
		if (e === "0") {
			// curAcct.current = selectedAcct;
			setAddAcctModalOpen(true);
			return;
		}
		setSelectedAcct(() => e.toString());
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
		setSelectedAcct(selectedAcct);
	}

	function cntlMonthLabel(curMonths: string[]) {
		setMonthLabel(() => {
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
		if (!tabShouldScroll) return;
		//@ts-expect-error - deltaY is on nativeEvent
		if (e.nativeEvent.deltaY > 0) {
			tabsRef.current!.scrollLeft += 40;
		} else {
			tabsRef.current!.scrollLeft -= 40;
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
		setMonthRange((): MonthRange => {
			//@ts-expect-error - ts says value prop does not exist
			return { startMonth: form[0].value, endMonth: form[1].value };
		});
	}

	function defaultMonthRange(): string[] {
		const todayDateObj = new Date();
		let startMonth = todayDateObj.getMonth() - 5;
		const startYear = startMonth >= 0 ? todayDateObj.getFullYear() : todayDateObj.getFullYear() - 1;
		let endMonth = todayDateObj.getMonth() + 7;
		todayDateObj.setMonth(todayDateObj.getMonth() + 7);
		const endYear = todayDateObj.getFullYear();
		startMonth = startMonth >= 0 ? startMonth : 12 + startMonth;
		endMonth = endMonth <= 11 ? endMonth : endMonth - 12;
		return [`${startYear}-${startMonth.toString().padStart(2, "0")}`, `${endYear}-${endMonth.toString().padStart(2, "0")}`];
	}

	// noinspection JSUnusedLocalSymbols
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

	return (
		<>
			<Spinner className={`${loading ? "" : "hidden"} scale-125`} color="primary" label="Loading..." labelColor="primary" size="lg" />
			<div className={`relative calCtrlWrap overflow-clip grid ${loading ? "hidden" : ""} min-w-full`}>
				<div className="flex-col">
					<div className="flex justify-between max-w-full">
						<div ref={tabContRef} className="flex-col w-[74.75%]">
							<div className="flex justify-around relative text-sm text-white bg-[#1a1a1a] rounded-t-lg pt-0.5 py-0.5 h-fit">
								<div id="calCntrlAcctsLabel" className="flex relative right-[10%]">
									<span>Accounts</span>
									<SettingsIcon openAcctModal={openAddAcctModal} openDelAcctModal={openDelAcctModal} />
								</div>
								<div className="calCntrlMonthLabel justify-self-center font-bold relative right-[10%] w-44">
									<span>{monthLabel}</span>
								</div>
							</div>
							<div onWheel={tabScroll} className="tabCont pt-[0.1rem]" ref={acctScrollCont}>
								<Tabs
									ref={tabsRef}
									variant="underlined"
									color="primary"
									onSelectionChange={acctTabCntrlr}
									selectedKey={selectedAcct}
									motionProps={{
										transition: { duration: 0.9 },
									}}
									className="pt-0.5"
									classNames={{
										tabList: "rounded-none p-0 gap-0 bg-[#1a1a1a]",
										cursor: "bg-[var(--greenLogo)] w-full",
										tab: "acctTabs lg:min-w-32 lg:max-w-32 px-0 lg:h-6",
										tabContent: `acctTabContent group-data-[hover=true]:z-50 group-data-[hover=true]:font-extrabold group-data-[selected=true]:text-[black] group-data-[selected=true]:font-bold truncate lg:pl-4 lg:pr-4 lg:pt-0.5`,
									}}>
									{bankAccounts.map((bA, i) => {
										return (
											<Tab
												style={{
													position: "relative",
													transform: `translateX(-${i * 13}px)`,
													zIndex: `${selectedAcct === bA.id.toString() ? 49 : 48 - i}`,
												}}
												className={`data-[hover=true]:opacity-100 ${selectedAcct === bA.id.toString() ? "selTab" : ""} ${bA.id === 0 ? "addAcctTab" : ""}`}
												title={bA.title}
												key={bA.id}></Tab>
										);
									})}
								</Tabs>
							</div>
						</div>
						<div className="flex-col w-[25.25%]">
							<div className="hidden md:flex justify-center relative text-white">
								<span>Month Range</span>
							</div>
							<form id="monthRangeForm" className="flex max-w-fit min-w-fit justify-self-end pl-2 mt-[0.2rem] bg-[#6EC4A7] mnthPickBox rounded-t-sm overflow-hidden" onSubmit={submitMonthRange}>
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
								<Button type="submit" form="monthRangeForm" className="submitDatesBtn self-center" size="md" radius="none">
									Apply
								</Button>
							</form>
						</div>
					</div>
					<div className={`grid grid-cols-7 text-xs font-semibold weekdayLabel rounded-tl-sm`}>
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
						setDaysLoaded: setLoadedDays,
						setNumberOfDays: setDaysToLoad,
						addTransToDate: addTransToDate,
						editTransOnDatesFuncsMap: editTransOnDatesFuncMap,
					}}>
					<div id="calWrap" className="calWrap max-h-full">
						{/* <div id="topCalBound" onMouseOver={(e, direction = "up") => scrollDrag(direction)} className="flex justify-center"></div> */}
						<Calendar monthLabelCntl={cntlMonthLabel} transactions={selectedAccount.transactions} monthRange={monthRange} key="calendar" />
						{/* <div id="bottomCalBound" onMouseOver={(e, direction = "down") => scrollDrag(direction)} style={{ background: "red" }}></div> */}
					</div>
					<TransactionInputDrawer ref={childref} bankAccounts={bankAccounts} currentAcct={selectedAccount} updAcctTrans={updateAcctTransactions} />
				</CalendarContext.Provider>
				{(addAcctModalOpen || selectedAccount.id == 0) && <AddAccountModal closeModal={closeModal} addNewAcct={addNewAcct} />}
				{delAcctModalOpen && <DelAccountModal closeModal={closeModal} deleteAcct={delAcct} bankAccounts={removeAddAcctTabHolder()} />}
			</div>
		</>
	);
}
