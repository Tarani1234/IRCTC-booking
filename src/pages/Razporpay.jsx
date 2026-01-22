import React from "react";

const Razorpay = () => {

  const handleDummyPayment = () => {

    const options = {
      key: "rzp_test_S6qEOBr6hck9V5",  
      amount: 50000,      
      currency: "INR",
      name: "Dummy Store",
      description: " Payment",
      order_id: "order_dummy_123456", 
      handler: (response) => {
        alert("Payment Simulated Successfully!");
        console.log(response);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button onClick={handleDummyPayment}>
      Dummy Pay
    </button>
  );
};

export default Razorpay;
