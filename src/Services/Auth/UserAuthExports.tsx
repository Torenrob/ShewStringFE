import {createContext} from "react";
import {BankAccountAPIData, RegisterUserInfo, UserProfile} from "../../Types/APIDataTypes.tsx";

export type UserContextType = {
    user: UserProfile | null;
    bankAccounts: BankAccountAPIData[];
    updBankAccounts: (newBaArr: BankAccountAPIData[]) => void;
    token: string | null;
    registerUser: (arg0: RegisterUserInfo) => void;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);