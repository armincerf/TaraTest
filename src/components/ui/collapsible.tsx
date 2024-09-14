import React from "react";
import { Root, Trigger, Content } from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";

export const Collapsible = () => {
	const [open, setOpen] = React.useState(false);
	return (
		<Root className="w-[300px]" open={open} onOpenChange={setOpen}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<span
					className="text-violet11 text-[15px] leading-[25px]"
					style={{ color: "white" }}
				>
					@peduarte starred 3 repositories
				</span>
				<Trigger asChild>
					<button
						type="button"
						className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet3 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black"
					>
						{open ? <Cross2Icon /> : <RowSpacingIcon />}
					</button>
				</Trigger>
			</div>

			<div className="bg-white rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-blackA4">
				<span className="text-violet11 text-[15px] leading-[25px]">
					@radix-ui/primitives
				</span>
			</div>

			<Content>
				<div className="bg-white rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-blackA4">
					<span className="text-violet11 text-[15px] leading-[25px]">
						@radix-ui/colors
					</span>
				</div>
				<div className="bg-white rounded my-[10px] p-[10px] shadow-[0_2px_10px] shadow-blackA4">
					<span className="text-violet11 text-[15px] leading-[25px]">
						@radix-ui/themes
					</span>
				</div>
			</Content>
		</Root>
	);
};
