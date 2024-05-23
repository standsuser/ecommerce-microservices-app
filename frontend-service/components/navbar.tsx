import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import router from "next/router.js";
import { getVer, getUser, setUser } from "@/auth";
import { handleLogout } from "@/auth/handleLogout";
import { title } from "./primitives.js";

export default function Nbar() {

  const isAuthenticated = getVer();

  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        {isAuthenticated && (
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button variant="bordered" className="mr-12">Menu</Button>
            </DropdownTrigger>
            <DropdownMenu variant="faded" aria-label="Static Actions">
              <DropdownItem key="change-password">Change Password</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        <AcmeLogo />
        <p className="font-bold text-inherit">ECOMMERCE</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">Homepage</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="productsPage" aria-current="page">Products</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">Integrations</Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/profile/profile">Profile</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="cart/cartPage" variant="flat">
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