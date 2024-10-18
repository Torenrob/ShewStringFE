import React, { useContext } from "react";
import UserIcon from "../Icons/UserIcon";
import { Button } from "@nextui-org/react";
import { UserContext } from "../../Services/Auth/UserAuth";

export default function UserPanel() {
	const { user } = useContext(UserContext);

	return (
		<div className="userPanel text-white text-center">
			<div className="flex justify-center pt-1 lg:pt-6 gap-2">
				<Button isIconOnly className="bg-transparent" size="sm">
					<UserIcon />
				</Button>
				<div className="flex items-center">{user?.username}</div>
			</div>

			<div className="relative top-[35%] hidden lg:block">

			</div>
		</div>
	);
}
