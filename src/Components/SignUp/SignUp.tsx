import { ReactNode, useState, ChangeEvent, useContext } from "react";
import { Form } from "react-router-dom";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import { EyeSlashFilledIcon } from "../Icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../Icons/EyeFilledIcon";
import * as Yup from "yup";
import { UserContext } from "../../Services/Auth/UserAuth";
// @ts-expect-error - useForm is importing correctly
import { useForm } from "../../../node_modules/react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon";
import { RegisterUserInfo } from "../../Types/APIDataTypes";

type SignUpFormsInputs = {
	firstname: string;
	lastname: string;
	email: string;
	username: string;
	password: string;
};

const validation = Yup.object().shape({
	email: Yup.string().required("Email is required"),
	firstname: Yup.string().required("First Name is required"),
	lastname: Yup.string().required("Last Name is required"),
	username: Yup.string().required("Username is required"),
	password: Yup.string().required("Password is required"),
});

export default function SignUp({ toggleSignUp, toggleLogin }: { toggleSignUp: () => void; toggleLogin: () => void }): ReactNode {
	const [createIsVisible, setCreateIsVisible] = useState(false);
	const [confirmIsVisible, setConfirmIsVisible] = useState(false);
	const [password, setPassword] = useState("");
	const { registerUser, loginUser } = useContext(UserContext);
	const {
		register,
		handleSubmit,
	} = useForm<SignUpFormsInputs>({ resolver: yupResolver(validation) });

	function handleSignUp(form: SignUpFormsInputs) {
		const registerUserInfo: RegisterUserInfo = {
			email: form.email,
			username: form.username,
			password: form.password,
			firstName: form.firstname,
			lastName: form.lastname,
		};
		registerUser(registerUserInfo);
	}

	function loginTestAcct() {
		loginUser("Test", "Tester77!");
	}

	const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	function toggleCreateVisibility(): void {
		setCreateIsVisible(!createIsVisible);
	}

	function toggleConfirmVisibility(): void {
		setConfirmIsVisible(!confirmIsVisible);
	}

	function closeSignUp() {
		toggleSignUp();
	}

	function clickLogin() {
		toggleSignUp();
		toggleLogin();
	}

	return (
		<div id="signUpBackground" className="w-[100vw] absolute h-[100vh] bg-[#0000009a]">
			<Form className="signUpCard" id="sign-up" method="post" onSubmit={handleSubmit(handleSignUp)}>
				<Card className="w-fit p-2">
					<CardBody className="w-auto gap-y-2 grid overflow-hidden">
						<Button isIconOnly className="bg-transparent absolute -right-2 -top-2" size="sm" onClick={closeSignUp}>
							<InvalidSubmitIcon white={false} />
						</Button>
						<span className="text-center text-xl">Join ShewString</span>
						<Input isRequired {...register("firstname")} type="text" label="First Name" variant="bordered" placeholder="First Name" size="sm" className="max-w-xs justify-self-center" />
						<Input isRequired {...register("lastname")} type="text" label="Last Name" variant="bordered" placeholder="Last Name" size="sm" className="max-w-xs justify-self-center" />
						<Input isRequired {...register("email")} name="email" type="email" label="Email" variant="bordered" placeholder="your@email.com" size="sm" className="max-w-xs justify-self-center" />
						<Input isRequired {...register("username")} name="username" type="text" label="Username" variant="bordered" placeholder="Username" size="sm" className="max-w-xs justify-self-center" />
						<Input
							isRequired
							{...register("password")}
							name="password"
							type={createIsVisible ? "text" : "password"}
							label="Create Password"
							onChange={(e) => handlePasswordChange(e)}
							variant="bordered"
							placeholder="Create password"
							className="max-w-xs justify-self-center"
							size="sm"
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
							validate={(s) => {
								if (s !== password) {
									return "Passwords must match";
								} else {
									return null;
								}
							}}
							size="sm"
							endContent={
								<button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
									{confirmIsVisible ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" /> : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />}
								</button>
							}
						/>
						<Button form="sign-up" type="submit" color="primary" className="loginBtn justify-self-center font-bold">
							Create Account
						</Button>
						<Divider />
						<span className="text-sm text-center text-[#0a0a0a]">
							Already have an account?{" "}
							<a className="text-[#67b49a] font-bold cursor-pointer" onClick={clickLogin}>
								Log In
							</a>
							<span className="block">
								Or Use a{" "}
								<a className="text-[#67b49a] font-bold cursor-pointer" onClick={loginTestAcct}>
									Test Account
								</a>
							</span>
						</span>
					</CardBody>
				</Card>
			</Form>
		</div>
	);
}
