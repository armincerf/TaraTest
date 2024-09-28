import { PlusIcon } from "lucide-react";
import { SVGProps } from "react";

export default function AddFriends(props: SVGProps<SVGSVGElement>) {
    return (
        <div className="flex flex-row gap-2">
            <PlusIcon className="w-6 h-6 text-purple-800" />
            <svg width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <path d="M16 20.4238V18.4238C16 17.363 15.5786 16.3455 14.8284 15.5954C14.0783 14.8453 13.0609 14.4238 12 14.4238H6C4.93913 14.4238 3.92172 14.8453 3.17157 15.5954C2.42143 16.3455 2 17.363 2 18.4238V20.4238" fill="#7B51E8" />
                <path d="M9 10.4238C11.2091 10.4238 13 8.63297 13 6.42383C13 4.21469 11.2091 2.42383 9 2.42383C6.79086 2.42383 5 4.21469 5 6.42383C5 8.63297 6.79086 10.4238 9 10.4238Z" fill="#7B51E8" />
                <path d="M22 20.4237V18.4237C21.9993 17.5374 21.7044 16.6765 21.1614 15.976C20.6184 15.2756 19.8581 14.7753 19 14.5537" fill="#7B51E8" />
                <path d="M16 2.55371C16.8604 2.77401 17.623 3.27441 18.1676 3.97602C18.7122 4.67763 19.0078 5.54054 19.0078 6.42871C19.0078 7.31688 18.7122 8.17979 18.1676 8.8814C17.623 9.58301 16.8604 10.0834 16 10.3037" fill="#7B51E8" />
                <path d="M16 20.4238V18.4238C16 17.363 15.5786 16.3455 14.8284 15.5954C14.0783 14.8453 13.0609 14.4238 12 14.4238H6C4.93913 14.4238 3.92172 14.8453 3.17157 15.5954C2.42143 16.3455 2 17.363 2 18.4238V20.4238M22 20.4237V18.4237C21.9993 17.5374 21.7044 16.6765 21.1614 15.976C20.6184 15.2756 19.8581 14.7753 19 14.5537M16 2.55371C16.8604 2.77401 17.623 3.27441 18.1676 3.97602C18.7122 4.67763 19.0078 5.54054 19.0078 6.42871C19.0078 7.31688 18.7122 8.17979 18.1676 8.8814C17.623 9.58301 16.8604 10.0834 16 10.3037M13 6.42383C13 8.63297 11.2091 10.4238 9 10.4238C6.79086 10.4238 5 8.63297 5 6.42383C5 4.21469 6.79086 2.42383 9 2.42383C11.2091 2.42383 13 4.21469 13 6.42383Z" stroke="#292631" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
    );
}
