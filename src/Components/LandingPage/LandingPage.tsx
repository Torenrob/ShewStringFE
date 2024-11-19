import React, {useEffect, useState} from "react";
import CalendarIcon from "../Icons/CalendarIcon";
import { Button } from "@nextui-org/react";
import Login from "../LoginPage/Login";
import SignUp from "../SignUp/SignUp";

export default function LandingPage() {
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);

	useEffect(() => {

	}, []);

	function loginShowSwitch() {
		setShowLogin((p) => !p);
	}

	function signUpShowSwitch() {
		setShowSignUp((p) => !p);
	}

	return (
		<div className="bg-[#0a0a0a] h-[100vh] w-[100vw] flex flex-col">
			<div className="flex landingPageBtns justify-end gap-2 pt-2 pr-2 xl:pt-4 xl:pr-4 xl:gap-4">
				<Button className="font-bold h-6 text-[0.65rem] xl:text-[1rem] xl:h-8" color="primary" size="sm" radius="none" onClick={loginShowSwitch}>
					Login
				</Button>
				<Button className="font-bold h-6 text-[0.65rem] xl:text-[1rem] xl:h-8" color="primary" size="sm" radius="none" onClick={signUpShowSwitch}>
					Create Account
				</Button>
			</div>
			<div className="landingPageTitle flex text-[2.75rem] md:text-[6.5rem] xl:text-[12rem]">
				<CalendarIcon size={91} landingPage={true}/>
				<div className="align-middle">ShewString</div>
				<div className="landingTagLine absolute whitespace-nowrap text-[0.65rem]  text-[#6EC4A7] bottom-[0.05rem] right-6 md:text-[1.5rem] md:bottom-2 md:right-14 xl:text-[2.5rem] xl:bottom-4 xl:right-28">
					Your Finances, Organized and On Time
				</div>
			</div>
			{showLogin && <Login toggleLogin={loginShowSwitch} toggleSignUp={signUpShowSwitch} />}
			{showSignUp && <SignUp toggleSignUp={signUpShowSwitch} toggleLogin={loginShowSwitch} />}
		</div>
	);
}
