import FormationLogo from "../icons/FormationLogo";
import Link from "next/link";

export default function DocsNavigation() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 px-6 py-3 max-w-screen-2xl mx-auto">
        <Link href="/docs">
          <FormationLogo />
        </Link>
        <div className="flex-grow" />
        <Link
          href="/"
          className="text-lg font-bold text-gray-700 tracking-wide hover:text-blue-600 transition-colors ml-4"
        >
          Home
        </Link>
        <Link
          href="/marketplace"
          className="text-lg font-bold text-gray-700 tracking-wide hover:text-blue-600 transition-colors ml-4"
        >
          Marketplace
        </Link>
      </div>
    </header>
  );
}
