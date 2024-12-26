import React, {useRef, useState} from "react";
import CalendarCtrl from "../CalendarCtrl/CalendarCtrl";
import UserPanel from "../UserPanel/UserPanel";
import { useLoaderData, useNavigate } from "react-router-dom";
import "./MainPage.css";
import {NavContext, SelectedNavItem} from "./MainPageExports";

export default function MainPage() {
	const navigate = useNavigate();
	const SelectedNavItemRef = useRef(SelectedNavItem.Calendar);

	if (!useLoaderData()) {
		navigate("/");
	}

	return (
		<div className="box-border mainPage">
			<NavContext.Provider value={SelectedNavItemRef}>
				<UserPanel />
				<div className="pl-[0.375rem] pb-[0.375rem] pt-[0.55rem] pr-[0.375rem] max-w-[85.5%] min-w-[85.5%] w-[85.5%] max-h-full">
					<div className="rightPanelCal rounded-lg max-w-full">
						{SelectedNavItemRef.current === 0 && <CalendarCtrl />}
						{SelectedNavItemRef.current === 1 && <span>Big Poppa</span>}
					</div>
				</div>
			</NavContext.Provider>
		</div>
	);
}
