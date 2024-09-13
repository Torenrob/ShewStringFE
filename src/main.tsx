import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { NextUIProvider, ThemeColors } from "@nextui-org/react";
import "./index.css";
import router from "./Routes/Router.tsx";
import { UserProvider } from "./Services/Auth/UserAuth.tsx";

document.addEventListener("DOMContentLoaded", () =>
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<NextUIProvider>
				<RouterProvider router={router} />
			</NextUIProvider>
		</React.StrictMode>
	)
);
