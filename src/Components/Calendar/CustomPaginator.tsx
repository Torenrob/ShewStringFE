import { PaginationItemType, cn, usePagination } from "@nextui-org/react";
import React from "react";
import { ChevronIcon } from "./Icons/ChevronIcon";

export default function CustomPaginator({ total, currentPage, onChange }: { total: number; currentPage: number; onChange: (page: number) => void }) {
	const { activePage, range, setPage, onNext, onPrevious } = usePagination({
		total: total,
		showControls: true,
		loop: true,
		size: "sm",
		color: "secondary",
		initialPage: currentPage,
		onChange: (page) => {
			onChange(page);
		},
	});

	return (
		<div className="flex flex-col gap-2" style={{ position: "absolute", bottom: "7px", left: "-8px", transform: "scale(0.65)" }}>
			<ul className="flex gap-2 items-center">
				{range.map((page) => {
					if (page === PaginationItemType.NEXT) {
						return (
							<li key={page} aria-label="next page" className="w-4 h-4">
								<button className="w-full h-full bg-default-200 rounded-full" onClick={onNext}>
									<ChevronIcon className="rotate-180" />
								</button>
							</li>
						);
					}

					if (page === PaginationItemType.PREV) {
						return (
							<li key={page} aria-label="previous page" className="w-4 h-4">
								<button className="w-full h-full bg-default-200 rounded-full" onClick={onPrevious}>
									<ChevronIcon />
								</button>
							</li>
						);
					}

					if (page === PaginationItemType.DOTS) {
						return (
							<li key={page} className="w-4 h-4">
								...
							</li>
						);
					}

					return (
						<li key={page} aria-label={`page ${page}`} className="w-4 h-4">
							<button className={cn("w-full h-full bg-default-300 rounded-full", activePage === page && "bg-secondary")} onClick={() => setPage(page)} />
						</li>
					);
				})}
			</ul>
		</div>
	);
}
