//header.tsx                                                                                        

import { WelcomeMsg } from "@/components/WelcomeMsg";

import { HeaderLogo } from "@/components/Header-logo";
import { Navigation } from "@/components/Navigation";
export const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-6 lg:px-14 pb-25  min-h-[100px]">
     <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
    <HeaderLogo />
    <Navigation />
  </div>
  <WelcomeMsg />
</div>

    </header>
  );
};
