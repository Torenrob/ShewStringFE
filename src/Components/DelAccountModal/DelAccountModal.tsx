import "./DelAccountModal.css"
import { Button, Select, SelectItem } from "@nextui-org/react";
import React, {ChangeEvent, FormEvent, useContext, useRef, useState} from "react";
import CheckIcon from "../Icons/CheckIcon/CheckIcon.tsx";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon/InvalidSubmitIcon.tsx";
import { deleteBankAccountAPI } from "../../Services/ApiCalls/BankAccountAPI.tsx";
import { BankAccountAPIData } from "../../Types/APIDataTypes.tsx";
import { ErrorHandler } from "../../Helpers/ErrorHandler.tsx";
import { UserContext } from "../../Services/Auth/UserAuthExports.tsx";

export default function DelAccountModal({
	closeModal,
	deleteAcct,
	bankAccounts,
}: {
	closeModal: () => void;
	deleteAcct: (acct2Del: BankAccountAPIData, updBankAcctStateFunc: (newBAarr: BankAccountAPIData[]) => void) => void;
	bankAccounts: BankAccountAPIData[];
}) {
	const formRef = useRef<HTMLFormElement>(null);
	const { updBankAccounts } = useContext(UserContext);
	const [value, setValue] = useState<string>(bankAccounts[0].id.toString())

	const handleSelection = (e: ChangeEvent<HTMLSelectElement>) => {
		setValue(e.target.value);
	}

	async function delAcct(f: FormEvent<HTMLFormElement>) {
		f.preventDefault();
		const acct2Del: BankAccountAPIData = bankAccounts.find((bA) => bA.id.toString() === value)!;
		try {
			await deleteBankAccountAPI(acct2Del);
			deleteAcct(acct2Del, updBankAccounts);
			closeModal();
		} catch (err) {
			ErrorHandler(err);
		}
	}

	return (
		<div className="w-full h-full top-0 absolute delAcctCont gap-4">
			<form className="delAcctModal flex-col" onSubmit={(e) => delAcct(e)} ref={formRef}>
				<h2 className="text-center mb-1">
					Delete Account
					<Button
						isIconOnly
						className="bg-transparent absolute h-4 right-0 mt-1 md:-mt-1"
						onPress={() => {
							formRef.current?.reset();
							closeModal();
						}}>
						<InvalidSubmitIcon white={true} />
					</Button>
				</h2>
				<div className="flex gap-4">
					<Select radius="none" selectedKeys={[value]} label="Account" name="account" size="sm" onChange={handleSelection} className="addAcctInputs text-black">
						{bankAccounts.map((bA) => {
							return <SelectItem value={bA.id} key={bA.id}>{bA.title}</SelectItem>;
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
