import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      Sairam.{" "}
      <Link href="/demo/test" className="text-blue-600 hover:underline">
        Go to Test Page
      </Link>
      <Link href="/demo/reserving" className="text-blue-600 hover:underline">
        Go to Reserving Page
      </Link>
      <Link href="/demo/workflow" className="text-blue-600 hover:underline">
        Go to Workflow Page
      </Link>
    </main>
  );
}
