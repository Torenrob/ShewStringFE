import "./LandingPage.css";
import React, { useEffect, useState } from "react";
import CalendarIcon from "../Icons/CalendarIcon/CalendarIcon.tsx";
import { Button } from "@nextui-org/react";
import Login from "../LoginPage/Login";
import SignUp from "../SignUp/SignUp";
import { div } from "framer-motion/client";

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
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16" style={{ marginLeft: "8px" }}>
									<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
								</svg>
								<span style={{ marginLeft: "8px" }}>Torenrob</span>
							</a>
							<a href="mailto:info@shewstring.com" className="hover:text-[var(--greenLogo)]" target="_blank" rel="noopener noreferrer">
								info@shewstring.com
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
