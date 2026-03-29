import React from "react";
import Header from "../../shared-mfe/src/components/Header";
import Footer from "../../shared-mfe/src/components/Footer";
import "../../shared-mfe/src/styles/global.css";
import CartPage from "./components/cartPage/cartPage";

export default function Root() {
  return (
    <>
      <Header />
      <CartPage />
      <Footer />
    </>
  );
}
