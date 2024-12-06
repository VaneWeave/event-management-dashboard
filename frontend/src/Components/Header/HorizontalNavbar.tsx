import { cn } from "@/lib/utils";
import Link from "next/link";

export default function HorizontalNavbar() {
	return (
		<nav
			className={cn(
				"h-[80px] fixed top-0 left-0 bg-black text-white flex gap-5 items-center justify-between px-40 w-full text-xl font-outfit"
			)}
		>
			<div className="font-montserrat font-bold text-3xl">
				<h1>fest.io</h1>
			</div>
			<div>
				<ul className="flex gap-5 items-center">
					<li>
						<Link href="/auth/login">Login</Link>
					</li>
					<li>
						<Link href="/auth/register">Register</Link>
					</li>
					<li>
						<Link href="/auth/organizer/login">
							Organizer Login
						</Link>
					</li>
					<li>
						<Link href="/auth/organizer/register">
							Organizer Register
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
}
