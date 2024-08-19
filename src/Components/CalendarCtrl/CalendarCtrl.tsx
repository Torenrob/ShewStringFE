import React, { act, Key, MutableRefObject, RefObject, UIEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CalendarContainer from "./CalendarContainer/CalendarContainer";
import { BankAccountAPIData, TransactionAPIData } from "../../Types/APIDataTypes";
import { getAllBankAccountsAPI } from "../../Services/API/BankAccountAPI";
import { Button, DateRangePicker, Input, Tab, Tabs, useTabs } from "@nextui-org/react";
import SpanIcon from "../Icons/SpanIcon";
import SubmitTransactionIcon from "../Icons/SubmitTransactionIcon";
import CheckIcon from "../Icons/CheckIcon";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { getRandomNum } from "../../Utilities/UtilityFuncs";
import AddAccountModal from "./AddAccountModal";
import ThreeDotIcon from "../Icons/ThreeDotIcon";
import DelAccountModal from "./DelAccountModal";

export default function CalendarCtrl() {
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([]);
	const [selectedAcct, setSelectedAcct] = useState<string>("0");
	const [isLoading, setLoading] = useState<boolean>(true);
	const [addAcctModalOpen, setAddAcctModalOpen] = useState<boolean>(false);
	const [delAcctModalOpen, setDelAcctModalOpen] = useState<boolean>(false);
	const [forceState, setForceState] = useState<number>(0);

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
		const updWidth = numAccts * 130 - numAccts * 17;
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

	function tabScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
		e.preventDefault();
		//@ts-expect-error - deltaY is on nativeEvent
		if (e.nativeEvent.deltaY > 0) {
			acctScrollCont.current!.scrollLeft += 40;
		} else {
			acctScrollCont.current!.scrollLeft -= 40;
		}
	}

	function selectedAccount(): BankAccountAPIData {
		const sel: BankAccountAPIData | undefined = bankAccounts.find((bA) => bA.id.toString() === selectedAcct);

		if (!sel) {
			return bankAccounts[0];
		}

		return sel;
	}

	if (isLoading) {
		return <div></div>;
	}

	function removeAddAcctTabHolder(): BankAccountAPIData[] {
		const bArr = [...bankAccounts];
		if (bArr.length === bankAccounts.length) {
			bArr.pop();
			return bArr;
		} else {
			return bArr;
		}
	}

	return (
		<div className="relative max-w-fit min-w-fit w-fit">
			<div style={{ width: "1536px" }} className="flex relative text-sm text-white bg-black py-1 h-fit">
				<div className="flex justify-center" style={{ width: "1200px" }}>
					<span>Accounts</span>
					<ThreeDotIcon openAcctModal={openAddAcctModal} openDelAcctModal={openDelAcctModal} />
				</div>
				<div className="flex justify-center" style={{ width: "336px" }}>
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
						className="bg-black"
						classNames={{
							tabList: "rounded-none p-0 bg-black tabListCont gap-0",
							cursor: "w-full bg-[#86198f]",
							tab: "acctTabs min-w-32 max-w-32 px-0 h-6 bg-white",
							tabContent:
								"group-data-[hover=true]:text-[white] group-data-[selected=true]:selTab group-data-[selected=true]:text-[white] group-data-[selected=true]:font-bold truncate pl-4 pr-4 pt-0.5",
						}}>
						{bankAccounts.map((bA, i) => {
							return (
								<Tab
									style={{
										position: "relative",
										transform: `translateX(-${i * 17}px)`,
										zIndex: `${selectedAcct === bA.id.toString() ? 55 : 49 - i}`,
										background: `${selectedAcct === bA.id.toString() ? "#86198F" : "black"}`,
									}}
									title={bA.title}
									key={bA.id}></Tab>
							);
						})}
					</Tabs>
				</div>
				<form action="" className="flex px-2 bg-fuchsia-800 mnthPickBox">
					<input name="startMonth" id="start" type="month" className="mnthPicker text-sm border-none bg-fuchsia-800 shadow-none text-white" />
					<SpanIcon />
					<input name="endMonth" id="endMonth" type="month" className="mnthPicker text-sm border-none bg-fuchsia-800 shadow-none text-white" />
					<Button type="submit" isIconOnly className="submitDatesBtn self-center" radius="none" size="sm">
						<CheckIcon />
					</Button>
				</form>
			</div>
			<CalendarContainer selectAccount={selectedAccount()} bankAccounts={bankAccounts} updAcctTrans={updateAcctTransactions} />
			{addAcctModalOpen && <AddAccountModal closeModal={closeModal} addNewAcct={addNewAcct} />}
			{delAcctModalOpen && <DelAccountModal closeModal={closeModal} deleteAcct={delAcct} bankAccounts={removeAddAcctTabHolder()} />}
		</div>
	);
}
