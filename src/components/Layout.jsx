import React, { useState } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="mobile sidebar"
      >
        <div className="relative flex w-64 flex-col bg-gray-800 text-white">
          <div className="flex items-center justify-between px-4 py-4">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Close sidebar"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Clients
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Employees
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Products
            </a>
          </nav>
        </div>
        <div
          className="flex-1"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex w-64 flex-col bg-gray-800 text-white">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <h1 className="text-2xl font-bold text-white">Logo</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Clients
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Employees
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
            >
              Products
            </a>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow md:hidden">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
            aria-label="Open sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Page Title</h2>
          <div className="w-6" />
        </header>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}