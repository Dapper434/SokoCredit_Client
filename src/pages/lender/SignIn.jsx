import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  // State to hold the user's input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  // Simple validation: Ensure neither field is left empty
  const isFormValid = email.trim() !== "" && password.trim() !== "";

  // Process the sign-in when the user submits the form
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    if (!isFormValid) return; // Block submission if invalid
    
    // In a real app we'd call an API here. For now, navigate to the next step
    navigate("/lender/mfa");
  };

  return (
    // Main full-height container with a light background
    <div className="min-h-screen bg-ground flex flex-col px-4 pt-6">
      
      {/* Container for the page content, allowing us to center it */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="w-full max-w-md">
          {/* We will add the Header, Form, and Links here shortly */}
        </div>
      </div>
      
    </div>
  );
}