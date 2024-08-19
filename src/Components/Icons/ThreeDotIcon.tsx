import React, { LegacyRef, MutableRefObject, useRef, MouseEvent, useState, Key } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import AddAccountModal from "../CalendarCtrl/AddAccountModal";

export default function ThreeDotIcon({ openAcctModal, openDelAcctModal }: { openAcctModal: () => void; openDelAcctModal: () => void }) {
	const [hover, setHover] = useState<boolean>(false);
	const svgRef: LegacyRef<SVGSVGElement> = useRef<SVGSVGElement>(null);

	function hoverSwitch() {
		if (hover) {
			setHover(false);
		} else {
			setHover(true);
		}
	}

	function handleDropDown(e: Key) {
		if (e === "addAccount") {
			openAcctModal();
		} else {
			openDelAcctModal();
		}
	}

	return (
		<Dropdown closeOnSelect={true}>
			<DropdownTrigger>
				<svg
					ref={svgRef}
					onMouseEnter={(e) => hoverSwitch()}
					onMouseLeave={(e) => hoverSwitch()}
					width="17px"
					height="17px"
					viewBox="0 0 16 16"
					xmlns="http://www.w3.org/2000/svg"
					fill={hover ? "#ab59b3e7" : "#ffffff"}
					className="cursor-pointer">
					<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
				</svg>
			</DropdownTrigger>
			<DropdownMenu onAction={handleDropDown}>
				<DropdownItem key="addAccount">Add Account</DropdownItem>
				<DropdownItem key="deleteAccount">Delete Account</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
