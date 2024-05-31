import { ReactNode, useState } from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "./EyeSlashFilledIcon";
import { EyeFilledIcon } from "./EyeFilledIcon";

export default function Login(): ReactNode {
	const [isVisible, setIsVisible] = useState(false);

	function toggleVisibility() {
		setIsVisible(isVisible ? false : true);
	}

	return (
		<form className="loginCard" name="login" action="/log-in" method="POST">
			<Card className="w-fit">
				<CardBody className="w-auto gap-y-2 grid">
					<span className="text-center text-xl">Login to Your Account</span>
					<Input isRequired type="email" label="Email" variant="bordered" placeholder="your@email.com" className="max-w-xs justify-self-center" />
					<Input
						isRequired
						type={isVisible ? "text" : "password"}
						label="Password"
						variant="bordered"
						placeholder="Enter Password"
						className="max-w-xs justify-self-center"
						endContent={
							<button className="focus:outline-none" type="button" onClick={toggleVisibility}>
								{isVisible ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" /> : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />}
							</button>
						}
					/>
					<span className="text-sm text-center text-black/50">
						<a href="">Forgot Password/Username</a>
					</span>
					<Button color="primary" className="loginBtn justify-self-center">
						Login
					</Button>
					<Divider />
					<span className="text-sm text-center text-black/50">
						Dont have an account?{" "}
						<a className="text-sky-600" href="/sign-up" rel="noopener noreferrer">
							Sign Up
						</a>
					</span>
				</CardBody>
			</Card>
		</form>
	);
}
