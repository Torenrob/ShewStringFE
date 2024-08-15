import React, { act, Key, RefObject, UIEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CalendarContainer from "./CalendarContainer/CalendarContainer";
import { BankAccountAPIData } from "../../Types/APIDataTypes";
import { getAllBankAccountsAPI } from "../../Services/API/BankAccountAPI";
import { Tab, Tabs, useTabs } from "@nextui-org/react";

export default function CalendarCtrl() {
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([]);
	const [selectedAcct, setSelectedAcct] = useState<number>(0);
	const [scrollAmt, setScrollAmt] = useState<number>(0);

	const AddAccountTabHolder: BankAccountAPIData = useMemo(() => {
		const x: BankAccountAPIData = { title: "Add Account", repeatGroups: [], accountType: "Saving", id: 0, transactions: [] };
		return x;
	}, []);

	const getAccountOptions = useCallback(async () => {
		const bankAccounts: BankAccountAPIData[] | null = await getAllBankAccountsAPI();
		if (bankAccounts) {
			setBankAccounts((p) => bankAccounts.concat(AddAccountTabHolder));
			setSelectedAcct(bankAccounts[0].id);
		}
	}, [AddAccountTabHolder]);

	useEffect(() => {
		getAccountOptions();
	}, [getAccountOptions]);

	const tabsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (tabsRef.current === null) return;
		if (tabsRef.current.clientWidth === 0) return;
		const updWidth = tabsRef.current.clientWidth - (bankAccounts.length - 1) * 17;
		tabsRef.current.style.width = `${updWidth.toString()}px`;
	}, [bankAccounts]);

	function controlTabZ(e: Key) {
		setSelectedAcct(Number(e));
	}

	function tabScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
		console.log(e);
	}

	return (
		<>
			<div>
				<div onWheel={tabScroll} className="tabCont">
					<Tabs
						ref={tabsRef}
						variant="underlined"
						color="primary"
						onSelectionChange={controlTabZ}
						motionProps={{
							transition: { duration: 0.075 },
						}}
						className="bg-black"
						classNames={{
							tabList: "rounded-none p-0 bg-fuchsia-800",
							cursor: "w-full bg-[#A21CAF]",
							tab: "acctTabs min-w-32 max-w-32 px-0 h-6 bg-white",
							tabContent:
								"group-data-[hover=true]:text-[white] group-data-[selected=true]:selTab group-data-[selected=true]:text-[white] group-data-[selected=true]:font-bold truncate pl-4 pr-4 pt-0.5",
						}}>
						{bankAccounts.map((bA, i) => {
							if (bA.title === "Add Account") {
								<Tab
									style={{
										position: "relative",
										transform: `translateX(-${bankAccounts.length * 17}px)`,
										zIndex: `55`,
										background: `black`,
									}}
									key="addAcct"
									title="Add Account"></Tab>;
							}
							return (
								<Tab
									style={{
										position: "relative",
										transform: `translateX(-${i * 17}px)`,
										zIndex: `${selectedAcct === bA.id ? 55 : 49 - i}`,
										background: `${selectedAcct === bA.id ? "#86198F" : "black"}`,
									}}
									title={bA.title}
									key={bA.id}></Tab>
							);
						})}
					</Tabs>
				</div>
				<div></div>
			</div>
			<CalendarContainer selectAccount={bankAccounts.find((bA) => bA!.id === selectedAcct)!} bankAccounts={bankAccounts} />
		</>
	);
}
