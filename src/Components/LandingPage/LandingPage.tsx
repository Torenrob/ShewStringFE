import "./LandingPage.css";
import React, { useEffect, useState } from "react";
import CalendarIcon from "../Icons/CalendarIcon/CalendarIcon.tsx";
import { Button } from "@nextui-org/react";
import Login from "../LoginPage/Login";
import SignUp from "../SignUp/SignUp";
import { div } from "framer-motion/client";
import GithubIcon from "../Icons/GithubIcon/GithubIcon.tsx";
import MailIcon from "../Icons/MailIcon/MailIcon.tsx";

export default function LandingPage() {
	const [showLogin, setShowLogin] = useState(false);
	const [showSignUp, setShowSignUp] = useState(false);
	const [showConstructionNote, setShowConstructionNote] = useState(true);

	useEffect(() => {}, []);

	function loginShowSwitch() {
		setShowLogin((p) => !p);
	}

	function signUpShowSwitch() {
		setShowSignUp((p) => !p);
	}

	function closeConstructionNote() {
		setShowConstructionNote(false);
	}

	return (
		<div className="bg-[#0a0a0a] h-[100vh] w-[100vw] flex flex-col">
			<div className="flex landingPageBtns justify-end gap-2 pt-2 pr-2 xl:pt-4 xl:pr-4 xl:gap-4">
				<Button className="font-bold rounded-md h-6 text-[0.65rem] xl:text-[1rem] xl:h-8" color="primary" size="sm" radius="none" onPress={loginShowSwitch}>
					Login
				</Button>
				<Button className="font-bold rounded-md h-6 text-[0.65rem] xl:text-[1rem] xl:h-8" color="primary" size="sm" radius="none" onPress={signUpShowSwitch}>
					Create Account
				</Button>
			</div>
			<div className="landingPageTitle flex text-[2.75rem] md:text-[6.5rem] xl:text-[12rem]">
				<CalendarIcon size={91} landingPage={true} />
				<div className="align-middle">ShewString</div>
				<div className="landingTagLine absolute whitespace-nowrap text-[0.65rem] text-[#6EC4A7] bottom-[0.5rem] right-6 md:text-[1.5rem] md:bottom-1 md:right-14 xl:text-[2.5rem] xl:-bottom-3 xl:right-28">
					Your Finances, Organized and On Time
				</div>
			</div>
			{showConstructionNote && (
				<div className="w-[100vw] absolute h-[100vh] bg-[#0000009a] font-bold">
					<div id="constructionNote" className="w-[25%] bg-white rounded-md p-3 flex-col">
						<p>
							ShewString is a work in progress—a budgeting tool designed to make managing finances simple and intuitive. I'm building this project from the ground up, and while it's still in
							development, I’d love your feedback, ideas, and even a helping hand if you're interested!
						</p>
						<br />
						<p>
							Whether you're here to test things out, offer suggestions, or just see where this journey leads, your input is invaluable. If you're a developer, designer, or just someone with insights
							to share, feel free to reach out! Who knows—this could even turn into something bigger. Thanks for stopping by, and enjoy exploring!
						</p>
						<br />
						<div className="flex justify-between">
							<a href="https://github.com/torenrob" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-[var(--greenLogo)]">
								<GithubIcon />
								<span style={{ marginLeft: "0.125rem" }}>Torenrob</span>
							</a>
							<a href="mailto:info@shewstring.com" className="flex items-center hover:text-[var(--greenLogo)]" target="_blank" rel="noopener noreferrer">
								<MailIcon />
								<span style={{ marginLeft: "0.125rem" }}>info@shewstring.com</span>
							</a>
						</div>
						<div className="flex justify-center mt-3">
							<Button className="w-3/4 text-medium font-bold" onPress={closeConstructionNote} color="primary">
								Close
							</Button>
						</div>
					</div>
				</div>
			)}
			{showLogin && <Login toggleLogin={loginShowSwitch} toggleSignUp={signUpShowSwitch} />}
			{showSignUp && <SignUp toggleSignUp={signUpShowSwitch} toggleLogin={loginShowSwitch} />}
		</div>
	);
}
