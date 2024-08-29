import { createBrowserRouter } from "react-router-dom";
import App from "../app";
import LandingPage from "../Components/LandingPage/LandingPage";
import UserPanel from "../Components/UserPanel/UserPanel";
import CalendarCtrl from "../Components/CalendarCtrl/CalendarCtrl";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			// { path: "", element: <LandingPage /> },
			{
				path: "",
				element: (
					<div className="flex">
						<UserPanel />
						<CalendarCtrl />
					</div>
				),
			},
		],
	},
]);

export default router;
