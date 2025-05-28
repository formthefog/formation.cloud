import { AuthButton } from "../AuthButton";
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
          className="text-sm font-bold text-gray-400 tracking-wide hover:text-blue-600 transition-colors ml-4"
        >
          return to Home
        </Link>
        <Link
          href="/marketplace"
          className="text-sm font-bold text-gray-400 tracking-wide hover:text-blue-600 transition-colors ml-4"
        >
          return to Marketplace
        </Link>

        <AuthButton />
      </div>
    </header>
  );
}
