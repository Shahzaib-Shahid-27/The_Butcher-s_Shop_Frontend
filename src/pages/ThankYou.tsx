import React from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div >
      <div >
        <h1>Thank You!</h1>
        <p>Your order has been placed successfully.</p>
        <p>The shop owner will receive your order by email.</p>

        <button  onClick={() => navigate("/products")}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}