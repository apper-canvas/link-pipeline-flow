import React from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  // App-level state and methods to pass via outlet context
  const outletContext = {
    // Add any app-level state or methods that need to be shared
    // with child components here
  };
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      {/* Main content with top padding for fixed header */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;