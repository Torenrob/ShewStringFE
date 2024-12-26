import "./AddAccountModal.css";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FormEvent, useContext, useRef } from "react";
import CheckIcon from "../Icons/CheckIcon/CheckIcon.tsx";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon/InvalidSubmitIcon.tsx";
import { createBankAccountAPI } from "../../Services/ApiCalls/BankAccountAPI.tsx";
import { BankAccountAPIData } from "../../Types/APIDataTypes.tsx";
import { ErrorHandler } from "../../Helpers/ErrorHandler.tsx";
import { UserContext } from "../../Services/Auth/UserAuth.tsx";

export default function AddAccountModal({
	closeModal,
	addNewAcct,
}: {
	closeModal: () => void;
	addNewAcct: (newAcct: BankAccountAPIData, bankAcctStateFunc: (newBAarr: BankAccountAPIData[]) => void) => void;
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const { user, updBankAccounts } = useContext(UserContext);

	async function submitNewAcct(f: FormEvent<HTMLFormElement>) {
		f.preventDefault();
		//@ts-expect-error - ts saying that value property not present
		const addAcctObj = { title: f.currentTarget[1].value, accountType: f.currentTarget[2].value === "Checking" ? 0 : 1, userId: user.id };

		try {
			const newAcct: BankAccountAPIData = await createBankAccountAPI(addAcctObj);
			addNewAcct(newAcct, updBankAccounts);
			closeModal();
		} catch (err) {
			ErrorHandler(err);
		}
	}

	return (
		<div className="w-full h-full top-0 absolute addAcctCont gap-4">
			<form className="addAcctModal flex-col" onSubmit={(e) => submitNewAcct(e)} ref={formRef}>
				<h2 className="text-center mb-1 flex justify-center">
					Add Bank Account
					<Button
						isIconOnly
						className="absolute bg-transparent h-4 right-0 mt-1 md:-mt-1"
						onClick={() => {
							formRef.current?.reset();
							closeModal();
						}}>
						<InvalidSubmitIcon white={true} />
					</Button>
				</h2>
				<Input radius="none" label="Account Name" name="type" size="sm" className="addAcctInputs mb-4" color="default" />
				<div className="flex gap-4">
					<Select radius="none" label="Account Type" name="type" size="sm" className="addAcctInputs text-black">
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
