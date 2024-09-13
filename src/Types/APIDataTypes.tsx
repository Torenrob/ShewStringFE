export interface BankAccountAPIData {
	id: number;
	title: string;
	accountType: string;
	repeatGroups: RepeatGroupInBankAccountAPIData[];
	transactions: Map<string, TransactionAPIData[]>;
}

export interface TransactionAPIData {
	id: number;
	title: string | null;
	transactionType: "Debit" | "Credit";
	amount: number;
	date: string;
	time: string | null;
	category: string;
	description: string | null;
	createdOn: string;
	bankAccountId: number;
	repeatGroupId: number | null;
}

export interface PostTransactionAPIData {
	title: string | null;
	transactionType: 0 | 1;
	amount: number;
	date: string;
	category: string;
	description: string | null;
	bankAccountId: number;
}

export interface RepeatGroupInBankAccountAPIData {
	id: number;
}

export interface RegisterUserInfo {
	email: string;
	userName: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface UserProfile {
	userName: string;
	email: string;
	firstName: string;
	lastName: string;
	token: string;
}
