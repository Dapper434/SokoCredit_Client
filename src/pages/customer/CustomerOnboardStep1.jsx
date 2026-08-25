import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerAuthFrame from "../../components/layout/CustomerAuthFrame";

export default function CustomerOnboardStep1() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const isValid = fullName.trim() !== "" && idNumber.trim() !== "";
