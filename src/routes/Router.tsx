import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SignUp from "../components/signUp";
import { signUpLoader } from "./loaders";
import Calendar from "../components/calendar/calendar";

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
