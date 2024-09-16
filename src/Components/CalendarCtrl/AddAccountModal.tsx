import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FormEvent, FormEventHandler, useRef } from "react";
import CheckIcon from "../Icons/CheckIcon";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon";
import { createBankAccountAPI } from "../../Services/API/BankAccountAPI";
import { BankAccountAPIData } from "../../Types/APIDataTypes";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { json } from "react-router-dom";

export default function AddAccountModal({ closeModal, addNewAcct }: { closeModal: () => void; addNewAcct: (newAcct: BankAccountAPIData) => void }) {
	const formRef = useRef<HTMLFormElement>(null);

	async function submitNewAcct(f: FormEvent<HTMLFormElement>) {
		f.preventDefault();
		const user = JSON.parse(localStorage.getItem("user")!);

		//@ts-expect-error - ts saying that value property not present
		const addAcctObj = { title: f.currentTarget[1].value, accountType: f.currentTarget[2].value === "Checking" ? 0 : 1, userId: user.userId };

		try {
			const newAcct: BankAccountAPIData = await createBankAccountAPI(addAcctObj);
			addNewAcct(newAcct);
			closeModal();
		} catch (err) {
			ErrorHandler(err);
		}
	}

	return (
		<div className="w-full h-full top-0 absolute addAcctCont gap-4">
			<form className="addAcctModal flex-col" onSubmit={(e) => submitNewAcct(e)} ref={formRef}>
				<h2 className="text-center mb-1 flex justify-center">
					New Account
					<Button
						isIconOnly
						className="relative bg-transparent h-4 left-28"
						onClick={(e) => {
							formRef.current?.reset();
							closeModal();
						}}>
						<InvalidSubmitIcon white={true} />
					</Button>
				</h2>
				<Input radius="none" label="Title" name="type" size="sm" className="addAcctInputs mb-4" color="default" />
				<div className="flex gap-4">
					<Select radius="none" label="Type" name="type" size="sm" className="addAcctInputs text-black">
						<SelectItem key="Checking">Checking</SelectItem>
						<SelectItem key="Saving">Saving</SelectItem>
					</Select>
					<Button className="self-center bg-[#6EC4A7]" radius="none" isIconOnly size="sm" type="submit">
						<CheckIcon />
					</Button>
				</div>
			</form>
		</div>
	);
}
