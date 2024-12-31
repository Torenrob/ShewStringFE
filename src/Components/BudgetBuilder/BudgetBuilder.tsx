import "./BudgetBuilder.css"
import React, {useContext, useState} from 'react';
import {Button, Checkbox, Input, Select, SelectItem} from "@nextui-org/react";
import {UserContext} from "../../Services/Auth/UserAuthExports.tsx";
import SpanIcon from "../Icons/SpanIcon/SpanIcon.tsx";
import {bool} from "yup";

function BudgetBuilder() {
    const {bankAccounts} = useContext(UserContext);
    const [allTimeBudget, setAllTimeBudget] = useState(true);

    function allTimeBudgetChange(isSelected: boolean) {
        setAllTimeBudget(isSelected);
    }

    const bankAcctsNoAddAcct = bankAccounts.filter(x => x.id !== 0);

    return (
        <>
            <div>

            </div>
            <div className="min-h-full min-w-full rounded-md grid grid-rows-11 gap-3.5">
                <div className="row-span-1 h-full w-full flex justify-between pl-12">
                        <span className="text-white self-center pl-2 text-4xl">Budget Setup</span>
                    <div className="w-[50%] flex justify-around bg-[#333333] rounded-md">
                        <Select radius="sm" label="Account" name="account" size="sm"
                                className="self-center w-[40%] text-black">
                            {bankAcctsNoAddAcct.map((bA) => {
                                return <SelectItem value={bA.id} key={bA.id}>{bA.title}</SelectItem>;
                            })}
                        </Select>
                        <div className="w-[45%] flex gap-3.5 justify-center">
                            <Checkbox classNames={{label: "text-white"}} isSelected={allTimeBudget} onValueChange={allTimeBudgetChange} color="primary">All-Time</Checkbox>
                            <div className="max-h-[85%] flex-col content-center">
                                <div className={`self-center justify-self-center ${allTimeBudget ? "text-gray-500" : "text-white"}`}>Budget Month</div>
                                <input
                                    disabled={allTimeBudget}
                                    name="startMonth"
                                    type="month"
                                    className="h-[40%] rounded-md p-2 self-center"
                                />
                            </div>
                            <Button size="sm" className="self-center text-gray-900 font-medium" color="primary">Save</Button>
                        </div>
                    </div>
                </div>
                <div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md" id="budgetIncome">
                    <div className="w-40 h-10 bg-[var(--mainGray)] rounded-br-md relative flex">
                        <div className="w-2 h-2 bg-[var(--mainGray)] budgetTitleSection absolute right-0 translate-x-[100%]"></div>
                        <span className="text-white font-semibold text-2xl self-center self w-full text-center">Income</span>
                        <div className="w-2 h-2 budgetTitleSection bg-[var(--mainGray)] absolute bottom-0 translate-y-[100%]"></div>
                    </div>
                </div>
                <div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md" id="budgetExpenses">
                </div>
                <div className="row-span-3 h-full w-full bg-[var(--mainWhite)] rounded-md" id="budgetNetCashFlow"></div>
            </div>
        </>
    );
}

export default BudgetBuilder;