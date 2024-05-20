import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.jsx";
import router from "next/router.js";
//import{getUser} from "@/auth/loginCred.js";
import{getVer , getUser, setUser} from "@/auth";
import { handleLogout } from "@/auth/handleLogout";
import { title } from "./primitives.js";


export default function Nbar() {

    if (getVer() == true){

        return (

			<Navbar shouldHideOnScroll>
      <NavbarBrand>
	  <Dropdown backdrop="blur">
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="mr-12" // Add margin to the right
            >
              Menu
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant="faded" aria-label="Static Actions">
            <DropdownItem key="change-password" /*onClick={handleChangePassword}*/>Change Password </DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleLogout}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        

        <AcmeLogo />
        <p className="font-bold text-inherit">ECOMMERCE</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="home">
            Homepage
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="productsPage" aria-current="page">
            Products
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
        );
    } else {
        return (
<Navbar shouldHideOnScroll>
      <NavbarBrand>
        

        <AcmeLogo />
         <p className="font-bold text-inherit">ECOMMERCE</p> 
       
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="home">
            Homepage
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="productsPage" aria-current="page">
            Products
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} color="primary" href="login" variant="flat">
            Login
          </Button>
          <Button as={Link}  color="primary" href="register" variant="flat">
            register
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar> 
	);
    }
}























