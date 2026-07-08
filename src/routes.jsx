import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Header from './components/header';
import Welcome from './pages/Welcome/welcome';
import Home from './pages/Home/home';
import Vehicle from './pages/Vehicle/vehicle';
import Leasing from './pages/Leasing/leasing';
import Compare from './pages/Compare/compare';

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/welcome" replace />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/vehicle/:id" element={<Vehicle />} />
        <Route path="/leasing" element={<Leasing />} />
        <Route path="/compare" element={<Compare />} />
      </Route>
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
