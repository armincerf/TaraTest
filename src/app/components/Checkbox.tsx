interface CheckboxProps {
	checked: boolean;
}

export function Checkbox({ checked }: CheckboxProps) {
	return (
		<div aria-checked={checked}>
			{checked ? (
				<svg
					width="25"
					height="24"
					viewBox="0 0 25 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<title>Checked checkbox</title>
					<path
						d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
						fill="#EDE7FE"
						stroke="#292631"
						strokeWidth="2"
					/>
					<path
						d="M7 9L11.25 15L24 3"
						stroke="#290D71"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			) : (
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<title>Unchecked checkbox</title>
					<path
						d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
						fill="#EDE7FE"
						stroke="#292631"
						strokeWidth="2"
					/>
				</svg>
			)}
		</div>
	);
}
