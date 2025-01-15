import React from "react";
import { Category } from "../../Types/APIDataTypes";

export default function BudgetBuilderLineItem({ i, bC, getCategoryMonthlyAvg }: { i: number; bC: Category; getCategoryMonthlyAvg: (x: Category) => string | number }) {
	return (
		<div className="mb-1 h-6 w-full flex categoryListTable">
			<div>{i + 1}</div>
			<div className="categoryTitle">{bC.title}</div>
			<div className="categoryLimit">{bC.amount}</div>
			<div>
				<input defaultValue={bC.color} type="color" name="categoryColor" className="w-6 h-6" />
			</div>
			<div className="categoryMonthlyAverage">{getCategoryMonthlyAvg(bC)}</div>
			<div className="categoryHealth text-green-600 font-bold">Good</div>
			<div className="deleteCategory">❌</div>
		</div>
	);
}
