"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTableInner<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
	id: string;
	amount: number;
	status: "pending" | "processing" | "success" | "failed";
	email: string;
};

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "amount",
		header: "Amount",
	},
];

async function getData(): Promise<Payment[]> {
	// Fetch data from your API here.
	return [
		{
			id: "728ed52f",
			amount: 100,
			status: "pending",
			email: "m@example.com",
		},
		// ...
	];
}

export async function DataTable() {
	const data = await getData();

	return (
		<div className="container mx-auto py-10">
			<DataTableInner columns={columns} data={data} />
		</div>
	);
}
