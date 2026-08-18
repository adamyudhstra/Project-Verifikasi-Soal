import { NavLink } from 'react-router';
import { LayoutDashboard, Users, BookOpen, Calendar, BookCheck, ClipboardList, ShieldCheck, CheckSquare, FileText } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import clsx from 'clsx';

export const Sidebar = () => {
  const { user } = useAuthStore();
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
      isActive
        ? 'bg-blue-50 text-blue-700'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    );

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:flex md:flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Verifikasi Soal</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          <NavLink to="/" className={navLinkClass}>
            <LayoutDashboard className="mr-3 h-5 w-5 opacity-75" />
            Dashboard
          </NavLink>

          <div className="mt-6 mb-2 px-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Master Data</p>
          </div>
          <NavLink to="/master/dosens" className={navLinkClass}>
            <Users className="mr-3 h-5 w-5 opacity-75" />
            Dosens
          </NavLink>
          <NavLink to="/master/courses" className={navLinkClass}>
            <BookOpen className="mr-3 h-5 w-5 opacity-75" />
            Courses
          </NavLink>
          <NavLink to="/master/semesters" className={navLinkClass}>
            <Calendar className="mr-3 h-5 w-5 opacity-75" />
            Semesters
          </NavLink>
          <NavLink to="/master/plos" className={navLinkClass}>
            <BookCheck className="mr-3 h-5 w-5 opacity-75" />
            PLOs
          </NavLink>
          <NavLink to="/master/clos" className={navLinkClass}>
            <ClipboardList className="mr-3 h-5 w-5 opacity-75" />
            CLOs
          </NavLink>

          {user?.role === 'SUPER_ADMIN' && (
            <>
              <div className="mt-6 mb-2 px-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignments</p>
              </div>
              <NavLink to="/assignments/koordinator" className={navLinkClass}>
                <Users className="mr-3 h-5 w-5 opacity-75" />
                Koordinator
              </NavLink>
              <NavLink to="/assignments/verifikator" className={navLinkClass}>
                <ShieldCheck className="mr-3 h-5 w-5 opacity-75" />
                Verifikator
              </NavLink>
            </>
          )}

          {(user?.role === 'SUPER_ADMIN' || user?.role === 'KOORDINATOR') && (
            <>
              <div className="mt-6 mb-2 px-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Koordinator</p>
              </div>
              <NavLink to="/koordinator/soals" className={navLinkClass}>
                <BookOpen className="mr-3 h-5 w-5 opacity-75" />
                Manajemen Soal
              </NavLink>
            </>
          )}

          {(user?.role === 'SUPER_ADMIN' || user?.role === 'VERIFIKATOR') && (
            <>
              <div className="mt-6 mb-2 px-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verifikator</p>
              </div>
              <NavLink to="/verifikator/antrean" className={navLinkClass}>
                <CheckSquare className="mr-3 h-5 w-5 opacity-75" />
                Antrean Verifikasi
              </NavLink>
              <NavLink to="/verifikator/berita-acara" className={navLinkClass}>
                <FileText className="mr-3 h-5 w-5 opacity-75" />
                Berita Acara
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
