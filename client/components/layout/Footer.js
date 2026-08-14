import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-white">AceTest</span>
            </div>
            <p className="text-sm">Modern exam management platform for schools and educators.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block hover:text-white">Home</Link>
              <Link href="/about" className="block hover:text-white">About</Link>
              <Link href="/pricing" className="block hover:text-white">Pricing</Link>
              <Link href="/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">For Schools</h3>
            <div className="space-y-2 text-sm">
              <Link href="/auth/register" className="block hover:text-white">Get Started</Link>
              <Link href="/pricing" className="block hover:text-white">Plans</Link>
              <Link href="/about" className="block hover:text-white">Features</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <p>support@acetest.com</p>
              <p>+234 800 123 4567</p>
              <p>Lagos, Nigeria</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          &copy; {new Date().getFullYear()} AceTest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
