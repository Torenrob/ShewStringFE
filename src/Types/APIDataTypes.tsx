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
	category: string;
	description: string | null;
	bankAccountId: number;
	repeatGroupId: number | null;
}

export interface PostTransactionAPIData {
	userId: string;
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
	username: string;
	firstName: string;
	lastName: string;
	password: string;
}

export interface UserProfile {
	id: string;
	username: string;
	categories: string[];
	email: string;
	firstName: string;
	lastName: string;
	token: string;
}

export interface UserProfile_BankAccounts {
	id: string;
	bankAccounts: BankAccountAPIData[];
	categories: string[];
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	token: string;
}
