import {Category, TransactionAPIData} from "../../Types/APIDataTypes.tsx";
import {DateValue} from "@nextui-org/react";
import React, {createContext, MutableRefObject} from "react";
import {editTransOnDateFuncs} from "../DayBox/DayBox.tsx";
import {DateComponentInfo} from "../../Types/CalendarTypes.tsx";

export type MonthRange = {
    startMonth: string;
    endMonth: string;
};

export type DragObject = {
    globalDragOn: boolean;
    dropping: boolean | null;
    paginationDragState: { (dragOn: boolean): void }[];
    containerDropped: () => void;
    removeTransactionFromDate: (transaction: TransactionAPIData) => void;
    dragItemY: number;
};

export type UpdateTransactionContainerInfo = {
    id?: number;
    date?: DateValue;
    title?: string | null;
    amount: string;
    transactionType?: "Debit" | "Credit";
    category?: Category;
    description?: string | null;
    bankAccountId?: string;
    editingExisting: boolean;
    transactionObj?: TransactionAPIData;
    deleteTransactionFromDate?: (trans: TransactionAPIData) => void;
    editTransactionFunc?: (t: TransactionAPIData) => void;
};

export type CalendarContextType = {
    openDrawer: (arg: UpdateTransactionContainerInfo) => void;
    setNumberOfDays: React.Dispatch<React.SetStateAction<number | null>>;
    setDaysLoaded: React.Dispatch<React.SetStateAction<Set<string> | null>>;
    dragObject: MutableRefObject<DragObject>;
    dailyBalancesMap: MutableRefObject<Map<string, number>>;
    setStateDailyBalanceMap: MutableRefObject<Map<string, (arg: number) => void>>;
    dateTransactionsMap: MutableRefObject<Map<string, TransactionAPIData[]> | null>;
    addTransToDate: MutableRefObject<(transactions: TransactionAPIData) => void> | MutableRefObject<undefined>;
    editTransOnDatesFuncsMap: MutableRefObject<Map<string, editTransOnDateFuncs>>;
};

export const CalendarContext = createContext<CalendarContextType>(undefined!);