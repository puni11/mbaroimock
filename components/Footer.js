// components/Footer.js
export default function Footer() {
    return (
      <footer className="bg-red-800 text-gray-100 py-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo or Brand Name */}
          <div className="mb-4 md:mb-0">
            <a href="#" className="text-lg font-bold text-white hover:text-gray-300">
              YourBrand
            </a>
          </div>
  
          {/* Navigation Links */}
          <div className="mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>
  
          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-gray-300"
              aria-label="Facebook"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M22 12a10 10 0 1 0-11.5 9.92v-7h-2v-3h2v-2c0-2.07 1.23-3.22 3.11-3.22.9 0 1.84.16 1.84.16v2h-1.03c-1.01 0-1.33.62-1.33 1.25v1.81h2.3l-.37 3h-1.93v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-gray-300"
              aria-label="Twitter"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.56a9.83 9.83 0 0 1-2.8.77 4.9 4.9 0 0 0 2.17-2.71 9.72 9.72 0 0 1-3.1 1.18 4.89 4.89 0 0 0-8.34 4.45A13.86 13.86 0 0 1 1.64 3.16 4.89 4.89 0 0 0 3.18 9.72 4.81 4.81 0 0 1 .96 9v.06a4.89 4.89 0 0 0 3.92 4.8 4.89 4.89 0 0 1-2.2.08 4.89 4.89 0 0 0 4.57 3.4A9.8 9.8 0 0 1 0 19.54a13.91 13.91 0 0 0 7.54 2.21c9.05 0 14-7.5 14-14v-.64A9.94 9.94 0 0 0 24 4.56z" />
              </svg>
            </a>
            <a
              href="#"
              className="hover:text-gray-300"
              aria-label="Instagram"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm6.5-2.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
              </svg>
            </a>
          </div>
        </div>
  
        <div className="mt-6 text-center text-sm text-gray-400">
          &copy; 2024 YourBrand. All rights reserved.
        </div>
      </footer>
    );
  }
  