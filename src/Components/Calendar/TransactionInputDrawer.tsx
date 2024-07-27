import { Button, DateInput, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { ChangeEvent, forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { getAllBankAccountsAPI } from "../../Services/API/BankAccountAPI";
import { BankAccountAPIData, PostTransactionAPIData, TransactionAPIData } from "../../Types/APIDataTypes";
import ArrowDownIcon from "./Icons/ArrowDownIcon";
import SubmitTransactionIcon from "./Icons/SubmitTransactionIcon";
import { deleteTransactionAPI, postTransactionAPI, updateTransactionAPI } from "../../Services/API/TransactionAPI";
import InvalidSubmitIcon from "./Icons/InvalidSubmitIcon";
import DebitIcon from "./Icons/DebitIcon";
import CreditIcon from "./Icons/CreditIcon";
import { CalendarContext, UpdateTransactionContainerInfo } from "./CalendarContainer";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { highlightEditedTransactionSwitch } from "../../Utilities/CalendarComponentUtils";
import { EditTransContFunc } from "./DayBox";

export type TransactionInputDrawerRef = {
	updateContainer: (arg: UpdateTransactionContainerInfo) => void;
};

const countDecimals = function (value: string): number {
	return value.split(".")[1].length || 0;
};

export const TransactionInputDrawer = forwardRef<TransactionInputDrawerRef>((_, ref) => {
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([]);
	const [transactionType, setTransactionType] = useState<boolean>(true);
	const [submittingTransaction, setSubmittingTransaction] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<boolean>(false);
	const [containerInfo, setContainerInfo] = useState<UpdateTransactionContainerInfo>({ amount: "0.00", editingExisting: false });

	useImperativeHandle(ref, () => ({
		updateContainer(arg: UpdateTransactionContainerInfo) {
			const { date: newDate, ...transactionContainerInfo } = arg;

			if (JSON.stringify(transactionContainerInfo) === "{}") {
				setContainerInfo({ date: arg.date, amount: "0.00", editingExisting: false });
				return;
			} else {
				setContainerInfo(arg);
				setTransactionType(arg.transactionObj?.transactionType === "Debit");
			}
		},
	}));

	const { setDateTransactionsRef, editDateTransFuncsMap } = useContext(CalendarContext);

	const accountOptions = useCallback(async () => {
		const bankAccounts: BankAccountAPIData[] | null = await getAllBankAccountsAPI();
		if (bankAccounts) {
			setBankAccounts((p) => bankAccounts);
		}
	}, []);

	function cancelHover(event: MouseEvent) {}

	function closeDrawer() {
		const drawer: HTMLElement = document.getElementById("calendarDrawer") as HTMLElement;
		highlightEditedTransactionSwitch();
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

	async function SubmitTransaction(event: React.FormEvent<HTMLFormElement>, editingExisting: boolean) {
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

		let postResponse;
		let editTransactionIsSameDate: boolean; /*  */

		if (containerInfo.editingExisting) {
			//@ts-expect-error - TS wants to be sure every prop in containerInfo.transactionObj is present. According to logic they will all be present.
			const updatedTrans: TransactionAPIData = {
				...transactionData,
				time: containerInfo.transactionObj!.time,
				id: containerInfo.transactionObj!.id,
				createdOn: containerInfo.transactionObj!.createdOn,
				repeatGroupId: containerInfo.transactionObj!.repeatGroupId,
			};

			editTransactionIsSameDate = updatedTrans.date === containerInfo.transactionObj!.date;

			postResponse = await updateTransactionAPI(updatedTrans);
		} else {
			postResponse = await postTransactionAPI(transactionData);
		}

		if (!postResponse) {
			setTimeout(() => {
				console.log("ran");
				setErrorMessage(true);
				setSubmittingTransaction(false);
				return;
			}, 500);
		} else {
			setTimeout(() => {
				const TransactionData: TransactionAPIData = postResponse?.data;

				const saveDate = containerInfo?.date;
				if (!setDateTransactionsRef.current && !editingExisting) {
					console.log("ran");
					setErrorMessage(true);
					setSubmittingTransaction(false);
					return;
				}
				if (containerInfo.editingExisting) {
					if (!editTransactionIsSameDate) {
						const removeTransFunc = editDateTransFuncsMap.current.get(containerInfo.transactionObj!.date)!("remove");
						const addTransFunc = editDateTransFuncsMap.current.get(TransactionData.date)!("");

						removeTransFunc(containerInfo.transactionObj!);
						addTransFunc(TransactionData);
					} else {
						containerInfo.editTransactionFunc!(TransactionData);
					}
				} else {
					setDateTransactionsRef.current!(TransactionData);
				}
				const form: HTMLFormElement = document.querySelector(".transactionForm") as HTMLFormElement;
				form.reset();
				setContainerInfo({ date: saveDate, ...containerInfo });
				// @ts-expect-error - TS complains about title not having a focus function due to it being a string, but it does
				form.title.focus();
				setSubmittingTransaction(false);
			}, 50);
		}
	}

	const validateAmount: boolean = useMemo(() => {
		if (containerInfo.amount?.includes(".")) {
			if (countDecimals(containerInfo?.amount) > 2) return true;
		}
		if (containerInfo?.amount?.startsWith("0") && containerInfo.amount.length > 2) {
			if (!containerInfo?.amount?.match(/^0\d?\./g)) return true;
		}
		if (Number(containerInfo?.amount) < 0) return true;
		return false;
	}, [containerInfo?.amount]);

	function transactionTypeClick(event: React.MouseEvent<HTMLButtonElement>) {
		const target = event.currentTarget;
		if (target.name === "debitBtn") {
			setTransactionType(true);
		} else {
			setTransactionType(false);
		}
	}

	async function deleteTransaction() {
		const resp = await deleteTransactionAPI(containerInfo.id!);
		if (resp?.statusText === "OK") {
			containerInfo.deleteTransactionFunc!(containerInfo.transactionObj!);
			closeDrawer();
		} else {
			ErrorHandler("Transaction Delete API Failed");
		}
	}

	function updateExistingTransDispaly(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) {
		switch (e.target.name) {
			case "title":
				setContainerInfo({ ...containerInfo, title: e.target.value });
				break;
			case "account":
				setContainerInfo({ ...containerInfo, bankAccountId: Number(e.target.value) });
				break;
			case "category":
				setContainerInfo({ ...containerInfo, category: e.target.value });
				break;
			case "description":
				setContainerInfo({ ...containerInfo, description: e.target.value });
				break;
		}
	}

	function updateAmount(e: string) {
		if (e.length === 2) {
			e.concat(".");
		}
		setContainerInfo({ ...containerInfo, amount: e });
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
				<form className="w-full px-64 pt-2.5 pb-0.5 grid grid-col-4 grid-rows-2 gap-3 transactionForm" style={formStyle} onSubmit={(e) => SubmitTransaction(e, containerInfo.editingExisting)}>
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
						<Input
							required
							radius="none"
							size="sm"
							className="w-3/5 text-slate-500 basis-3/6"
							type="text"
							label="Title"
							name="title"
							isClearable
							id="TransactionDrawerTitle"
							value={containerInfo?.title ? containerInfo.title : undefined}
							onChange={updateExistingTransDispaly}
						/>
						<DateInput
							className="col-start-2 row-start-1 basis-1/6"
							radius="none"
							label="Date"
							name="date"
							size="sm"
							value={containerInfo?.date}
							onChange={(e) => setContainerInfo({ ...containerInfo, date: e })}
						/>
						<Select
							required
							selectedKeys={containerInfo?.bankAccountId ? containerInfo.bankAccountId.toString() : bankAccounts[0]?.id.toString()}
							radius="none"
							size="sm"
							label="Account"
							name="account"
							onChange={updateExistingTransDispaly}
							className="h-4 text-slate-500 basis-2/6 row-start-1 ">
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
							{errorMessage ? <InvalidSubmitIcon white={false} /> : validateAmount ? <InvalidSubmitIcon white={false} /> : <SubmitTransactionIcon />}
						</Button>
						<Input
							required
							value={containerInfo.amount}
							onValueChange={(e) => updateAmount(e)}
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
					<Select
						selectedKeys={containerInfo?.category ? [`${containerInfo.category}`] : ["None"]}
						radius="none"
						size="sm"
						label="Category"
						name="category"
						onChange={updateExistingTransDispaly}
						className="h-4 text-slate-500 col-start-3 row-start-2 ">
						<SelectItem key="None">None</SelectItem>
						<SelectItem key="income">Income</SelectItem>
						<SelectItem key="groceries">Groceries</SelectItem>
						<SelectItem key="bills">Bills</SelectItem>
					</Select>
					<Textarea
						radius="none"
						className="col-start-4 row-start-1 row-span-2 mt-1"
						label="Description"
						name="description"
						onChange={updateExistingTransDispaly}
						value={containerInfo?.description ? containerInfo.description : undefined}
					/>
					{containerInfo.editingExisting && (
						<div className="absolute justify-self-end mt-1 flex-col" style={{ right: "232px" }}>
							<Button color="danger" radius="none" isIconOnly onClick={deleteTransaction}>
								<InvalidSubmitIcon white={true} />
							</Button>
							<div className="text-sm text-white">Delete</div>
						</div>
					)}
				</form>
				<Button onClick={closeDrawer} data-hover={cancelHover} radius="full" size="sm" isIconOnly variant="light" className="absolute justify-self-end">
					<ArrowDownIcon />
				</Button>
			</div>
		</div>
	);
});

export default TransactionInputDrawer;
