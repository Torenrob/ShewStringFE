import "./UserPanel.css"
import React, {MouseEventHandler, useContext} from "react";
import UserIcon from "../Icons/UserIcon";
import {Button, Divider} from "@nextui-org/react";
import { UserContext } from "../../Services/Auth/UserAuth";
import CalendarIcon from "../Icons/CalendarIcon.tsx";
import BudgetIcon from "../Icons/BudgetIcon.tsx";
import {useLinkClickHandler} from "react-router-dom";

export default function UserPanel() {
	const { user } = useContext(UserContext);

	function selectNavItem(e: React.MouseEvent) {
		e.preventDefault()
		const selectNavItem = e.currentTarget;
		document.getElementById("navItemSelected")?.removeAttribute("id")

		selectNavItem.id = "navItemSelected";
	}

	return (
		<div className="text-white text-center pl-[0.375rem] pt-[0.55rem] pb-[0.55rem] flex-col h-full max-w-[14.5%] min-w-[14.5%] w-[14.5%]">
			<div className="pt-6 h-full rounded-lg bg-[#1a1a1a]">
				<div className="flex justify-center gap-1.5">
					<CalendarIcon size={91} landingPage={false} />
					<div className="align-middle text-[#45596b] text-3xl">ShewString</div>
				</div>
				<div className="flex justify-center pt-1 lg:pt-6 gap-2">
					<Button isIconOnly className="bg-transparent" size="sm">
						<UserIcon />
					</Button>
					<div className="flex items-center">{user?.username}</div>
				</div>
				<hr className="userPanelDivider mb-4"/>
				<div className="hidden relative lg:block text-large pl-[5%] pr-[5%] cursor-pointer">
					<div className="flex gap-3 pt-2 pb-2 hover:bg-[#42586A] pl-7 rounded-md navItems" onClick={selectNavItem}>
						<CalendarIcon size={120} landingPage={false} userPanel={true}/>
						<span>Calendar</span>
					</div>
					<div className="flex gap-3.5 pt-2 pb-2 hover:bg-[#42586A] pl-7 rounded-md navItems" onClick={selectNavItem}>
						<BudgetIcon/>
						<span className="relative right-[2%]">Budget</span>
					</div>
				</div>
			</div>
		</div>
	);
}
