
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./page/Index"


const queryClient = new QueryClient();

const App = () => (
  
   <Index />

);

export default App;
