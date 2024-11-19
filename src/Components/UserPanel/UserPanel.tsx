import React, { useContext } from "react";
import UserIcon from "../Icons/UserIcon";
import { Button } from "@nextui-org/react";
import { UserContext } from "../../Services/Auth/UserAuth";
import CalendarIcon from "../Icons/CalendarIcon.tsx";
import BudgetIcon from "../Icons/BudgetIcon.tsx";

export default function UserPanel() {
	const { user } = useContext(UserContext);

	return (
		<div className="text-white text-center pl-[0.375rem] pt-[0.65rem] pb-[0.65rem] flex-col h-full max-w-[14.5%] min-w-[14.5%] w-[14.5%]">
			<div className="pt-2 h-full rounded-lg">
				<div className="flex justify-center gap-1">
					<CalendarIcon size={91} landingPage={false} />
					<div className="align-middle text-[#45596b] text-3xl">ShewString</div>
				</div>
				<div className="flex justify-center pt-1 lg:pt-6 gap-2">
					<Button isIconOnly className="bg-transparent" size="sm">
						<UserIcon />
					</Button>
					<div className="flex items-center">{user?.username}</div>
				</div>
				<div className="hidden relative lg:block pt-6 text-xl">
					<div className="userPanelMenuSelector"></div>
					<div className="flex gap-6 justify-center">
						<CalendarIcon size={91} landingPage={false} userPanel={true}/>
						<span>Calendar</span>
					</div>
					<div className="flex gap-x-6 pt-6 justify-center">
						<BudgetIcon/>
						<span className="relative right-[2%]">Budget</span>
					</div>
				</div>
			</div>
		</div>
	);
}
