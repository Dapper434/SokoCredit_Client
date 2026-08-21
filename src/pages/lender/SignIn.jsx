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
      
      {/* Back navigation link positioned at the top left */}
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-ink-muted text-sm flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
        >
          ← Back to portals
        </button>
      </div>

      {/* Container for the page content, allowing us to center it */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-16">
        <div className="w-full max-w-md">
          {/* Header section with brand text and page title */}
          <p className="text-xs tracking-[0.2em] text-accent uppercase font-semibold mb-2">
            SokoCredit
          </p>
          <h1 className="text-3xl font-bold text-ink mb-1">Lender Portal</h1>
          <p className="text-ink-muted text-sm mb-8">Staff sign-in</p>

          {/* We will add the Form and Links here shortly */}
        </div>
      </div>
      
    </div>
  );
}