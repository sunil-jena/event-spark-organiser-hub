import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppContextProvider } from './contexts/AppContext';
import { EventContextProvider } from './contexts/EventContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import CreateEvent from './pages/events/CreateEvent';
import EventDetails from './pages/EventDetails';
import Orders from './pages/Orders';
import Sales from './pages/Sales';
import Analytics from './pages/Analytics';
import Customers from './pages/Customers';
import Payouts from './pages/Payouts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import TicketTypes from './pages/tickets/TicketTypes';
import NotFound from './pages/NotFound';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Login from './modules/auth/component/Login';
import ForgotPassword from './modules/auth/component/ForgotPassword';
import ResetPassword from './modules/auth/component/ResetPassword';
// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <EventContextProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route path='/login' element={<Login />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password' element={<ResetPassword />} />

              {/* App routes */}
              <Route path='/' element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path='events' element={<Events />} />
                <Route path='events/create' element={<CreateEvent />} />
                <Route path='events/:id' element={<EventDetails />} />
                <Route path='tickets/types' element={<TicketTypes />} />
                <Route path='orders' element={<Orders />} />
                <Route path='sales' element={<Sales />} />
                <Route path='analytics' element={<Analytics />} />
                <Route path='customers' element={<Customers />} />
                <Route path='payouts' element={<Payouts />} />
                <Route path='reports' element={<Reports />} />
                <Route path='settings' element={<Settings />} />
                <Route path='profile' element={<Profile />} />
              </Route>

              {/* 404 route */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EventContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  );
}

export default App;
