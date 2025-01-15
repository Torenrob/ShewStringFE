import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import Cookies from "js-cookie";
import RootRouteWrapper from "./RootRouteWrapper";

function checkForUser(): boolean {
	return !!Cookies.get("token");
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [{ path: "", loader: checkForUser, element: <RootRouteWrapper /> }],
	},
]);

export default router;
