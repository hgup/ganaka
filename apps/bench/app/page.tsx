import Link from "next/link";

export default function Page() {
return <main className="min-h-screen bg-neutral-200 flex flex-col items-center justify-center">
    Sairam. <Link href="/test" className="text-blue-600 hover:underline">Go to Test Page</Link>
</main>
}