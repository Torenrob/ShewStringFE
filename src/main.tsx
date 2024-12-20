import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import router from "./Routes/Router.tsx";

document.addEventListener("DOMContentLoaded", () =>
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<NextUIProvider>
				<RouterProvider router={router} />
			</NextUIProvider>
		</React.StrictMode>
	)
);
