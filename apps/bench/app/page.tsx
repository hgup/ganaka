import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <Link href="/dashboard">
        Go to Dashboard
      </Link>
    </main>
  );
}
