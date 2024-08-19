import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FormEvent, FormEventHandler, useRef } from "react";
import CheckIcon from "../Icons/CheckIcon";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon";
import { createBankAccountAPI } from "../../Services/API/BankAccountAPI";
import { BankAccountAPIData } from "../../Types/APIDataTypes";
import { ErrorHandler } from "../../Helpers/ErrorHandler";

export default function AddAccountModal({ closeModal, addNewAcct }: { closeModal: () => void; addNewAcct: (newAcct: BankAccountAPIData) => void }) {
	const formRef = useRef<HTMLFormElement>(null);

	async function submitNewAcct(f: FormEvent<HTMLFormElement>) {
		f.preventDefault();
		//@ts-expect-error - ts saying that value property not present
		const addAcctObj = { title: f.currentTarget[0].value, accountType: f.currentTarget[1].value === "Checking" ? 0 : 1 };

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
				<h2 className="text-center mb-1">New Account</h2>
				<Input radius="none" label="Title" name="type" size="sm" className="addAcctInputs mb-4" />
				<div className="flex gap-4">
					<Select radius="none" label="Type" name="type" size="sm" className="addAcctInputs text-black">
						<SelectItem key="Checking">Checking</SelectItem>
						<SelectItem key="Saving">Saving</SelectItem>
					</Select>
					<Button className="self-center bg-black" radius="none" isIconOnly size="sm" type="submit">
						<CheckIcon />
					</Button>
				</div>
				<Button
					isIconOnly
					className="absolute bg-transparent bottom-36 left-80"
					onClick={(e) => {
						formRef.current?.reset();
						closeModal();
					}}>
					<InvalidSubmitIcon white={true} />
				</Button>
			</form>
		</div>
	);
}
