import { PaginationItemType, cn, usePagination } from "@nextui-org/react";

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
		<ul className="flex gap-1 paginator">
			{range.map((page) => {
				if (page === PaginationItemType.NEXT) {
					return <li key={page} onClick={onNext} aria-label="next page" className="w-1.5 h-1.5 nextTransactionPage"></li>;
				}

				if (page === PaginationItemType.PREV) {
					return <li key={page} onClick={onPrevious} aria-label="previous page" className="w-1.5 h-1.5 prevTransactionPage"></li>;
				}

				if (page === PaginationItemType.DOTS) {
					return (
						<li key={page} className="w-2 h-2">
							...
						</li>
					);
				}

				return (
					<li key={page} aria-label={`page ${page}`} className="w-2 h-2">
						<button className={cn("w-full h-full bg-default-300 rounded-full", activePage === page && "bg-secondary")} onClick={() => setPage(page)} />
					</li>
				);
			})}
		</ul>
	);
}
