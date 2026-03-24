import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import BeginnerLevel from "./pages/BeginnerLevel";
import IntermediateLevel from "./pages/IntermediateLevel";
import AdvancedLevel from "./pages/AdvancedLevel";
import PracticalExamples from "./pages/PracticalExamples";
import SecurityChallenges from "./pages/SecurityChallenges";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/baslangic" element={<BeginnerLevel />} />
          <Route path="/orta" element={<IntermediateLevel />} />
          <Route path="/ileri" element={<AdvancedLevel />} />
          <Route path="/uygulamali" element={<PracticalExamples />} />
          <Route path="/senaryolar" element={<SecurityChallenges />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
