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
			<CalendarCtrl />
		</div>
	);
}
