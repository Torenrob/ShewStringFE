import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import LandingPage from "../Components/LandingPage/LandingPage";
import { checkForUser } from "../Utilities/UtilityFuncs";
import MainPage from "../Components/Main/MainPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ path: "", element: <LandingPage /> },
			{
				path: "/main",
				loader: checkForUser,
				element: <MainPage />,
			},
		],
	},
]);

export default router;
