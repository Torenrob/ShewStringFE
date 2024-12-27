import React, {useContext} from 'react';
import {Checkbox, Input, Select, SelectItem} from "@nextui-org/react";
import {UserContext} from "../../Services/Auth/UserAuth.tsx";
import SpanIcon from "../Icons/SpanIcon/SpanIcon.tsx";

function BudgetBuilder() {
    const {bankAccounts} = useContext(UserContext);

    const bankAcctsNoAddAcct = bankAccounts.filter(x => x.id !== 0);

    return (
        <>
            <div>

            </div>
            <div className="min-h-full min-w-full rounded-md grid grid-rows-11 gap-3.5">
                <div className="row-span-1 h-full w-full flex justify-between pl-12">
                    <span className="text-white self-center pl-2 text-4xl">Budget Setup</span>
                    <div className="w-[40%] flex justify-around gap-3.5 bg-[#333333] rounded-md">
                        <Select radius="sm" label="Account" name="account" size="sm"
                                className="self-center w-[40%] text-black">
                            {bankAcctsNoAddAcct.map((bA) => {
                                return <SelectItem value={bA.id} key={bA.id}>{bA.title}</SelectItem>;
                            })}
                        </Select>
                        <div className="w-[45%] flex gap-3.5 justify-center">
                            <Checkbox classNames={{label: "text-white"}} color="primary">All-Time</Checkbox>
                            <div className="max-h-[85%] flex-col content-center">
                                <div className="self-center justify-self-center text-white">Budget Month</div>
                                <input
                                    name="startMonth"
                                    type="month"
                                    className="h-[40%] rounded-md p-2 self-center"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md" id="budgetIncome">

                </div>
                <div className="row-span-4 h-full w-full bg-[var(--mainWhite)] rounded-md" id="budgetExpenses"></div>
                <div className="row-span-3 h-full w-full bg-[var(--mainWhite)] rounded-md" id="budgetNetCashFlow"></div>
            </div>
        </>
    );
}

export default BudgetBuilder;