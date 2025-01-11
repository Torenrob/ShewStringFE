import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios, { AxiosResponse } from "axios";
import { BankAccountAPIData, RegisterUserInfo, UserProfile } from "../../Types/APIDataTypes";
import { userLoginAPI, userRegisterAPI } from "../ApiCalls/UserAPI";
import Cookies from "js-cookie";
import { getUserBankAccountsAPI } from "../ApiCalls/BankAccountAPI";
import { ErrorHandler } from "../../Helpers/ErrorHandler";
import { UserContext } from "./UserAuthExports";

type Props = { children: React.ReactNode };

export const UserProvider = ({ children }: Props) => {
	const AddAccountTabHolder: BankAccountAPIData = useMemo(() => {
		const hold: BankAccountAPIData = { title: "Add Account", accountType: "Saving", budgets: [], id: 0, transactions: new Map() };
		return hold;
	}, []);
	const navigate = useNavigate();
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isReady, setIsReady] = useState(false);
	const [bankAccounts, setBankAccounts] = useState<BankAccountAPIData[]>([AddAccountTabHolder]);

	const getAccounts = useCallback(
		async (userId: string) => {
			await getUserBankAccountsAPI(userId)
				.then((res) => {
					setBankAccounts(() => res.concat(AddAccountTabHolder));
				})
				.catch((err) => {
					ErrorHandler(err);
				});
		},
		[setBankAccounts, AddAccountTabHolder]
	);

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
					getAccounts(userObj.id).then(() => {});
				}
				navigate("/main");
			} else {
				navigate("/");
			}
			setIsReady(true);
		}, 5);
	}, [navigate, AddAccountTabHolder, getAccounts]);

	//Specifically to load bank accounts on refresh after login/register

	function updBankAccounts(newBaArray: BankAccountAPIData[]) {
		setBankAccounts(newBaArray);
	}

	const registerUser = async (registerUser: RegisterUserInfo) => {
		await userRegisterAPI(registerUser)
			.then((res: AxiosResponse<UserProfile> | void) => {
				if (res) {
					Cookies.set("token", res?.data.token);
					Cookies.set("user", JSON.stringify(res.data));
					getAccounts(res.data.id);
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
		await userLoginAPI(username, password)
			.then((res) => {
				if (res) {
					axios.defaults.headers.common["Authorization"] = "Bearer " + res?.data.token;
					getAccounts(res.data.id);
					Cookies.set("token", res?.data.token, { expires: new Date(new Date().getTime() + 60000 * 30) });
					const userObj: UserProfile = {
						id: res.data.id,
						username: res.data.username,
						categories: res.data.categories,
						email: res.data.email,
						firstName: res.data.firstName,
						lastName: res.data.lastName,
						token: res.data.token,
					};
					Cookies.set("user", JSON.stringify(userObj), { expires: new Date(new Date().getTime() + 60000 * 30) });
					setToken(res?.data.token);
					setUser(userObj);
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
		delete axios.defaults.headers.common["Authorization"];
		setUser(null);
		setToken("");
		navigate("/");
	};

	return <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, registerUser, bankAccounts, updBankAccounts }}>{isReady ? children : null}</UserContext.Provider>;
};
