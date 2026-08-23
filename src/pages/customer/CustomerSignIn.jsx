import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerSignIn() {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const navigate = useNavigate();
  const isFormValid = phone.trim() !== "" && pin.trim() !== "";

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    navigate("/customer/otp", { state: { phone } });
  };
