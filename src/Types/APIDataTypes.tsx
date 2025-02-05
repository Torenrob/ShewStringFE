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
	categories: Category[];
	email: string;
	firstName: string;
	lastName: string;
	token: string;
}

export interface UserInfo {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	categories: Category[];
}

export interface UserProfile_BankAccounts {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	bankAccounts: BankAccountAPIData[];
	categories: Category[];
	token: string;
}

export interface BankAccountAPIData {
	id: number;
	title: string;
	accountType: string;
	budgets: Budget[];
	transactions: Map<string, TransactionAPIData[]>;
	// repeatGroups: RepeatGroupInBankAccountAPIData[];
}

export interface Budget {
	id: number;
	isAllTime: boolean;
	monthYear: string | null;
	budgetCategories: Category[];
}

export interface CreateBudget {
	userId: string;
	bankAccountId: number;
	isAllTime: boolean;
	monthYear: string | null;
	budgetCategories: Category[];
}

export interface Category {
	id: number;
	title: string;
	amount: number;
	color: string;
	type: "Income" | "Expense";
}

export interface CreateCategory {
	userId: string;
	budget: Budget | CreateBudget;
	title: string;
	amount: number;
	color: string;
	type: "Income" | "Expense";
}

export interface EditCategory {
	categoryId: number;
	title: string;
	amount: number;
	color: string;
}

export interface TransactionAPIData {
	id: number;
	title: string | null;
	transactionType: "Debit" | "Credit";
	amount: number;
	date: string;
	category: Category;
	description: string | null;
	bankAccountId?: number;
	repeatGroupId: number | null;
}

export interface PostTransactionAPIData {
	userId: string;
	title: string | null;
	transactionType: 0 | 1;
	amount: number;
	date: string;
	category: Category;
	description: string | null;
	bankAccountId: number;
}

export interface RepeatGroupInBankAccountAPIData {
	id: number;
}
