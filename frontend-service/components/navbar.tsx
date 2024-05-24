import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownMenu,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import { getVer, getUser, setUser } from "@/auth";
import { handleLogout } from "@/auth/handleLogout";
import { title } from "./primitives.js";
import { useRouter } from "next/router";

export default function Nbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(getVer());
  }, [router.pathname]);

  const linkStyle = (isActive: boolean) => ({
    color: isActive ? "purple" : "inherit",
  });

  const handleChangePassword = () => {
    router.push('/changePassword');
  };

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        {isAuthenticated && (
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button variant="bordered" className="mr-12">
                Menu
              </Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Static Actions">
              <DropdownItem key="change-password">Change Password</DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={handleLogout}
              >
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        <AcmeLogo />
        <p className="font-bold text-inherit">ECOMMERCE</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={router.pathname === "/"}>
          <Link
            href="/"
            style={linkStyle(router.pathname === "/")}
            aria-current={router.pathname === "/" ? "page" : undefined}
          >
            Homepage
          </Link>
        </NavbarItem>
        <NavbarItem isActive={router.pathname === "/products"}>
          <Link
            href="/products"
            style={linkStyle(router.pathname === "/products")}
            aria-current={router.pathname === "/products" ? "page" : undefined}
          >
            Products
          </Link>
        </NavbarItem>
        {isAuthenticated && (
          <NavbarItem isActive={router.pathname === "/profile"}>
            <Link
              href="/profile"
              style={linkStyle(router.pathname === "/profile")}
              aria-current={router.pathname === "/profile" ? "page" : undefined}
            >
              Profile
            </Link>
          </NavbarItem>
        )}
        {isAuthenticated && (
          <NavbarItem>
            <Button as={Link} color="primary" href="wishlist" variant="flat">
              Wishlist
            </Button>
          </NavbarItem>
        )}
                {isAuthenticated && (
          <NavbarItem>
            <Button as={Link} color="primary" href="favorites" variant="flat">
              Favorites
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="cart" variant="flat">
            Cart
          </Button>
        </NavbarItem>
        {!isAuthenticated && (
          <>
            <NavbarItem>
              <Button as={Link} color="primary" href="login" variant="flat">
                Login
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="register" variant="flat">
                Register
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
