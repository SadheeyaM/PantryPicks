import React from "react";
import Header from "../../shared-mfe/src/components/Header";
import Footer from "../../shared-mfe/src/components/Footer";
import "../../shared-mfe/src/styles/global.css";
import { CartScreen } from "./screens/CartScreen";

export default function Root() {
  return (
    <>
      <Header />
      <CartScreen />
      <Footer />
    </>
  );
}
