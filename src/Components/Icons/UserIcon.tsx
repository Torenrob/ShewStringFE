import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React, { Key, useContext } from "react";
import "./UserIcon.css";
import { UserContext } from "../../Services/Auth/UserAuth";

export default function UserIcon() {
	const { logout } = useContext(UserContext);

	function handleUserDrop(e: Key) {
		if (e == "logout") {
			logout();
		}
	}

	return (
		<Dropdown placement="bottom-start" showArrow triggerScaleOnOpen={false} className="bg-[#0a0a0a] border-[#45596b] border-1 shadow-lg shadow-[#0a0a0a7e] rounded-none">
			<DropdownTrigger>
				<svg viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5ZM7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM7.45609 16.7264C6.40184 17.1946 6 17.7858 6 18.5C6 18.7236 6.03976 18.8502 6.09728 18.942C6.15483 19.0338 6.29214 19.1893 6.66219 19.3567C7.45312 19.7145 9.01609 20 12 20C14.9839 20 16.5469 19.7145 17.3378 19.3567C17.7079 19.1893 17.8452 19.0338 17.9027 18.942C17.9602 18.8502 18 18.7236 18 18.5C18 17.7858 17.5982 17.1946 16.5439 16.7264C15.4614 16.2458 13.8722 16 12 16C10.1278 16 8.53857 16.2458 7.45609 16.7264ZM6.64442 14.8986C8.09544 14.2542 10.0062 14 12 14C13.9938 14 15.9046 14.2542 17.3556 14.8986C18.8348 15.5554 20 16.7142 20 18.5C20 18.9667 19.9148 19.4978 19.5973 20.0043C19.2798 20.5106 18.7921 20.8939 18.1622 21.1789C16.9531 21.7259 15.0161 22 12 22C8.98391 22 7.04688 21.7259 5.83781 21.1789C5.20786 20.8939 4.72017 20.5106 4.40272 20.0043C4.08524 19.4978 4 18.9667 4 18.5C4 16.7142 5.16516 15.5554 6.64442 14.8986Z"
						fill="#ffffff"></path>
				</svg>
			</DropdownTrigger>
			<DropdownMenu className="dark bg-[#0a0a0a] text-[#6EC4A7]" color="primary" onAction={handleUserDrop}>
				<DropdownItem className="rounded-none" key="settings">
					Settings
				</DropdownItem>
				<DropdownItem className="rounded-none" key="logout">
					Log Out
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
