import Link from "next/link";
import Button from "@/components/ui/button";

const NavButton = ({ href, label, isActive, onClick }) => {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        onClick={onClick}
        className={`text-white hover:bg-blue-700 hover:text-white transition-colors duration-200 ${
          isActive ? 'border border-white rounded-md' : ''
        }`}
      >
        {label}
      </Button>
    </Link>
  );
};

export default NavButton;