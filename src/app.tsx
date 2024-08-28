import "./app.css";
import { ReactNode } from "react";
import CalendarCtrl from "./Components/CalendarCtrl/CalendarCtrl";
import TransactionInputDrawer from "./Components/CalendarCtrl/TransactionInputDrawer";
import UserPanel from "./Components/UserPanel/UserPanel";

function App(): ReactNode {
	return (
		<div className="flex">
			<UserPanel />
			<CalendarCtrl />
		</div>
	);
}

export default App;
