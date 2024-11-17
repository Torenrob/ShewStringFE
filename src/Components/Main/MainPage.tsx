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
			<div className="pl-[0.375rem] pb-[0.375rem] pt-[0.55rem] pr-[0.375rem]">
				<div className="rightPanelCal rounded-lg">
					<CalendarCtrl />
				</div>
			</div>
		</div>
	);
}
