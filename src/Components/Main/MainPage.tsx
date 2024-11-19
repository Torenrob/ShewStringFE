import React from "react";
import CalendarCtrl from "../CalendarCtrl/CalendarCtrl";
import UserPanel from "../UserPanel/UserPanel";
import { useLoaderData, useNavigate } from "react-router-dom";
import "./MainPage.css";

export default function MainPage() {
	const navigate = useNavigate();
	if (!useLoaderData()) {
		navigate("/");
	}

	return (
		<div className="box-border mainPage">
			<UserPanel />
			<div className="pl-[0.375rem] pb-[0.375rem] pt-[0.55rem] pr-[0.375rem] max-w-[85.5%] min-w-[85.5%] w-[85.5%]">
				<div className="rightPanelCal rounded-lg max-w-full">
					<CalendarCtrl />
				</div>
			</div>
		</div>
	);
}
