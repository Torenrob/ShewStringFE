import { useLoaderData } from "react-router-dom";
import MainPage from "../Components/Main/MainPage";
import LandingPage from "../Components/LandingPage/LandingPage";
import Cookies from "js-cookie";

export default function RootRouteWrapper() {
	const isUserPresent = useLoaderData();

	return isUserPresent ? <MainPage /> : <LandingPage />;
}
