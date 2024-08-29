import "./app.css";
import { ReactNode } from "react";
import CalendarCtrl from "./Components/CalendarCtrl/CalendarCtrl";
import UserPanel from "./Components/UserPanel/UserPanel";
import LandingPage from "./Components/LandingPage/LandingPage";
import { Outlet } from "react-router-dom";
import { UserProvider } from "./Services/Auth/UserAuth";

function App(): ReactNode {
	return (
		<UserProvider>
			<Outlet />
		</UserProvider>
	);
}

export default App;
