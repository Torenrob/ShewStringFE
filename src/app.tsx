import "./app.css";
import Calendar from "./Components/Calendar/Calendar";
import CalendarContainer from "./Components/Calendar/CalendarContainer";
import Login from "./Components/LoginPage";
import { ReactNode, useEffect, useState } from "react";
import { getAllTransactionsAPI } from "./Services/API/TransactionAPI";
import { TransactionAPIData } from "./Types/APIDataTypes";

function App(): ReactNode {
	return <CalendarContainer />;
}

export default App;
