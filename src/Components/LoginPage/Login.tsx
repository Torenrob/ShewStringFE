import { ReactNode, useState, MouseEvent, useContext } from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Input, Button } from "@nextui-org/react";
import * as Yup from "yup";
import { EyeSlashFilledIcon } from "../Icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../Icons/EyeFilledIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { UserContext } from "../../Services/Auth/UserAuth";
import InvalidSubmitIcon from "../Icons/InvalidSubmitIcon";

type LoginFormsInputs = {
	username: string;
	password: string;
};

const validation = Yup.object().shape({
	username: Yup.string().required("Username is Required"),
	password: Yup.string().required("Password is required"),
});

export default function Login({ toggleLogin, toggleSignUp }: { toggleLogin: () => void; toggleSignUp: () => void }): ReactNode {
	const [isVisible, setIsVisible] = useState(false);
	const { loginUser } = useContext(UserContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

	function handleLogin(form: LoginFormsInputs) {
		loginUser(form.username, form.password);
	}

	function loginTestAcct() {
		loginUser("Test", "Tester77!");
	}

	function toggleVisibility() {
		setIsVisible(isVisible ? false : true);
	}

	function closeLogin() {
		toggleLogin();
	}

	function clickSignUp() {
		toggleLogin();
		toggleSignUp();
	}

	return (
		<div id="loginBackground" className="absolute w-[100vw] h-[100vh] bg-[#0000009a]">
			<form className="loginCard" name="login" action="/log-in" method="POST" onSubmit={handleSubmit(handleLogin)}>
				<Card className="w-fit p-2">
					<CardBody className="w-auto gap-y-2 grid overflow-hidden">
						<Button isIconOnly className="bg-transparent absolute -right-2 -top-2" size="sm" onClick={closeLogin}>
							<InvalidSubmitIcon white={false} />
						</Button>
						<span className="text-center text-xl text-[#0a0a0a]">Login to Your Account</span>
						<Input isRequired type="text" label="Username" variant="bordered" placeholder="Username" className="max-w-xs justify-self-center" {...register("username")} />
						<Input
							isRequired
							type={isVisible ? "text" : "password"}
							label="Password"
							variant="bordered"
							placeholder="Enter Password"
							className="max-w-xs justify-self-center"
							{...register("password")}
							endContent={
								<button className="focus:outline-none" type="button" onClick={toggleVisibility}>
									{isVisible ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" /> : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />}
								</button>
							}
						/>
						<span className="text-sm text-center text-[#0a0a0a]">
							<a>Forgot Password/Username</a>
						</span>
						<Button color="primary" type="submit" className="loginBtn justify-self-center font-bold">
							Login
						</Button>
						<Divider />
						<span className="text-sm text-center text-[#0a0a0a]">
							Dont have an account?{" "}
							<a className="text-[#67b49a] font-bold cursor-pointer" onClick={clickSignUp}>
								Sign Up
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
			</form>
		</div>
	);
}
