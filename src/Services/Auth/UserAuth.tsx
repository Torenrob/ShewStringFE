import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { UserProfile } from "../../Types/APIDataTypes";
import { userLoginAPI, userRegisterAPI } from "../API/UserAPI";

type UserContextType = {
	user: UserProfile | null;
	token: string | null;
	registerUser: (email: string, username: string, password: string, firstName: string, lastname: string) => void;
	loginUser: (username: string, password: string) => void;
	logout: () => void;
	isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
	const navigate = useNavigate();
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");
		if (user && token) {
			setUser(JSON.parse(user));
			setToken(token);
			axios.defaults.headers.common["Authorization"] = "Bearer " + token;
		}
		setIsReady(true);
	}, []);

	const registerUser = async (email: string, username: string, firstname: string, lastname: string, password: string) => {
		await userRegisterAPI({ email, username, password, firstname, lastname }).then((res) => {
			if (res) {
				localStorage.setItem("token", res?.data.token);
				const userObj = {
					userName: res?.data.userName,
					email: res?.data.email,
					token: res.data.token,
				};
				localStorage.setItem("user", JSON.stringify(userObj));
				setToken(res?.data.token);
				setUser(userObj);
				navigate("/main");
			}
		});
	};

	const loginUser = async (username: string, password: string) => {
		await userLoginAPI(username, password).then((res) => {
			if (res) {
				localStorage.setItem("token", res?.data.token);
				const userObj = {
					userName: res?.data.userName,
					email: res?.data.email,
					token: res.data.token,
				};
				localStorage.setItem("user", JSON.stringify(userObj));
				setToken(res?.data.token);
				setUser(userObj);
				navigate("/main");
			}
		});
	};

	const isLoggedIn = () => {
		return !!user;
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		setToken("");
		navigate("/");
	};

	return <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}>{isReady ? children : null}</UserContext.Provider>;
};
