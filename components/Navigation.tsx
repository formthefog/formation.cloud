import FormationLogo from "./icons/FormationLogo";
import { Button } from "./ui/button";
import RightCaret from "./icons/RightCaret";
import Hamburger from "./icons/Hamburger";

const Navigation = () => {
  return (
    <header className="w-full border-b border-black border-opacity-[0.05] bg-white shadow-sm">
      <div className="container border-l border-r mx-auto max-w-[1280px] px-6 py-4 flex items-center justify-between">
        <div className="flex-shrink-0">
          <FormationLogo />
        </div>

        <nav className="hidden md:flex flex-1 text-[13px] justify-evenly  leading-[1.5385] tracking-[0.05em] font-geistMono font-[600] items-center">
          <a
            href="#features"
            className="font-medium text-gray-600  hover:text-black uppercase"
          >
            Features
          </a>
          <a
            href="#why-formation"
            className="font-medium text-gray-600 hover:text-black uppercase"
          >
            Why Formation
          </a>
          <a
            href="#use-cases"
            className="font-medium text-gray-600 hover:text-black uppercase"
          >
            Use Cases
          </a>
          <a
            href="#ecosystem"
            className="font-medium text-gray-600 hover:text-black uppercase"
          >
            Ecosystem
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" className="">
            VIEW DOCS
            <RightCaret />
          </Button>
          <Hamburger className="md:hidden" />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
