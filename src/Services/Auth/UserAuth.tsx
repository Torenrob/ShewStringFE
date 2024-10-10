import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { BankAccountAPIData, RegisterUserInfo, UserProfile } from "../../Types/APIDataTypes";
import { userLoginAPI, userRegisterAPI } from "../API/UserAPI";
import Cookies from "../../../node_modules/@types/js-cookie";
import { getUserBankAccountsAPI } from "../API/BankAccountAPI";
import { ErrorHandler } from "../../Helpers/ErrorHandler";

type UserContextType = {
	user: UserProfile | null;
	bankAccounts: BankAccountAPIData[];
	updBankAccts: (newBAarr: BankAccountAPIData[]) => void;
	token: string | null;
	registerUser: (arg0: RegisterUserInfo) => void;
	loginUser: (username: string, password: string) => void;
	logout: () => void;
	isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
	const AddAccountTabHolder: BankAccountAPIData = useMemo(() => {
		const hold: BankAccountAPIData = { title: "Add Account", repeatGroups: [], accountType: "Saving", id: 0, transactions: new Map() };
		return hold;
	}, []);
	const navigate = useNavigate();
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([AddAccountTabHolder]);

	useEffect(() => {
		const userHold = Cookies.get("user");
		const tokenHold = Cookies.get("token");
		setTimeout(() => {
			if (userHold && tokenHold) {
				axios.defaults.headers.common["Authorization"] = "Bearer " + tokenHold;
				const userObj: UserProfile | null = userHold ? JSON.parse(userHold) : null;
				setUser(userObj);
				setToken(tokenHold);
				if (userObj) {
					getAcctsOnRefresh(userObj.id);
				}
				navigate("/main");
			} else {
				navigate("/");
			}
			setIsReady(true);
		}, 5);

		async function getAcctsOnRefresh(userId: string) {
			await getUserBankAccountsAPI(userId)
				.then((res) => {
					setBankAccounts((p) => res.concat(AddAccountTabHolder));
				})
				.catch((err) => {
					ErrorHandler(err);
				});
		}
	}, [navigate, AddAccountTabHolder]);

	//Specifically to load bank accounts on refresh after login/register

	function updBankAccts(newBAarr: BankAccountAPIData[]) {
		setBankAccounts(newBAarr);
	}

	const registerUser = async (registerUser: RegisterUserInfo) => {
		await userRegisterAPI(registerUser)
			.then((res) => {
				if (res) {
					Cookies.set("token", res?.data.token);
					Cookies.set("user", JSON.stringify(res.data));
					setToken(res?.data.token);
					setUser(res?.data);
					axios.defaults.headers.common["Authorization"] = "Bearer " + res?.data.token;
					navigate("/main");
				}
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	};

	const loginUser = async (username: string, password: string) => {
		const now = new Date();
		await userLoginAPI(username, password)
			.then((res) => {
				if (res) {
					setBankAccounts(res.data.bankAccounts.concat(AddAccountTabHolder));
					Cookies.set("token", res?.data.token, { expires: new Date(new Date().getTime() + 60000 * 30) });
					const userObj: UserProfile = {
						id: res.data.id,
						userName: res.data.userName,
						categories: res.data.categories,
						email: res.data.email,
						firstName: res.data.firstName,
						lastName: res.data.lastName,
						token: res.data.token,
					};
					Cookies.set("user", JSON.stringify(userObj), { expires: new Date(new Date().getTime() + 60000 * 30) });
					setToken(res?.data.token);
					setUser(userObj);
					axios.defaults.headers.common["Authorization"] = "Bearer " + res?.data.token;
					navigate("/main");
				}
			})
			.catch((err) => {
				ErrorHandler(err);
			});
	};

	const isLoggedIn = () => {
		return !!user;
	};

	const logout = () => {
		Cookies.remove("token");
		Cookies.remove("user");
		setUser(null);
		setToken("");
		navigate("/");
	};

	return <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, registerUser, bankAccounts, updBankAccts }}>{isReady ? children : null}</UserContext.Provider>;
};
