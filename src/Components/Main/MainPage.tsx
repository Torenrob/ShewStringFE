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
			<div className="pb-[0.75rem] pt-[0.75rem] pr-[0.75rem] max-h-[100vh] min-h-[100vh] min-w-[85.5vw] max-w-[85.5vw]">
				<div className="rightPanelCal rounded-lg max-w-full min-w-full min-h-full max-h-full flex">
					{(selectedNavItem === 0 || selectedNavItem === "0") && <CalendarCtrl />}
					{(selectedNavItem === 1 || selectedNavItem === "1") && <BudgetBuilder />}
				</div>
			</div>
		</div>
	);
}
