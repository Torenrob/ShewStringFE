import "./AddCategoryModal.css";
import { Button, Input } from "@nextui-org/react";
import { BankAccountAPIData, Budget, CreateBudget, CreateCategory } from "../../Types/APIDataTypes";
import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon/InvalidSubmitIcon";
import { UserContext } from "../../Services/Auth/UserAuthExports";

export default function AddCategoryModal({
	type,
	budget,
	closeModal,
	submitCategory,
}: {
	type: "Income" | "Expense";
	budget: Budget | CreateBudget;
	closeModal: (type: string) => void;
	submitCategory: (x: CreateCategory) => void;
}) {
	const { user } = useContext(UserContext);
	const [categoryInfo, setCategoryInfo] = useState<CreateCategory>({ title: "", amount: 0, color: "#000000", type: type, userId: user!.id, budget: budget });

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setCategoryInfo({ ...categoryInfo, [name]: value });
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		closeModal(type);
		submitCategory(categoryInfo);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={`absolute shadow-lg shadow-black rounded-md flex-col justify-items-center p-3 h-[22%] w-[15%] bg-[var(--mainBlackTransparent)] -translate-x-[15%] z-50 ${type}`}>
			<Button
				onPress={(e) => {
					closeModal(type);
				}}
				isIconOnly
				className="absolute bg-transparent h-4 right-0">
				<InvalidSubmitIcon white={true} />
			</Button>
			<div className="mb-2 text-center text-large text-white">Add {type} Category</div>
			<Input name="title" onChange={handleChange} value={categoryInfo.title} type="text" className="mb-2" label="Title" size="sm" />
			<div className="flex gap-1.5 w-full">
				<Input
					name="amount"
					onChange={handleChange}
					value={categoryInfo.amount.toString()}
					type="number"
					className="mb-2"
					label="Amount"
					size="sm"
					startContent={
						<div className="flex items-center">
							<span className="text-sm">$</span>
						</div>
					}
				/>
				<div className="flex-col w-16">
					<div className="flex-col bg-gray-600 pl-1.5 rounded-md">
						<label htmlFor="color" className="text-white font-semibold">
							Color
						</label>
						<input name="color" onChange={handleChange} value={categoryInfo.color} type="color" className="h-5 w-5 ml-2" />
					</div>
				</div>
			</div>
			<Button type="submit" className="font-bold" color="primary">
				Submit
			</Button>
		</form>
	);
}
