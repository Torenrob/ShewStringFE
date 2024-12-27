import React, {useState} from "react";
import CalendarCtrl from "../CalendarCtrl/CalendarCtrl";
import UserPanel from "../UserPanel/UserPanel";
import {useLoaderData, useNavigate} from "react-router-dom";
import "./MainPage.css";
import {SelectedNavItem} from "./MainPageExports";

export default function MainPage() {
	const navigate = useNavigate();
	const [selectedNavItem , setSelectedNavItem] = useState<SelectedNavItem | string >(SelectedNavItem.Calendar);

	if (!useLoaderData()) {
		navigate("/");
	}

	return (
		<div className="box-border mainPage">
				<UserPanel updateNavItem={setSelectedNavItem}/>
				<div className="pl-[0.375rem] pb-[0.375rem] pt-[0.55rem] pr-[0.375rem] max-w-[85.5%] min-w-[85.5%] w-[85.5%] max-h-full">
					<div className="rightPanelCal rounded-lg max-w-full min-h-full">
						{(selectedNavItem === 0 || selectedNavItem === "0") && <CalendarCtrl />}
						{(selectedNavItem === 1 || selectedNavItem === "1") && <span>Big Poppa</span>}
					</div>
				</div>
		</div>
	);
}
