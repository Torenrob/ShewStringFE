import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import SignUp from "../Components/SignUp/SignUp";
import { signUpLoader } from "./Loaders";

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
