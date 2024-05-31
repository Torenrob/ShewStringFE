import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import SignUp from "../Components/SignUp";
import { signUpLoader } from "./Loaders";
import Calendar from "../Components/Calendar/Calendar";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/sign-up",
		element: <SignUp />,
	},
	{
		path: "/register",
		action: signUpLoader,
		element: <App />,
	},
	// {
	// 	path:'/calendar',
	// 	element:
	// }
]);

export default router;
