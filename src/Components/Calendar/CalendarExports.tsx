//Break Down Current UTC Date into Local Date Object for Current User Calendar(U.S.)
import {LocalMonth, MonthComponentInfo} from "../../Types/CalendarTypes.tsx";
import {createMonthObject, getMonthName, setMobileProps, setYtrans} from "../../Utilities/UtilityFuncs.tsx";
import React, {createContext, MutableRefObject} from "react";
import {TransactionAPIData} from "../../Types/APIDataTypes.tsx";
import {editTransOnDateFuncs} from "../DayBox/DayBox.tsx";
import {DragObject, UpdateTransactionContainerInfo} from "../CalendarCtrl/CalendarCtrlExports.tsx";

export function _getCurrMonth(): LocalMonth {
    const locString: string = new Date()?.toLocaleDateString();
    const monthNumber: number = Number(locString?.match(/^([^/]+)/)![0]);
    const yearNumber: number = Number(locString?.match(/\/(\d{4})$/)![1]);
    return {
        month: monthNumber,
        monthName: getMonthName(monthNumber),
        year: yearNumber,
        styleYtransition: 0,
        mobileEnd: 0,
        mobileStart: 0,
        mobileY: 0,
    };
}

//Calculate Month Comp arr on initialization
export function calcInitMonth({index,currentMonth,prevYtrans,prevMobileY,prevMobileEnd}: {index: number;currentMonth: LocalMonth;
    prevYtrans: number;
    prevMobileY: number;
    prevMobileEnd: number;
}): LocalMonth {
    if (index === 7) {
        return applyIndexSeven(currentMonth, index, prevYtrans, prevMobileY, prevMobileEnd);
    }

    const monthDiff = currentMonth.month + (index - 7);
    const yearDiff = Math.floor((monthDiff - 1) / 12);

    if (monthDiff >= 1 && monthDiff <= 12) {
        return updateMonthObject(currentMonth, index, prevYtrans, prevMobileY, prevMobileEnd, monthDiff, 0);
    }

    const adjustedMonth = monthDiff > 12 ? monthDiff % 12 || 12 : 12 + (monthDiff % 12);
    return updateMonthObject(currentMonth, index, prevYtrans, prevMobileY, prevMobileEnd, adjustedMonth, yearDiff);
}

export function applyIndexSeven(currentMonth: LocalMonth,index: number,prevYtrans: number, prevMobileY: number,prevMobileEnd: number
): LocalMonth {
    currentMonth.styleYtransition = setYtrans(index, prevYtrans, currentMonth);
    const { mobileY, mobileStart, mobileEnd } = setMobileProps(index, prevMobileY, prevMobileEnd, currentMonth);
    return { ...currentMonth, mobileY, mobileStart, mobileEnd };
}

export function updateMonthObject(currentMonth: LocalMonth,index: number,prevYtrans: number,prevMobileY: number,prevMobileEnd: number,
    month: number, yearDiff: number
): LocalMonth {
    const updatedMonth = { ...currentMonth };
    updatedMonth.month = month;
    updatedMonth.monthName = getMonthName(month);
    updatedMonth.year += yearDiff;
    updatedMonth.styleYtransition = setYtrans(index, prevYtrans, updatedMonth);

    const mobileProps = setMobileProps(index, prevMobileY, prevMobileEnd, updatedMonth);
    return createMonthObject(updatedMonth, index, prevYtrans, mobileProps);
}

export function mkMonthCompInfo(monthInfo: Date, prevYTrans: number, index: number, prevMobileY: number, prevMobileEnd: number): MonthComponentInfo {
    const monthHold: LocalMonth = { month: monthInfo.getMonth() + 1, year: monthInfo.getFullYear(), monthName: "", styleYtransition: 0, mobileStart: 0, mobileEnd: 0, mobileY: 0 };

    const { mobileStart, mobileEnd, mobileY } = setMobileProps(index, prevMobileY, prevMobileEnd, monthHold);

    const monthObj: LocalMonth = {
        month: monthHold.month,
        monthName: getMonthName(monthHold.month),
        year: monthHold.year,
        styleYtransition: setYtrans(index, prevYTrans, monthHold),
        mobileEnd: mobileEnd,
        mobileStart: mobileStart,
        mobileY: mobileY,
    };

    return {
        monthObj: monthObj,
        key: `${monthObj?.monthName}${monthObj?.year}`,
    };
}

export function calcInputMonths(startDate: Date, endDate: Date): MonthComponentInfo[] {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    const yearDifference = endYear - startYear;
    const monthDifference = endMonth - startMonth;

    const numOfMnths = yearDifference * 12 + monthDifference + 1;

    let prevYTrans: number = 0;
    let prevMobileY: number = 0;
    let prevMobileEnd: number = 0;

    return [...Array(numOfMnths)].map((_, i) => {
        const newMonth = returnMonthYr(startMonth + i, startYear);
        const monthComp = mkMonthCompInfo(newMonth, prevYTrans, i + 1, prevMobileY, prevMobileEnd);
        prevYTrans = monthComp.monthObj.styleYtransition;
        prevMobileY = monthComp.monthObj.mobileY;
        prevMobileEnd = monthComp.monthObj.mobileEnd;
        return monthComp;
    });
}

export function returnMonthYr(compMonthNum: number, year: number): Date {
    if (compMonthNum >= 0 && compMonthNum <= 11) {
        return new Date(`${year}-${compMonthNum + 1}-1`);
    } else {
        return returnMonthYr(compMonthNum - 12, year + 1);
    }
}

export function getTotalNumberOfDays(monthArr: MonthComponentInfo[]): number {
    return monthArr.reduce((acc, curr): number => {
        return acc + new Date(curr.monthObj.year, curr.monthObj.month, 0).getDate();
    },0)
}