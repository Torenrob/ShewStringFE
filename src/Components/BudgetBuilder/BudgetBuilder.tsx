import "./BudgetBuilder.css";
import React, { useContext, useState } from "react";
import { Button, Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import { UserContext } from "../../Services/Auth/UserAuthExports.tsx";
import SpanIcon from "../Icons/SpanIcon/SpanIcon.tsx";
import { bool } from "yup";
import AddTransactionIcon from "../Icons/AddTransactionIcon/AddTransactionIcon.tsx";
import CreditIcon from "../Icons/CreditIcon/CreditIcon.tsx";
import DebitIcon from "../Icons/DebitIcon/DebitIcon.tsx";
import MinusIcon from "../Icons/MinusIcon/MinusIcon.tsx";
import EqualsIcon from "../Icons/EqualsIcon/EqualsIcon.tsx";

function BudgetBuilder() {
	const { bankAccounts } = useContext(UserContext);
	const [allTimeBudget, setAllTimeBudget] = useState(true);

	function allTimeBudgetChange(isSelected: boolean) {
		setAllTimeBudget(isSelected);
	}

	const bankAcctsNoAddAcct = bankAccounts.filter((x) => x.id !== 0);

	return (
		<>
			<div></div>
			<div className="min-h-full min-w-full rounded-md grid grid-rows-11 gap-3.5">
				<div className="row-span-1 h-full w-full flex justify-between pl-12">
					<span className="text-white self-center pl-2 text-4xl">Budget Setup</span>
					<div className="w-[45%] flex justify-around bg-[#333333] rounded-md">
						<Select radius="sm" label="Account" name="account" size="sm" className="self-center w-[40%] text-black">
							{bankAcctsNoAddAcct.map((bA) => {
								return (
									<SelectItem value={bA.id} key={bA.id}>
										{bA.title}
									</SelectItem>
								);
							})}
						</Select>
						<div className="w-[55%] flex gap-3.5 justify-center">
							<Checkbox classNames={{ label: "text-white" }} isSelected={allTimeBudget} onValueChange={allTimeBudgetChange} color="primary">
								All-Time
							</Checkbox>
							<div className="max-h-[85%] flex-col content-center">
								<div className={`self-center justify-self-center ${allTimeBudget ? "text-gray-500" : "text-white"}`}>Budget Month</div>
								<input disabled={allTimeBudget} name="budgetMonth" type="month" className="h-[40%] rounded-md p-2 self-center" />
							</div>
							<Button size="sm" className="self-center text-gray-900 font-medium" color="primary">
								Save
							</Button>
						</div>
					</div>
				</div>
				<div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md relative z-50 flex-col" id="budgetIncome">
					<div className="flex h-10">
						<div className="w-40 h-full bg-[var(--mainGray)] rounded-br-md relative flex z-50">
							<div className="w-1 h-1 bg-[var(--mainGray)] budgetTitleSection absolute right-0 translate-x-[100%]"></div>
							<span className="text-white font-semibold text-2xl self-center self w-full text-center">Income</span>
							<div className="w-1 h-1 budgetTitleSection bg-[var(--mainGray)] absolute bottom-0 translate-y-[100%]"></div>
						</div>
						<div className="h-full">
							<Button className="border-[var(--mainWhite)] border-4 bg-[var(--greenLogo)] font-semibold" radius="sm">
								Add Line +
							</Button>
						</div>
					</div>
					<div className="h-[76%] p-1 w-full">{/* To do: Enter Income category logic*/}</div>
					<div className="h-[11.5%] w-full p-1">{/* To do: Enter Income total logic*/}</div>
					<div className="absolute h-20 w-20 bg-[var(--mainGray)] rounded-[50%] bottom-0 right-[50%] translate-y-[58%] flex">
						<MinusIcon />
					</div>
				</div>
				<div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md relative flex-col" id="budgetExpenses">
					<div className="flex">
						<div className="w-40 h-10 bg-[var(--mainGray)] rounded-br-md relative flex">
							<div className="w-1 h-1 bg-[var(--mainGray)] budgetTitleSection absolute right-0 translate-x-[100%]"></div>
							<span className="text-white font-semibold text-2xl self-center self w-full text-center">Expenses</span>
							<div className="w-1 h-1 budgetTitleSection bg-[var(--mainGray)] absolute bottom-0 translate-y-[100%]"></div>
						</div>
						<div className="h-10">
							<Button className="border-[var(--mainWhite)] border-4 bg-[var(--greenLogo)] font-bold" radius="sm">
								Add Line +
							</Button>
						</div>
					</div>
					<div className="h-[76%] p-1 w-full">{/* To do: Enter Expense category logic*/}</div>
					<div className="h-[11.5%] w-full p-1">{/* To do: Enter Expense total logic*/}</div>
					<div className="absolute h-20 w-20 bg-[var(--mainGray)] rounded-[50%] bottom-0 right-[50%] translate-y-[58%] flex ">
						<EqualsIcon />
					</div>
				</div>
				<div className="row-span-3 h-full w-full bg-[var(--mainWhite)] rounded-md flex-col" id="budgetNetCashFlow">
					<div className="w-48 h-10 bg-[var(--mainGray)] rounded-br-md relative">
						<div className="w-1 h-1 bg-[var(--mainGray)] budgetTitleSection absolute right-0 translate-x-[100%]"></div>
						<span className="text-white font-semibold text-2xl self-center self w-full text-center bg-[var(--mainGray)]">Net Cash Flow</span>
						<div className="w-1 h-1 budgetTitleSection bg-[var(--mainGray)] absolute bottom-0 translate-y-[100%]"></div>
					</div>
					<div className="h-[76%] p-1 w-full">{/* To do: Enter Net Cash Flow Logic */}</div>
				</div>
			</div>
		</>
	);
}

export default BudgetBuilder;
