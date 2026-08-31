import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'jotai';
import { useSembrarDatos } from '@/lib/seed';
import { AppLayout } from '@/components/AppLayout';
import CitasPage from '@/pages/Citas/index';
import CasetaPage from '@/pages/Caseta/index';
import AlmacenPage from '@/pages/Almacen/index';
import HomePage from '@/pages/Home/index';
import ProveedoresPage from '@/pages/Proveedores/index';


function AppInner() {
  useSembrarDatos();

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/citas" element={<CitasPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/caseta" element={<CasetaPage />} />
        <Route path="/almacen" element={<AlmacenPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Provider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </Provider>
  );
}
