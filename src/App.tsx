
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./page/Index"
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import DashboardPage from "./page/dashboard/DashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
 <BrowserRouter>
  <Routes>
<Route path="/" element={<Index />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
  
 </BrowserRouter>
   

  </QueryClientProvider>
);

export default App;
