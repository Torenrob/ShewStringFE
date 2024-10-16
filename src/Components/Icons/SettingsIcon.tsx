import React, { useRef, useState, Key } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

export default function SettingsIcon({ openAcctModal, openDelAcctModal }: { openAcctModal: () => void; openDelAcctModal: () => void }) {
	const [hover, setHover] = useState<boolean>(false);
	useRef<SVGSVGElement>(null);
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
		<Dropdown closeOnSelect={true} showArrow triggerScaleOnOpen={false} className="bg-[#0a0a0a] text-[#6EC4A7] border-[#45596b] border-1 shadow-lg shadow-[#0a0a0a7e] rounded-none">
			<DropdownTrigger>
				<svg
					onMouseEnter={() => hoverSwitch()}
					onMouseLeave={() => hoverSwitch()}
					fill={hover ? "#6EC4A7" : "#ffffff"}
					className="acctOptIcon"
					width="13px"
					height="13px"
					viewBox="0 0 1920 1920"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M1703.534 960c0-41.788-3.84-84.48-11.633-127.172l210.184-182.174-199.454-340.856-265.186 88.433c-66.974-55.567-143.323-99.389-223.85-128.415L1158.932 0h-397.78L706.49 269.704c-81.43 29.138-156.423 72.282-223.962 128.414l-265.073-88.32L18 650.654l210.184 182.174C220.39 875.52 216.55 918.212 216.55 960s3.84 84.48 11.633 127.172L18 1269.346l199.454 340.856 265.186-88.433c66.974 55.567 143.322 99.389 223.85 128.415L761.152 1920h397.779l54.663-269.704c81.318-29.138 156.424-72.282 223.963-128.414l265.073 88.433 199.454-340.856-210.184-182.174c7.793-42.805 11.633-85.497 11.633-127.285m-743.492 395.294c-217.976 0-395.294-177.318-395.294-395.294 0-217.976 177.318-395.294 395.294-395.294 217.977 0 395.294 177.318 395.294 395.294 0 217.976-177.317 395.294-395.294 395.294"
						fillRule="evenodd"
					/>
				</svg>
			</DropdownTrigger>
			<DropdownMenu onAction={handleDropDown} color="primary">
				<DropdownItem className="rounded-none" key="addAccount">
					Add Account
				</DropdownItem>
				<DropdownItem className="rounded-none" key="deleteAccount">
					Delete Account
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
