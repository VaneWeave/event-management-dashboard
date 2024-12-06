import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
	return (
		<div
			className={cn(
				"flex flex-col gap-5 items-center justify-center min-h-screen w-full text-3xl font-outfit"
			)}
		>
			<Link href="/auth/login">Login</Link>
			<Link href="/auth/register">Register</Link>
			<Link href="/auth/organizer/login">Organizer Login</Link>
			<Link href="/auth/organizer/register">Organizer Register</Link>
		</div>
	);
}
