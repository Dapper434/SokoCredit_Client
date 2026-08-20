import { BrowserRouter } from "react-router-dom";
import LenderRoutes from "./routes/LenderRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <LenderRoutes />
    </BrowserRouter>
  );
}