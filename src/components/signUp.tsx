import { ReactNode, useState } from "react";
import { Form } from "react-router-dom";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";

export default function SignUp(): ReactNode {
	const [createIsVisible, setCreateIsVisible] = useState(false);
	const [confirmIsVisible, setConfirmIsVisible] = useState(false);

	function toggleCreateVisibility(): void {
		setCreateIsVisible(createIsVisible ? false : true);
	}

	function toggleConfirmVisibility(): void {
		setConfirmIsVisible(confirmIsVisible ? false : true);
	}

	return (
		<Form className="signUpCard" id="sign-up" action="/register" method="post">
			<Card className="w-fit">
				<CardBody className="w-auto gap-y-2 grid">
					<span className="text-center text-xl">Join ENDS</span>
					<Input isRequired name="firstName" type="text" label="First Name" variant="bordered" placeholder="First Name" className="max-w-xs justify-self-center" />
					<Input isRequired name="lastName" type="text" label="Last Name" variant="bordered" placeholder="Last Name" className="max-w-xs justify-self-center" />
					<Input isRequired name="email" type="email" label="Email" variant="bordered" placeholder="your@email.com" className="max-w-xs justify-self-center" />
					<Input
						isRequired
						name="password"
						type={createIsVisible ? "text" : "password"}
						label="Create Password"
						variant="bordered"
						placeholder="Create password"
						className="max-w-xs justify-self-center"
						endContent={
							<button className="focus:outline-none" type="button" onClick={toggleCreateVisibility}>
								{createIsVisible ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" /> : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />}
							</button>
						}
					/>
					<Input
						isRequired
						type={confirmIsVisible ? "text" : "password"}
						label="Confirm Password"
						variant="bordered"
						placeholder="Confirm password"
						className="max-w-xs justify-self-center"
						endContent={
							<button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
								{confirmIsVisible ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" /> : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />}
							</button>
						}
					/>
					<Button form="sign-up" type="submit" color="primary" className="loginBtn justify-self-center">
						Login
					</Button>
					<Divider />
					<span className="text-sm text-center text-black/50">
						Already have an account?{" "}
						<a className="text-sky-600" href="/" rel="noopener noreferrer">
							Log In
						</a>
					</span>
				</CardBody>
			</Card>
		</Form>
	);
}
