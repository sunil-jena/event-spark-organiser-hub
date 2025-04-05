
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import EventDetails from "./pages/EventDetails";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateEvent from "./pages/events/CreateEvent";
import TicketTypes from "./pages/tickets/TicketTypes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/categories" element={<Events />} />
            <Route path="/events/categories/:category" element={<Events />} />
            <Route path="/events/venues" element={<Events />} />
            <Route path="/tickets/types" element={<TicketTypes />} />
            <Route path="/tickets/pricing" element={<TicketTypes />} />
            <Route path="/tickets/discounts" element={<TicketTypes />} />
            <Route path="/tickets/discounts/promo-codes" element={<TicketTypes />} />
            <Route path="/tickets/discounts/early-bird" element={<TicketTypes />} />
            <Route path="/tickets/discounts/group" element={<TicketTypes />} />
            <Route path="/payments/transactions" element={<Sales />} />
            <Route path="/payments/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/payouts" element={<Orders />} />
            <Route path="/support/help" element={<NotFound />} />
            <Route path="/support/contact" element={<NotFound />} />
            <Route path="/support/faqs" element={<NotFound />} />
            <Route path="/feedback" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
