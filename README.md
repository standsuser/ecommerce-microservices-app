# E-commerce Platform

## Overview

This project is an e-commerce platform built with modern technologies for a robust and scalable solution. The frontend is developed using Next.js, and the backend uses NestJS. The architecture follows a microservice pattern with Kafka for inter-service communication and MongoDB as the database. Payment integration is handled by Paymob.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Login](#login)
  - [Register](#register)
  - [Home](#home)
  - [Profile](#profile)
  - [Cart](#cart)
  - [Product](#product)
- [Technologies Used](#technologies-used)
- [Payment Integration](#payment-integration)

## Features

### Login

1. **Access Login Page:**
   - Navigate to the app to see a "Login" option in the navigation menu.
   - Clicking "Login" directs to the login page with input fields for email/username and password.

2. **Login as Authenticated User:**
   - Enter valid credentials to be authenticated and redirected to the homepage.
   - Invalid credentials show an error message.

3. **Redirect to Register Page:**
   - Attempting to access a protected page while not logged in redirects to the login page with an option to register.
   - Clicking "Register" redirects to the registration page.

4. **Reset Password:**
   - A "Forgot Password?" link on the login page directs to a password reset page.
   - Submit email to receive a password reset link.

### Register

1. **Register Using Personal Information:**
   - Fields for First Name, Last Name, Email, Phone Number, Company (optional), and Address on the registration page.
   - After entering valid information and clicking "Register," a verification email is sent.

2. **Receive Verification Email:**
   - Verification email contains a link to confirm registration and activate the account.
   - Option to resend verification email if not received.

### Home

1. **As a Guest User:**
   - View Featured Listings: Displayed prominently with product image, name, price, and rating.
   - Explore Categories: Categories are clearly displayed; clicking a category shows relevant products.
   - View Top Offers: Section dedicated to current offers and discounts.

2. **As a Registered User:**
   - Do all the guest user features plus:
   - Sign In / Sign Up: Clear options available on the homepage.
   - Quick Access to Cart and Wishlist: Icons or links for cart and wishlist are visible.
   - Save Favorite Items: "Add to Favorites" button available on each product listing.

### Profile

1. **View Profile Information:**
   - Profile page displays name, email, shipping address, and contact information with an option to edit.

2. **View Order History:**
   - Section lists all previous orders with details such as order number, date, items purchased, total amount, and status.

3. **Manage Payment Methods:**
   - Options to add, remove, or edit payment methods.

4. **Update Password:**
   - Section to change password with verification steps for security.

5. **View Saved Addresses:**
   - Display saved addresses with options to add or delete.

6. **View and Manage Wishlist:**
   - Wishlist items displayed with options to add to cart or remove.

7. **View and Manage Reviews:**
   - Section lists submitted reviews with options to edit or delete.

### Cart

1. **As a Registered User:**
   - View Cart Items: Display list of products with images, names, prices, quantities, and total prices.
   - Update Quantity of Items: Input field or buttons to increase/decrease quantity.
   - Remove Items from Cart: "Remove" button for each item.
   - Apply Coupon Codes: Field to enter coupon codes.
   - Proceed to Checkout: "Checkout" button to proceed with the process.
   - Confirm and Place Order: "Place Order" button to complete the purchase.

2. **As a Guest User:**
   - Add Items to Cart: "Add to Cart" button on each product listing.
   - View and Edit Cart: Temporary cart created for the guest session.
   - Convert to Registered User: "Create Account" or "Sign Up" option to merge guest cart with a new account.

### Product

1. **View Product Details:**
   - Product page displays product name, description, images, price, availability, and specifications.

2. **Add to Cart:**
   - "Add to Cart" button to add the product to the cart with default options.

3. **Rent Product:**
   - "Rent" button with options for rental duration and pricing.

4. **Customize Product:**
   - Customization options such as size, color, and material with dynamic price adjustments.

5. **View and Add Reviews:**
   - Section to display existing reviews and add new ones.

6. **Save for Later:**
   - "Save for Later" or "Add to Wishlist" button to save the product for future reference.

7. **Share Product:**
   - Option to share the product with friends or on social media.

## Technologies Used

- **Frontend:** Next.js
- **Backend:** NestJS
- **Database:** MongoDB
- **Message Broker:** Kafka
- **Payment Integration:** Paymob

## Payment Integration

- **Paymob:**
  - Integrated for handling payments securely.
