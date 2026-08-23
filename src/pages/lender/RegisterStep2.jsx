import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STAFF_RANGES = ["1-5", "6-15", "16-30", "31-60", "60+"];
const MARKET_OPTIONS = ["Toi Market", "Muthurwa", "Gikomba", "Kangemi", "Wakulima", "Other"];

export default function RegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();

  const step1Data = location.state?.step1 || {};

  const [form, setForm] = useState({
    county_business_permit: "",
    odpc_registration_number: "",
    director_full_name: "",
    director_national_id: "",
    official_work_email: "",
    estimated_staff: "",
    markets_covered: [],
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMarket = (market) => {
    setForm((prev) => {
      const isSelected = prev.markets_covered.includes(market);
      return {
        ...prev,
        markets_covered: isSelected
          ? prev.markets_covered.filter((m) => m !== market)
          : [...prev.markets_covered, market],
      };
    });
  };

  const isValid =
    form.county_business_permit.trim() &&
    form.odpc_registration_number.trim() &&
    form.director_full_name.trim() &&
    form.director_national_id.trim() &&
    form.official_work_email.trim() &&
    form.estimated_staff.trim() &&
    form.markets_covered.length > 0;

  const handleContinue = (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    // Combine step1 and step2 data to pass to step 3
    const combinedData = { ...step1Data, ...form };
    navigate("/lender/register/settlement", { state: { combinedData } });
  };

