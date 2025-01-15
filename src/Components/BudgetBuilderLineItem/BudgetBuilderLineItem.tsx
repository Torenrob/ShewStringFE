import "./BudgetBuilderLineItem.css";
import { Category } from "../../Types/APIDataTypes";

export default function BudgetBuilderLineItem({
	i,
	bC,
	getCategoryMonthlyAvg,
	deleteCategory,
}: {
	i: number;
	bC: Category;
	getCategoryMonthlyAvg: (x: Category) => string | number;
	deleteCategory: (categoryId: number) => void;
}) {
	return (
		<div className="mb-1 h-6 w-full flex categoryListTableContent text-white">
			<div>{i + 1}</div>
			<div className="categoryTitle">{bC.title}</div>
			<div className="categoryLimit">{bC.amount}</div>
			<div>
				<input defaultValue={bC.color} type="color" name="categoryColor" className="w-6 h-6" />
			</div>
			<div className="categoryMonthlyAverage">{getCategoryMonthlyAvg(bC)}</div>
			<div className="categoryHealth text-green-600 font-bold">Good</div>
			<div>
				<div onClick={(e) => deleteCategory(bC.id)} className="deleteCategory cursor-pointer rounded-lg">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						<path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
			</div>
			<div className="!w-[1px]"></div>
		</div>
	);
}
