"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Updated menu data with new navigation links
const menuData = [
  { title: "Home", path: "/" },
  { title: "Articles", path: "/articles" },
  { title: "Events", path: "/events" },
  { title: "Gallery", path: "/gallery" },
  { title: "Portfolio", path: "/portfolio" },
  { title: "About Us", path: "/about" },
  { title: "Contact Us", path: "/contact" },
  { title: "Admin", path: "/admin" },
];

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar with logo transformation
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  const pathname = usePathname();

  return (
    <header
      className={`header left-0 top-0 z-40 flex w-full items-center bg-[#213555] ${
        sticky
          ? "fixed z-[9999] !bg-opacity-90 shadow-sticky backdrop-blur-sm transition"
          : "absolute"
      }`}
    >
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          {/* Logo Section - Left Side */}
          <div className="w-60 max-w-full px-4 xl:mr-12 ml-8">
            <Link
              href="/"
              className={`header-logo block w-full ${
                sticky ? "py-2" : "py-8"
              } flex items-center`}
            >
              <Image
                src="/images/logo/AI-Solutions.svg"
                alt="logo"
                width={40}
                height={40}
                className="mr-2"
              />
              {/* <span className={`font-bold text-[#F5EFE7] text-xl transition-all duration-300 ${
                sticky ? "hidden" : "block"}
              `}> */}
              
              <span className={`font-bold text-[#F5EFE7] text-xl transition-all duration-300`}>
                AI Solution
              </span>
              {/* <span className={`font-bold text-[#F5EFE7] text-xl transition-all duration-300 ${
                sticky ? "block" : "hidden"
              }`}>
                AI
              </span> */}
            </Link>
          </div>

          {/* Navigation Section - Right Side */}
          <div className="flex items-center justify-end">
            <div>
              {/* Mobile menu toggle button */}
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] text-[#F5EFE7] lg:hidden"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-[#F5EFE7] transition-all duration-300 ${
                    navbarOpen ? " top-[7px] rotate-45" : " "
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-[#F5EFE7] transition-all duration-300 ${
                    navbarOpen ? "opacity-0 " : " "
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-[#F5EFE7] transition-all duration-300 ${
                    navbarOpen ? " top-[-8px] -rotate-45" : " "
                  }`}
                />
              </button>

              {/* Navigation menu */}
              <nav
                id="navbarCollapse"
                className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-[#3E5879] bg-[#3E5879] px-6 py-4 duration-300 lg:relative lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                  navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                }`}
              >
                <ul className="block lg:flex lg:items-center lg:space-x-6">
                  {menuData.map((menuItem, index) => (
                    <li key={index} className="group relative">
                      <Link
                        href={menuItem.path}
                        className={`flex py-2 text-base text-[#F5EFE7] lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${
                          pathname === menuItem.path
                            ? "text-[#D8C4B6]"
                            : "hover:text-[#D8C4B6]"
                        }`}
                      >
                        {menuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;