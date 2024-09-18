import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { FormEvent, FormEventHandler, useContext, useRef } from "react";
import CheckIcon from "../Icons/CheckIcon";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon";
import { createBankAccountAPI, deleteBankAccountAPI } from "../../Services/API/BankAccountAPI";
import { BankAccountAPIData } from "../../Types/APIDataTypes";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { UserContext } from "../../Services/Auth/UserAuth";

export default function AddAccountModal({
	closeModal,
	deleteAcct,
	bankAccounts,
}: {
	closeModal: () => void;
	deleteAcct: (acct2Del: BankAccountAPIData, updBankAcctStateFunc: (newBAarr: BankAccountAPIData[]) => void) => void;
	bankAccounts: BankAccountAPIData[];
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const { updBankAccts } = useContext(UserContext);

	async function delAcct(f: FormEvent<HTMLFormElement>) {
		f.preventDefault();
		//@ts-expect-error - ts saying that value property not present
		const acct2Del: BankAccountAPIData = bankAccounts.find((bA) => bA.id.toString() === f.currentTarget[0].value)!;
		try {
			const delResult: string = await deleteBankAccountAPI(acct2Del);
			deleteAcct(acct2Del, updBankAccts);
			closeModal();
		} catch (err) {
			ErrorHandler(err);
		}
	}

	return (
		<div className="w-full h-full top-0 absolute addAcctCont gap-4">
			<form className="addAcctModal flex-col" onSubmit={(e) => delAcct(e)} ref={formRef}>
				<h2 className="text-center mb-1">
					Delete Account
					<Button
						isIconOnly
						className="bg-transparent relative h-4 left-28"
						onClick={(e) => {
							formRef.current?.reset();
							closeModal();
						}}>
						<InvalidSubmitIcon white={true} />
					</Button>
				</h2>
				<div className="flex gap-4">
					<Select radius="none" label="Account" name="account" size="sm" className="addAcctInputs text-black">
						{bankAccounts.map((bA) => {
							return <SelectItem key={bA.id}>{bA.title}</SelectItem>;
						})}
					</Select>
					<Button className="self-center bg-[#6EC4A7]" radius="none" isIconOnly size="sm" type="submit">
						<CheckIcon />
					</Button>
				</div>
			</form>
		</div>
	);
}
