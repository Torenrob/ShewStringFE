import { Button, DateInput, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import React, { Children, LegacyRef, MutableRefObject, Ref, RefObject, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { getAllBankAccountsAPI } from "../../Services/BankAccountAPI";
import { BankAccountAPIData, PostTransactionAPIData } from "../../Types/APIDataTypes";
import ArrowDownIcon from "./Icons/ArrowDownIcon";
import { DateValue } from "@internationalized/date";
import { Props } from "react-infinite-scroll-component";
import SubmitTransactionIcon from "./Icons/SubmitTransactionIcon";
import { postTransactionAPI } from "../../Services/TransactionAPI";
import InvalidSubmitIcon from "./Icons/InvalidSubmitIcon";

export type TransactionInputDrawerRef = {
	updateDate: (newDate: DateValue) => void;
};

const countDecimals = function (value: number): number {
	if (Math.floor(value) === value) return 0;
	return value.toString().split(".")[1].length || 0;
};

export const TransactionInputDrawer = forwardRef<TransactionInputDrawerRef>((_, ref) => {
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([]);
	const [date, setDate] = useState<DateValue>();
	const [amount, setAmount] = useState<string>("0.00");

	useImperativeHandle(ref, () => ({
		updateDate(newDate: DateValue) {
			setDate(newDate);
		},
	}));

	const accountOptions = useCallback(async () => {
		const bankAccounts: BankAccountAPIData[] | null = await getAllBankAccountsAPI();
		if (bankAccounts) {
			setBankAccounts(bankAccounts);
		}
	}, []);

	function cancelHover(event: MouseEvent) {}

	function closeDrawer() {
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		const form: HTMLFormElement = document.querySelector(".transactionForm") as HTMLFormElement;
		form.reset();
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

	function SubmitTransaction(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const transactionData: PostTransactionAPIData = {
			// @ts-expect-error - TS complains about title not having a value due to it being a string, but it does
			title: event.currentTarget.title.value,
			transactionType: event.currentTarget.type.value,
			bankAccountId: event.currentTarget.account.value,
			date: event.currentTarget.date.value,
			amount: event.currentTarget.amount.value,
			category: event.currentTarget.category.value,
			description: event.currentTarget.description.value,
		};
		console.log("hello");
	}

	const validateAmount: boolean = useMemo(() => {
		if (countDecimals(Number(amount)) > 2) return true;
		if (Number(amount) < 0) return true;
		return false;
	}, [amount]);

	return (
		<div id="calendarDrawer" className="absolute self-end transactionDrawer drawerClosed" style={drawerStyle}>
			<div style={{ padding: "0px 27px" }} className="grid">
				<Button onClick={closeDrawer} radius="full" size="sm" isIconOnly variant="light" className="absolute justify-self-start">
					<ArrowDownIcon />
				</Button>
				<form className="w-full px-64 py-2.5 grid grid-col-4 grid-rows-2 gap-3 transactionForm" style={formStyle} onSubmit={SubmitTransaction}>
					<div className=" col-start-1 row-start-1 col-span-3 flex gap-3">
						<Input radius="none" size="sm" className="w-3/5 text-slate-500 basis-3/6" type="text" label="Title" name="title" isClearable />
						<Select radius="none" className="text-slate-500 col-start-2 row-start-1 basis-1/6" size="sm" label="Type" name="type">
							<SelectItem key="debit">Debit</SelectItem>
							<SelectItem key="credit">Credit</SelectItem>
						</Select>
						<Select radius="none" size="sm" label="Account" name="account" className="h-4 text-slate-500 basis-2/6 row-start-1 ">
							{bankAccounts.map((account, i) => (
								<SelectItem key={`${account.id}`} value={account.id}>
									{account.title}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="col-start-1 row-start-2 flex gap-3">
						<Button
							isIconOnly
							disabled={validateAmount ? true : false}
							color={validateAmount ? "default" : "primary"}
							size="md"
							radius="none"
							className={`self-center ${validateAmount ? "mb-6" : ""}`}
							type="submit">
							{!validateAmount && <SubmitTransactionIcon />}
							{validateAmount && <InvalidSubmitIcon />}
						</Button>
						<DateInput radius="none" label="Date" name="date" size="sm" value={date} onChange={setDate} />
					</div>
					<Input
						required
						value={amount}
						onValueChange={setAmount}
						radius="none"
						size="sm"
						isInvalid={validateAmount}
						className="text-slate-500 col-start-2 row-start-2 "
						type="number"
						label="Amount"
						name="amount"
						errorMessage={validateAmount && "Invalid amount"}
						isClearable
						startContent={
							<div className="flex items-center">
								{!validateAmount && <span className="text-sm">$</span>}
								{validateAmount && <span className="invalidAmount pb-1">❌</span>}
							</div>
						}
					/>
					<Select radius="none" size="sm" label="Category" name="category" className="h-4 text-slate-500 col-start-3 row-start-2 ">
						<SelectItem key="income">Income</SelectItem>
						<SelectItem key="groceries">Groceries</SelectItem>
						<SelectItem key="bills">Bills</SelectItem>
					</Select>
					<Textarea radius="none" className="col-start-4 row-start-1 row-span-2 mt-1" label="Description" name="description" />
				</form>
				<Button onClick={closeDrawer} data-hover={cancelHover} radius="full" size="sm" isIconOnly variant="light" className="absolute justify-self-end">
					<ArrowDownIcon />
				</Button>
			</div>
		</div>
	);
});

export default TransactionInputDrawer;
