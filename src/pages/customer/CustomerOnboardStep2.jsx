import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { marketOptions, turnoverRanges } from "../../data/mockCustomerData";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerOnboardStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const fullName = location.state?.fullName || "";

  const [businessName, setBusinessName] = useState("");
  const [market, setMarket] = useState("");
  const [stall, setStall] = useState("");
  const [turnover, setTurnover] = useState("");
  const [kinName, setKinName] = useState("");
  const [kinPhone, setKinPhone] = useState("");

  const isValid = businessName.trim() !== "" && market.trim() !== "";

  
