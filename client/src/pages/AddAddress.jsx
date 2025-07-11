// routes/AddAddressRoute.js
import React from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import AddressForm from "../components/AddressForm";

const AddAddress = () => {
  const handleSuccess = () => {
    // Redirect to menu after adding first address
    window.location.href = "/menu";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar2 />
      <main className="py-12">
        <AddressForm onSuccess={handleSuccess} />
      </main>
      <Footer />
    </div>
  );
};

export default AddAddress;
