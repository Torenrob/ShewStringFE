import "./UserPanel.css"
import React, {useContext} from "react";
import UserIcon from "../Icons/UserIcon/UserIcon.tsx";
import {Button, Select} from "@nextui-org/react";
import {UserContext} from "../../Services/Auth/UserAuth";
import CalendarIcon from "../Icons/CalendarIcon/CalendarIcon.tsx";
import BudgetIcon from "../Icons/BudgetIcon/BudgetIcon.tsx";
import {SelectedNavItem} from "../Main/MainPageExports.tsx";

export default function UserPanel({updateNavItem}:{ updateNavItem:  React.Dispatch<React.SetStateAction<SelectedNavItem | string>>}) {
	const { user } = useContext(UserContext);

	function changeNavItem(e: React.MouseEvent) {
		e.preventDefault()
		// @ts-expect-error - dataset.navItem is a property of currentTarget
		const selectNavItem: SelectedNavItem = e.currentTarget.dataset.navItem;

		updateNavItem(selectNavItem);

		document.getElementById("navItemSelected")?.removeAttribute("id")
		Array.from(document.getElementsByClassName("selNavItemRoundCorner"))[0].classList.remove("selNavItemRoundCorner");

		e.currentTarget.classList.add("selNavItemRoundCorner");
		e.currentTarget.id = "navItemSelected";
	}

	return (
		<div className="text-white text-center pl-[0.375rem] pt-[0.55rem] pb-[0.55rem] flex-col h-full max-w-[14.5%] min-w-[14.5%] w-[14.5%]">
			<div className="pt-6 h-full rounded-lg">
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
					<div className="flex gap-3 pt-2 pb-2 hover:bg-[#42586A] pl-7 rounded-md navItems selNavItemRoundCorner" data-nav-item={SelectedNavItem.Calendar} id="navItemSelected" onClick={changeNavItem}>
						<CalendarIcon size={120} landingPage={false} userPanel={true}/>
						<span>Calendar</span>
					</div>
					<div className="flex gap-3.5 pt-2 pb-2 hover:bg-[#42586A] pl-7 rounded-md navItems" data-nav-item={SelectedNavItem.Budget}  onClick={changeNavItem}>
						<BudgetIcon/>
						<span className="relative right-[2%]">Budget</span>
					</div>
				</div>
			</div>
		</div>
	);
}
