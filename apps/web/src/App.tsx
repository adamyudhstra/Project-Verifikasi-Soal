import { Routes, Route } from 'react-router';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuthHydration } from './hooks/useAuthHydration';
import { Login } from './features/auth/Login';
import { AppShell } from './layouts/AppShell';
import { Dashboard } from './features/dashboard/Dashboard';
import { Dosens } from './features/master/Dosens';
import { Semesters } from './features/master/Semesters';
import { Plos } from './features/master/Plos';
import { Clos } from './features/master/Clos';
import { Courses } from './features/master/Courses';
import { CourseDetail } from './features/master/CourseDetail';
import { KoordinatorList } from './features/assignments/KoordinatorList';
import { VerifikatorList } from './features/assignments/VerifikatorList';
import { SoalList } from './features/soals/SoalList';
import { SoalUpload } from './features/soals/SoalUpload';
import { SoalDetail } from './features/soals/SoalDetail';
import { VerifikasiList } from './features/soals/VerifikasiList';
import { VerifikasiDetail } from './features/soals/VerifikasiDetail';
import { BeritaAcara } from './features/soals/BeritaAcara';

function App() {
  useAuthHydration();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="master/dosens" element={<Dosens />} />
          <Route path="master/courses" element={<Courses />} />
          <Route path="master/courses/:id" element={<CourseDetail />} />
          <Route path="master/semesters" element={<Semesters />} />
          <Route path="master/plos" element={<Plos />} />
          <Route path="master/clos" element={<Clos />} />
          <Route path="assignments/koordinator" element={<KoordinatorList />} />
          <Route path="assignments/verifikator" element={<VerifikatorList />} />
          
          <Route path="koordinator/soals" element={<SoalList />} />
          <Route path="koordinator/soals/upload" element={<SoalUpload />} />
          <Route path="koordinator/soals/:id" element={<SoalDetail />} />
          
          <Route path="verifikator/antrean" element={<VerifikasiList />} />
          <Route path="verifikator/antrean/:id" element={<VerifikasiDetail />} />
          <Route path="verifikator/berita-acara" element={<BeritaAcara />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
