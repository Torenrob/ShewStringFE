import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import router from "./routes/Router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<NextUIProvider>
			<RouterProvider router={router} />
		</NextUIProvider>
	</React.StrictMode>
);

//Brings the current date into view on Calendar
window.onload = () => document.getElementById(`${new Date().toLocaleDateString()}`)?.scrollIntoView();

let monthLabels: Element[] = Array.from(document.getElementsByClassName("monthLabels"));

console.log(monthLabels);
