import { Button, DateInput, Input, Radio, RadioGroup, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Children, LegacyRef, MutableRefObject, Ref, RefObject, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { getAllBankAccountsAPI } from "../../Services/API/BankAccountAPI";
import { BankAccountAPIData, PostTransactionAPIData, TransactionAPIData } from "../../Types/APIDataTypes";
import ArrowDownIcon from "./Icons/ArrowDownIcon";
import { DateValue } from "@internationalized/date";
import { Props } from "react-infinite-scroll-component";
import SubmitTransactionIcon from "./Icons/SubmitTransactionIcon";
import { postTransactionAPI } from "../../Services/API/TransactionAPI";
import InvalidSubmitIcon from "./Icons/InvalidSubmitIcon";
import DebitIcon from "./Icons/DebitIcon";
import CreditIcon from "./Icons/CreditIcon";
import ReactDOM from "react-dom";
import Transaction from "./BudgetComponents/Transaction";
import TransactionPortal from "./BudgetComponents/TransactionPortal";

export type TransactionInputDrawerRef = {
	updateDate: (newDate: DateValue) => void;
};

export type TransactionPortalProps = {
	transaction: TransactionAPIData;
	containerID: string;
};

const countDecimals = function (value: number): number {
	if (Math.floor(value) === value) return 0;
	return value.toString().split(".")[1].length || 0;
};

export const TransactionInputDrawer = forwardRef<TransactionInputDrawerRef>((_, ref) => {
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([]);
	const [date, setDate] = useState<DateValue>();
	const [amount, setAmount] = useState<string>("0.00");
	const [transactionType, setTransactionType] = useState<boolean>(true);
	const [submittingTransaction, setSubmittingTransaction] = useState<boolean>(false);
	const [transactionPortals, setTransactionPortals] = useState<TransactionPortalProps[]>([]);
	const [errorMessage, setErrorMessage] = useState<boolean>(false);

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

	async function SubmitTransaction(event: React.FormEvent<HTMLFormElement>) {
		setSubmittingTransaction(true);
		event.preventDefault();

		const transactionData: PostTransactionAPIData = {
			// @ts-expect-error - TS complains about title not having a value due to it being a string, but it does
			title: event.currentTarget.title.value,
			transactionType: transactionType ? 0 : 1,
			bankAccountId: event.currentTarget.account.value,
			date: event.currentTarget.date.value,
			amount: event.currentTarget.amount.value,
			category: event.currentTarget.category.value,
			description: event.currentTarget.description.value,
		};

		const postResponse = await postTransactionAPI(transactionData);

		if (!postResponse) {
			setTimeout(() => {
				setErrorMessage(true);
				setSubmittingTransaction(false);
				return;
			}, 500);
		} else {
			setTimeout(() => {
				const TransactionData: TransactionAPIData = postResponse?.data;

				const dateContainerID: string = `${date?.year}-${date?.month.toString().padStart(2, "0")}-${date?.day.toString().padStart(2, "0")}Transactions`;

				const newPortal: TransactionPortalProps = {
					transaction: TransactionData,
					containerID: dateContainerID,
				};

				const saveDate = date as DateValue;

				setTransactionPortals([...transactionPortals, newPortal]);
				const form: HTMLFormElement = document.querySelector(".transactionForm") as HTMLFormElement;
				form.reset();
				setDate(saveDate);
				// @ts-expect-error - TS complains about title not having a focus function due to it being a string, but it does
				form.title.focus();
				setSubmittingTransaction(false);
			}, 100);
		}
	}

	const validateAmount: boolean = useMemo(() => {
		if (countDecimals(Number(amount)) > 2) return true;
		if (Number(amount) < 0) return true;
		return false;
	}, [amount]);

	function transactionTypeClick(event: React.MouseEvent<HTMLButtonElement>) {
		const target = event.currentTarget;
		if (target.name === "debitBtn") {
			setTransactionType(true);
		} else {
			setTransactionType(false);
		}
	}

	function clearErrorMessage() {
		setErrorMessage(false);
	}

	return (
		<div id="calendarDrawer" className="absolute transactionDrawer drawerClosed" style={drawerStyle}>
			<div style={{ padding: "0px 27px" }} className="grid">
				<Button onClick={closeDrawer} radius="full" size="sm" isIconOnly variant="light" className="absolute justify-self-start">
					<ArrowDownIcon />
				</Button>
				<form className="w-full px-64 pt-2.5 pb-0.5 grid grid-col-4 grid-rows-2 gap-3 transactionForm" style={formStyle} onSubmit={SubmitTransaction}>
					<div className="absolute -translate-x-32 w-28 text-red-600 font-semibold text-sm h-full pb-6 grid content-end">
						{errorMessage && (
							<span className="text-right">
								Error Submitting Transaction <br /> Try Again
								<Button className="h-4" radius="none" color="danger" onClick={clearErrorMessage}>
									Clear
								</Button>
							</span>
						)}
					</div>
					<div className=" col-start-1 row-start-1 col-span-3 flex gap-3">
						<Input required radius="none" size="sm" className="w-3/5 text-slate-500 basis-3/6" type="text" label="Title" name="title" isClearable id="TransactionDrawerTitle" />
						<DateInput className="col-start-2 row-start-1 basis-1/6" radius="none" label="Date" name="date" size="sm" value={date} onChange={setDate} />
						<Select required selectedKeys={["1"]} radius="none" size="sm" label="Account" name="account" className="h-4 text-slate-500 basis-2/6 row-start-1 ">
							{bankAccounts.map((account, i) => (
								<SelectItem key={`${account.id}`} value={account.id}>
									{account.title}
								</SelectItem>
							))}
						</Select>
					</div>
					<div className="col-start-1 row-start-2 col-span-2 flex gap-3">
						<Button
							isIconOnly
							disabled={validateAmount || errorMessage ? true : false}
							color={validateAmount || errorMessage ? "default" : "primary"}
							size="md"
							isLoading={submittingTransaction}
							radius="none"
							className={`self-center ${validateAmount ? "mb-6" : "mb-2"}`}
							type="submit">
							{errorMessage ? <InvalidSubmitIcon /> : validateAmount ? <InvalidSubmitIcon /> : <SubmitTransactionIcon />}
						</Button>
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
							errorMessage="Invalid Amount"
							isClearable
							startContent={
								<div className="flex items-center">
									{!validateAmount && <span className="text-sm">$</span>}
									{validateAmount && <span className="invalidAmount pb-1">❌</span>}
								</div>
							}
						/>
						{/* <Select required radius="none" className="text-slate-500 " size="sm" label="Type" name="type">
						<SelectItem key="debit">Debit</SelectItem>
						<SelectItem key="credit">Credit</SelectItem>
						</Select> */}
						<div className="flex gap-3 relative -translate-y-1.5">
							<div className="flex flex-col">
								<label htmlFor="debitBtn" className="text-xs mb-0.5 text-slate-300 font-semibold text-center">
									Debit
								</label>
								<Button isIconOnly radius="none" size="sm" name="debitBtn" onClick={transactionTypeClick} color={transactionType ? "danger" : "default"}>
									<DebitIcon />
								</Button>
							</div>
							<div className="flex flex-col">
								<label htmlFor="creditBtn" className="text-xs mb-0.5 text-slate-300 font-semibold relative -translate-x-0.5">
									Credit
								</label>
								<Button isIconOnly radius="none" size="sm" name="creditBtn" onClick={transactionTypeClick} color={transactionType ? "default" : "success"}>
									<CreditIcon />
								</Button>
							</div>
						</div>
					</div>
					<Select defaultSelectedKeys={["None"]} radius="none" size="sm" label="Category" name="category" className="h-4 text-slate-500 col-start-3 row-start-2 ">
						<SelectItem key="None">None</SelectItem>
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
			{transactionPortals.length > 0 && transactionPortals.map((portal, i) => <TransactionPortal transaction={portal.transaction} containerID={portal.containerID} />)}
		</div>
	);
});

export default TransactionInputDrawer;
