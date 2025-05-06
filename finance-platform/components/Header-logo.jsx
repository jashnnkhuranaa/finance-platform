// components/Header-logo.jsx
import Link from "next/link";
import Image from "next/image";

const HeaderLogo = () => {
    return (
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src="./logo.svg" alt="logo" height={22} width={22} />
                <p className="font-semibold text-white text-2xl ml-2">Fineance</p>
            </div>
        </Link>
    );
}

export default HeaderLogo;