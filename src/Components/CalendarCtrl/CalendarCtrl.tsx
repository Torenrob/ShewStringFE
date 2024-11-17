import React, {
	createContext,
	FormEvent,
	Key,
	MutableRefObject,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {BankAccountAPIData, TransactionAPIData} from "../../Types/APIDataTypes";
import {Button, DateValue, Tab, Tabs} from "@nextui-org/react";
import SpanIcon from "../Icons/SpanIcon";
import CheckIcon from "../Icons/CheckIcon";
import AddAccountModal from "./AddAccountModal";
import SettingsIcon from "../Icons/SettingsIcon";
import DelAccountModal from "./DelAccountModal";
import TransactionInputDrawer, {TransactionInputDrawerRef} from "./TransactionInputDrawer";
import {editTransOnDateFuncs} from "./Calendar/MonthBox/DayBox/DayBox";
import {getDragScrollYOffset, getMonthName} from "../../Utilities/UtilityFuncs";
import Calendar from "./Calendar/Calendar";
import {UserContext} from "../../Services/Auth/UserAuth";

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
	amount: string;
	transactionType?: "Debit" | "Credit";
	category?: string;
	description?: string | null;
	bankAccountId?: string;
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
	const { bankAccounts } = useContext(UserContext);
	const [selectedAcct, setSelectedAcct] = useState<string>(bankAccounts[0]?.id.toString() ?? "0");
	const [addAcctModalOpen, setAddAcctModalOpen] = useState<boolean>(false);
	const [delAcctModalOpen, setDelAcctModalOpen] = useState<boolean>(false);
	const [monthRange, setMonthRange] = useState<MonthRange | null>(null);
	const [monthLabel, setMonthLabel] = useState<string>(`${new Date().getFullYear()}`);
	const [, setIsReady] = useState<boolean>(false);

	useEffect(() => {
		setSelectedAcct(bankAccounts[0].id.toString() ?? "0");
		if (tabsRef.current === null || tabContRef.current === null) {
			setIsReady(true);
			return;
		}
		if (tabsRef.current.clientWidth === 0) {
			setIsReady(true);
			return;
		}
		const numAccts = bankAccounts.length;
		let updWidth = numAccts * 128 - (numAccts - 1) * 13;

		if (updWidth >= Number(tabContRef.current.clientWidth)) {
			updWidth = Number(tabContRef.current.clientWidth);
		}
		tabsRef.current.style.width = `${updWidth.toString()}px`;
		setIsReady(true);
	}, [bankAccounts]);

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
		const startYear = todayDateObj.getFullYear();
		let startMonth = todayDateObj.getMonth() - 5;
		let endMonth = todayDateObj.getMonth() + 7;
		todayDateObj.setMonth(todayDateObj.getMonth() + 7);
		const endYear = todayDateObj.getFullYear();
		startMonth = startMonth >= 0 ? startMonth : 12 - startMonth;
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

	const firstTabSelected: boolean = useMemo(() => {
		return selectedAcct === bankAccounts[0].id.toString();
	}, [selectedAcct, bankAccounts])

	return (
		<div className="relative calCtrlWrap overflow-clip grid">
			<div className="flex-col">
				<div className="flex justify-between max-w-full">
					<div ref={tabContRef} className="flex-col w-[76%]">
						<div
							className="flex justify-around relative text-sm text-white bg-[#1a1a1a] rounded-t-lg pt-0.5 py-0.5 h-fit">
							<div id="calCntrlAcctsLabel" className="flex relative right-[10%]">
								<span>Accounts</span>
								<SettingsIcon openAcctModal={openAddAcctModal} openDelAcctModal={openDelAcctModal}/>
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
									transition: {duration: 0.9},
								}}
								className="pt-0.5"
								classNames={{
									tabList: "rounded-none p-0 gap-0 bg-[#1a1a1a]",
									cursor: "w-full",
									tab: "acctTabs lg:min-w-32 lg:max-w-32 px-0 lg:h-6",
									tabContent: "group-data-[hover=true]:text-[white] group-data-[selected=true]:text-[#0a0a0a] group-data-[selected=true]:font-bold truncate lg:pl-4 lg:pr-4 lg:pt-0.5",
								}}>
								{bankAccounts.map((bA, i) => {
									return (
										<Tab
											style={{
												position: "relative",
												transform: `translateX(-${i * 13}px)`,
												zIndex: `${selectedAcct === bA.id.toString() ? 55 : 49 - i}`,
											}}
											className={`${selectedAcct === bA.id.toString() ? "selTab" : ""}`}
											title={bA.title}
											key={bA.id}></Tab>
									);
								})}
							</Tabs>
						</div>
					</div>
					<div className="flex-col w-[24%]">
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
							<SpanIcon/>
							<input
								name="endMonth"
								defaultValue={defaultMonthRange()[1]}
								// onChange={updEndMnth}
								id="endMonth"
								type="month"
								className="mnthPicker text-sm border-none bg-[#6EC4A7] shadow-none text-[#0a0a0a]"
							/>
							<Button type="submit" form="monthRangeForm" isIconOnly
									className="submitDatesBtn self-center" radius="none" size="sm">
								<CheckIcon/>
							</Button>
						</form>
					</div>
				</div>
				<div
					className={`grid grid-cols-7 text-xs font-semibold weekdayLabel ${firstTabSelected ? "" : "rounded-tl-md"}`}>
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
	);
}
