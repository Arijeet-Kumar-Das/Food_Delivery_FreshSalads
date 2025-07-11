import React from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import AddressList from "../components/AddressList";

const AddressPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar2 />
      <main className="py-12">
        <AddressList />
      </main>
      <Footer />
    </div>
  );
};

export default AddressPage;
