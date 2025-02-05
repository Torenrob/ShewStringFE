import "./app.css";
import "./reset.css";
import { ReactNode } from "react";
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
