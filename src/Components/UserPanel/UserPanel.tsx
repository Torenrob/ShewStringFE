import React, { useContext } from "react";
import UserIcon from "../Icons/UserIcon";
import { Button } from "@nextui-org/react";
import { UserContext } from "../../Services/Auth/UserAuth";
import CalendarIcon from "../Icons/CalendarIcon.tsx";

export default function UserPanel() {
	const { user } = useContext(UserContext);

	return (
		<div className="text-white text-center pl-[0.375rem] pt-[0.65rem] pb-[0.65rem] flex-col h-full max-w-[17%] min-w-[17%] w-[17%]">
			<div className="pt-2 h-full rounded-lg">
				<div className="flex justify-center gap-1 ">
					<CalendarIcon size={91} landing={false} />
					<div className="align-middle text-[#45596b] text-3xl">ShewString</div>
				</div>
				<div className="flex justify-center pt-1 lg:pt-6 gap-2">
					<Button isIconOnly className="bg-transparent" size="sm">
						<UserIcon />
					</Button>
					<div className="flex items-center">{user?.username}</div>
				</div>
				<div className="relative top-[35%] hidden lg:block">

				</div>
			</div>
		</div>
	);
}
