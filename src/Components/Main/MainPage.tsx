import React, { useState } from "react";
import CalendarCtrl from "../CalendarCtrl/CalendarCtrl";
import UserPanel from "../UserPanel/UserPanel";
import { useLoaderData, useNavigate } from "react-router-dom";
import "./MainPage.css";
import { SelectedNavItem } from "./MainPageExports";
import BudgetBuilder from "../BudgetBuilder/BudgetBuilder.tsx";

export default function MainPage() {
	const navigate = useNavigate();
	const [selectedNavItem, setSelectedNavItem] = useState<SelectedNavItem | string>(SelectedNavItem.Calendar);

	return (
		<div className="box-border mainPage">
			<UserPanel updateNavItem={setSelectedNavItem} />
			<div className="pb-[0.375rem] pt-[0.55rem] pr-[0.375rem] max-w-[85.5%] min-w-[85.5%] w-[85.5%] max-h-full">
				<div className="rightPanelCal rounded-lg max-w-full min-h-full max-h-full flex">
					{(selectedNavItem === 0 || selectedNavItem === "0") && <CalendarCtrl />}
					{(selectedNavItem === 1 || selectedNavItem === "1") && <BudgetBuilder />}
				</div>
			</div>
		</div>
	);
}
