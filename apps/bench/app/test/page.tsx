import Link from "next/link";
import CalculationClient from "./page.client";

export default function Page() {
return <main className="min-h-screen bg-neutral-200 flex flex-col items-center justify-center">
    <CalculationClient />
    <Link href="/" className="text-blue-600 hover:underline mt-4">Go Back Home</Link>
</main>
}