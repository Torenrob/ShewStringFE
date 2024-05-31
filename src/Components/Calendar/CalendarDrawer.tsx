import { Button, DateInput, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { useCallback, useEffect, useState } from "react";
import { getAllBankAccountsAPI } from "../../Services/BankAccountAPI";
import { BankAccountAPIData } from "../../Types/APIDataTypes";
import ArrowDownIcon from "./Icons/ArrowDownIcon";

export default function CalendarDrawer() {
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([]);

	const accountOptions = useCallback(async () => {
		const bankAccounts: BankAccountAPIData[] | null = await getAllBankAccountsAPI();
		if (bankAccounts) {
			setBankAccounts(bankAccounts);
		}
	}, []);

	function cancelHover(event: MouseEvent) {
		event.preventDefault();
	}

	function closeDrawer() {
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		if (!drawer.classList.contains("drawerClosed")) {
			drawer.classList.add("drawerClosed");
		}
	}

	useEffect(() => {
		accountOptions();
	}, [accountOptions]);

	const drawerStyle = {
		zIndex: 2,
		width: "100%",
	};

	const formStyle = {
		backgroundColor: "rgba(0, 0, 0,.8)",
	};

	return (
		<div id="calendarDrawer" className="absolute self-end transactionDrawer drawerClosed" style={drawerStyle}>
			<div style={{ padding: "0px 27px" }} className="grid">
				<Button onClick={closeDrawer} data-hover={cancelHover} radius="full" size="sm" isIconOnly variant="light" className="absolute justify-self-start">
					<ArrowDownIcon />
				</Button>
				<form className="w-full px-64 py-2.5 grid grid-col-4 grid-rows-2 gap-3 transactionForm" style={formStyle}>
					<div className=" col-start-1 row-start-1 col-span-3 flex gap-3">
						<Input radius="none" size="sm" className="w-3/5 text-slate-500 basis-3/6" type="text" label="Title" />
						<Select radius="none" className="text-slate-500 col-start-2 row-start-1 basis-1/6" size="sm" label="Type">
							<SelectItem key="debit">Debit</SelectItem>
							<SelectItem key="credit">Credit</SelectItem>
						</Select>
						<Select radius="none" size="sm" label="Account" className="h-4 text-slate-500 basis-2/6 row-start-1 ">
							{bankAccounts.map((account, i) => (
								<SelectItem key={`bankAccount${i}`}>{account.title}</SelectItem>
							))}
						</Select>
					</div>
					<DateInput radius="none" className="col-start-1 row-start-2" label="Transaction Date" size="sm" />
					<Input radius="none" size="sm" className="text-slate-500 col-start-2 row-start-2 " type="number" label="Amount" />
					<Select radius="none" size="sm" label="Category" className="h-4 text-slate-500 col-start-3 row-start-2 ">
						<SelectItem key="income">Income</SelectItem>
						<SelectItem key="groceries">Groceries</SelectItem>
						<SelectItem key="bills">Bills</SelectItem>
					</Select>
					<Textarea radius="none" className="col-start-4 row-start-1 row-span-2 mt-1" label="Description" />
				</form>
				<Button onClick={closeDrawer} data-hover={cancelHover} radius="full" size="sm" isIconOnly variant="light" className="absolute justify-self-end">
					<ArrowDownIcon />
				</Button>
			</div>
		</div>
	);
}
