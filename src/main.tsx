import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import router from "./Routes/Router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

document.addEventListener("DOMContentLoaded", () =>
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<NextUIProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</NextUIProvider>
		</React.StrictMode>
	)
);
