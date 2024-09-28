import { UserButton } from "@clerk/nextjs";
import Logo from "./Logo";
import { NavItems } from "./NavItems";
import { BellIcon } from "lucide-react";

export default function Navigation() {
  return (
    <header className="bg-gray-100 p-2 md:px-4 flex-none  w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <Logo />
        <NavItems />
        <div className="flex items-center justify-between p-2 sm:gap-2 md:gap-4 xl:gap-6">
            <span className="text-gray-600">
				<BellIcon className="w-4 h-4" />
			</span>
		  <div className="w-10 h-10 flex items-center justify-center">
          <UserButton />
        </div>
        </div>
       
      </div>
    </header>
  );
}