import "./BudgetBuilder.css";
import React, { ChangeEvent, useContext, useState } from "react";
import { Button, Checkbox, Input, Select, SelectItem, SharedSelection, user } from "@nextui-org/react";
import { UserContext } from "../../Services/Auth/UserAuthExports.tsx";
import SpanIcon from "../Icons/SpanIcon/SpanIcon.tsx";
import { bool } from "yup";
import AddTransactionIcon from "../Icons/AddTransactionIcon/AddTransactionIcon.tsx";
import CreditIcon from "../Icons/CreditIcon/CreditIcon.tsx";
import DebitIcon from "../Icons/DebitIcon/DebitIcon.tsx";
import MinusIcon from "../Icons/MinusIcon/MinusIcon.tsx";
import EqualsIcon from "../Icons/EqualsIcon/EqualsIcon.tsx";
import { BankAccountAPIData, Budget, Category, CreateBudget, CreateCategory, EditCategory } from "../../Types/APIDataTypes.tsx";
import AddCategoryModal from "../AddCategoryModal/AddCategoryModal.tsx";
import BudgetBuilderLineItem from "../BudgetBuilderLineItem/BudgetBuilderLineItem.tsx";
import { ErrorHandler } from "../../Helpers/ErrorHandler.tsx";
import { _getCurrMonth } from "../Calendar/CalendarExports.tsx";
import { createCategoryExistingBudgetAPI, createCategoryNewBudgetAPI, deleteCategoryAPI } from "../../Services/ApiCalls/CategoryAPI.tsx";

function BudgetBuilder() {
	const { bankAccounts, user } = useContext(UserContext);
	const bankAcctsNoAddAcct = bankAccounts.filter((x) => x.id !== 0);
	const [allTimeBudget, setAllTimeBudget] = useState<boolean>(true);
	const [budgetMonthYear, setBudgetMonthYear] = useState<string>(`${_getCurrMonth().year}-${_getCurrMonth().month.toString().padStart(2, "0")}`);
	const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccountAPIData>(bankAcctsNoAddAcct[0]);
	const [selectedBudget, setSelectedBudget] = useState<Budget | CreateBudget>(selectedBankAccount.budgets[0]);
	const [showAddIncomeCat, setShowAddIncomeCat] = useState<boolean>(false);
	const [showAddExpenseCat, setShowAddExpenseCat] = useState<boolean>(false);

	function allTimeBudgetChange(isSelected: boolean) {
		setAllTimeBudget(isSelected);

		if (isSelected) {
			setSelectedBudget((p) => {
				const newBudget: Budget = { ...selectedBankAccount.budgets[0] };
				return newBudget;
			});
		} else {
			setSelectedBudget((p) => {
				const existingbudget: Budget | undefined = selectedBankAccount.budgets.find((b) => b.monthYear === budgetMonthYear);

				if (!existingbudget) {
					const newBudget: CreateBudget = { monthYear: budgetMonthYear, bankAccountId: selectedBankAccount.id, budgetCategories: [], isAllTime: false, userId: user!.id };

					return newBudget;
				}

				return existingbudget;
			});
		}
	}

	function handleBudgetMonthYearChange(e: ChangeEvent<HTMLInputElement>) {
		setBudgetMonthYear(e.target.value);
	}

	function handleAccountSelectionChange(e: SharedSelection) {
		setSelectedBankAccount(bankAcctsNoAddAcct[bankAcctsNoAddAcct.findIndex((x) => x.id.toString() === e.currentKey)]);
	}

	function addCategory(type: string) {
		switch (type) {
			case "Income":
				setShowAddIncomeCat(true);
				break;
			case "Expense":
				setShowAddExpenseCat(true);
				break;
			default:
				return;
		}
	}

	function closeAddCategory(type: string) {
		switch (type) {
			case "Income":
				setShowAddIncomeCat(false);
				break;
			case "Expense":
				setShowAddExpenseCat(false);
				break;
			default:
				return;
		}
	}

	async function submitNewCategory(category: CreateCategory) {
		const isExistingBudget: boolean = "id" in category.budget;

		const budgetWithCreatedCategory: Budget | null = isExistingBudget ? await createCategoryExistingBudgetAPI(category) : await createCategoryNewBudgetAPI(category);

		if (budgetWithCreatedCategory) {
			setSelectedBudget((p) => {
				const newBudget: Budget = { ...budgetWithCreatedCategory };

				return newBudget;
			});
		}
	}

	async function editCategory(category: EditCategory) {
		return null;
	}

	async function deleteCategory(categoryId: number) {
		const budgetAfterCategoryDelete: Budget | null = await deleteCategoryAPI(categoryId, user!.id);

		if (budgetAfterCategoryDelete) {
			setSelectedBudget((p) => {
				const newBudget: Budget = { ...budgetAfterCategoryDelete };

				return newBudget;
			});
		}
	}

	function getCategoryMonthlyAvg(category: Category): number | string {
		const allAcctTrans = [...selectedBankAccount.transactions.values()].flat();

		const categoryAcctTrans = allAcctTrans.filter((x) => x.category?.id === category.id);

		const categoryTransTotal = categoryAcctTrans.reduce((acc, curTrans) => acc + curTrans.amount, 0);

		const categoryAvg = categoryTransTotal / categoryAcctTrans.length;

		return isNaN(categoryAvg) ? "No Data" : categoryAvg;
	}

	return (
		<>
			<div className="min-h-full min-w-full rounded-md grid grid-rows-11 gap-[1.25vh]">
				<div className="row-span-1 h-full w-full flex justify-between pl-12">
					<span className="text-white self-center pl-2 text-4xl">Budget Setup</span>
					<div className="w-[45%] flex justify-around bg-[#333333] rounded-md">
						<Select
							radius="sm"
							defaultSelectedKeys={[`${selectedBankAccount.id}`]}
							onSelectionChange={handleAccountSelectionChange}
							label="Account"
							name="account"
							size="sm"
							className="self-center w-[40%] text-black">
							{bankAcctsNoAddAcct.map((bA) => {
								return (
									<SelectItem value={bA.id} key={bA.id}>
										{bA.title}
									</SelectItem>
								);
							})}
						</Select>
						<div className="w-[55%] flex gap-3.5 justify-around">
							<Checkbox classNames={{ label: "text-white" }} isSelected={allTimeBudget} onValueChange={allTimeBudgetChange} color="primary">
								All-Time
							</Checkbox>
							<div className="max-h-[85%] flex-col content-center">
								<div className={`self-center justify-self-center ${allTimeBudget ? "text-gray-500" : "text-white"}`}>Budget Month</div>
								<input
									disabled={allTimeBudget}
									onChange={handleBudgetMonthYearChange}
									value={budgetMonthYear}
									name="budgetMonth"
									id="budgetMonth"
									type="month"
									className="h-[40%] rounded-md p-2 self-center"
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md relative z-50 flex" id="budgetIncome">
					<div className="flex-col h-full">
						<div className="flex h-[9.5%]">
							<div className="w-40 h-full bg-[var(--mainGray)] rounded-br-md relative flex z-50">
								<div className="w-1 h-1 bg-[var(--mainGray)] budgetTitleSection absolute right-0 translate-x-[100%]"></div>
								<span className="text-white font-semibold text-2xl self-center w-full text-center">Income</span>
								<div className="w-1 h-1 budgetTitleSection bg-[var(--mainGray)] absolute bottom-0 translate-y-[100%]"></div>
							</div>
							<div className="h-full">
								<Button onPress={(e) => addCategory("Income")} className="border-[var(--mainWhite)] h-full w-full border-t-4 border-l-4 border-r-4 bg-[var(--greenLogo)] font-semibold" radius="sm">
									Add Line +
								</Button>
							</div>
						</div>
						<div className="w-full h-[90.5%] p-1">
							<div className="bg-[var(--lightBlueLogo)] min-w-full min-h-full rounded-md"></div>
						</div>
					</div>
					<div className="w-full h-full py-1 pr-1">
						<div className="flex-col w-full h-full budgetCategoryTable rounded-md">
							<div className="h-[85%] w-full flex-col budgetCategoryList">
								<div className="flex w-full text-large categoryListTableHeaders h-[14%]">
									<div>#</div>
									<div>Category</div>
									<div>Amount</div>
									<div>Color</div>
									<div>Monthly Avg</div>
									<div>Health</div>
									<div>Edit/Delete</div>
									<div className="!w-[0.3125rem]"></div>
								</div>
								<div className="w-full flex-col max-h-[86.5%] min-h-[86.5%] overflow-y-auto categoryListScroll pt-1">
									{selectedBudget?.budgetCategories
										.filter(({ type }) => type === "Income")
										.map((bC, i) => {
											return <BudgetBuilderLineItem i={i} bC={bC} getCategoryMonthlyAvg={getCategoryMonthlyAvg} edit={editCategory} key={bC.id} deleteCategory={deleteCategory} />;
										})}
								</div>
							</div>
							<div className="h-[15%] w-full p-1 budgetCategoryTableTotal flex">
								<div className="h-[80%] w-44 bg-yellow-400 self-center relative left-[25%]">Total Budget Income:</div>
							</div>
						</div>
					</div>
					<div className="absolute h-[7vh] w-[7vh] bottom-0 left-[45%] translate-y-[58%] flex">
						<div className="rounded-[50%] bg-[var(--mainWhite)] p-1 builderMathIcon border-none">
							<MinusIcon />
						</div>
					</div>
				</div>
				<div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md relative  flex" id="budgetExpense">
					<div className="flex-col h-full">
						<div className="flex h-[9.5%]">
							<div className="w-40 h-full bg-[var(--mainGray)] rounded-br-md relative flex z-50">
								<div className="w-1 h-1 bg-[var(--mainGray)] budgetTitleSection absolute right-0 translate-x-[100%]"></div>
								<span className="text-white font-semibold text-2xl self-center w-full text-center">Expense</span>
								<div className="w-1 h-1 budgetTitleSection bg-[var(--mainGray)] absolute bottom-0 translate-y-[100%]"></div>
							</div>
							<div className="h-full">
								<Button onPress={(e) => addCategory("Expense")} className="border-[var(--mainWhite)] h-full w-full border-t-4 border-l-4 border-r-4 bg-[var(--greenLogo)] font-semibold" radius="sm">
									Add Line +
								</Button>
							</div>
						</div>
						<div className="w-full h-[90.5%] p-1">
							<div className="bg-[var(--lightBlueLogo)] min-w-full min-h-full rounded-md"></div>
						</div>
					</div>
					<div className="w-full h-full py-1 pr-1">
						<div className="flex-col w-full h-full budgetCategoryTable rounded-md">
							<div className="h-[85%] w-full flex-col budgetCategoryList">
								<div className="flex w-full text-large categoryListTableHeaders h-[14%]">
									<div>#</div>
									<div>Category</div>
									<div>Amount</div>
									<div>Color</div>
									<div>Monthly Avg</div>
									<div>Health</div>
									<div>Edit/Delete</div>
									<div className="!w-[0.3125rem]"></div>
								</div>
								<div className="w-full max-h-[86.5%] min-h-[86.5%] overflow-y-auto flex-col categoryListScroll pt-1">
									{selectedBudget?.budgetCategories
										.filter(({ type }) => type === "Expense")
										.map((bC, i) => {
											return <BudgetBuilderLineItem i={i} bC={bC} getCategoryMonthlyAvg={getCategoryMonthlyAvg} edit={editCategory} key={bC.id} deleteCategory={deleteCategory} />;
										})}
								</div>
							</div>
							<div className="h-[15%] w-full p-1 budgetCategoryTableTotal">{/* To do: Enter Expense total logic*/}</div>
						</div>
					</div>
					<div className="absolute h-[7vh] w-[7vh] bottom-0 left-[45%] translate-y-[58%] flex">
						<div className="rounded-[50%] bg-[var(--mainWhite)] p-1 builderMathIcon border-none">
							<EqualsIcon />
						</div>
					</div>
				</div>
				<div className="row-span-3 h-full w-full bg-[var(--mainWhite)] rounded-md flex-col" id="budgetNetCashFlow">
					<div className="w-48 h-10 bg-[var(--mainGray)] rounded-br-md relative flex">
						<div className="w-1 h-1 bg-[var(--mainGray)] budgetTitleSection absolute right-0 translate-x-[100%]"></div>
						<span className="text-white font-semibold text-2xl w-full self-center text-center bg-[var(--mainGray)]">Net Cash Flow</span>
						<div className="w-1 h-1 budgetTitleSection bg-[var(--mainGray)] absolute bottom-0 translate-y-[100%]"></div>
					</div>
					<div className="h-[76%] p-1 w-full">{/* To do: Enter Net Cash Flow Logic */}</div>
				</div>
			</div>
			{showAddIncomeCat && <AddCategoryModal type={"Income"} budget={selectedBudget} closeModal={closeAddCategory} submitCategory={submitNewCategory} />}
			{showAddExpenseCat && <AddCategoryModal type={"Expense"} budget={selectedBudget} closeModal={closeAddCategory} submitCategory={submitNewCategory} />}
		</>
	);
}

export default BudgetBuilder;
