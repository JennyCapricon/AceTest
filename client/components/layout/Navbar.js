import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/contact', label: 'Contact' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    switch (user.role) {
      case 'STUDENT': return '/student/dashboard';
      case 'TEACHER': return '/teacher/dashboard';
      case 'ADMIN': return '/admin/dashboard';
      default: return '/auth/login';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AceTest</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-primary-600 font-medium">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium">{user.firstName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <Link href={getDashboardLink()} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                    </Link>
                    <Link href="/auth/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4 mr-2" /> Profile
                    </Link>
                    <hr className="my-1" />
                    <button onClick={logout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost">Login</Link>
                <Link href="/auth/register" className="btn-primary">Register</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block py-2 text-gray-600 hover:text-primary-600 font-medium" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <hr />
            {user ? (
              <>
                <Link href={getDashboardLink()} className="block py-2 text-primary-600 font-medium">Dashboard</Link>
                <button onClick={() => { logout(); setOpen(false); }} className="block py-2 text-red-600 font-medium w-full text-left">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 text-gray-600 font-medium">Login</Link>
                <Link href="/auth/register" className="block py-2 text-primary-600 font-medium">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
