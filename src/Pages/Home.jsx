import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../PageWrapper";

function Home() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="bg-linear-to-b from-blue-50 to-white text-gray-800 scroll-smooth">

        {/* NAVBAR */}
        <header className="flex justify-between items-center px-10 py-5 shadow bg-white sticky top-0 z-50">
          <h1 className="text-2xl font-bold text-indigo-600">
            AI Finance Advisor
          </h1>

          <nav className="space-x-8 font-medium hidden md:block">
            <a href="#home" className="hover:text-indigo-600">Home</a>
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#how" className="hover:text-indigo-600">How It Works</a>
            <a href="#contact" className="hover:text-indigo-600">Contact</a>
          </nav>

          <button
            onClick={() => navigate("/login")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login / Register
          </button>
        </header>

        {/* HERO */}
        <section
          id="home"
          className="grid md:grid-cols-2 gap-10 px-10 py-20 items-center"
        >
          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Track. Analyze.

              <span className="text-green-600">Grow.</span>
            </h2>

            <p className="mt-6 text-lg text-gray-600">
              Track income & expenses, generate financial health score,
              and receive AI-powered smart budget recommendations.
            </p>

            <div className="mt-8 space-x-4">
              <button
                onClick={() => navigate("/register")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Get Started
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                View Dashboard
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <div className="h-64 bg-linear-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
              Dashboard Preview
            </div>
          </div>
        </section>

        {/* ✅ FEATURES SECTION (Now Inside Home.jsx) */}
        <section id="features" className="px-10 py-20 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12">
            Smart Financial Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
 
            <div className="p-8 bg-gray-100 rounded-2xl shadow hover:shadow-xl transition">
              <div className="w-14 h-14 bg-green-300 rounded-full mb-5"></div>
              <h3 className="font-semibold text-lg">Income & Expense Tracking</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Easily add, categorize, and monitor your financial transactions.
              </p>
            </div>

            <div className="p-8 bg-gray-100 rounded-2xl shadow hover:shadow-xl transition">
              <div className="w-14 h-14 bg-blue-300 rounded-full mb-5"></div>
              <h3 className="font-semibold text-lg">Financial Health Score</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Analyze your savings ratio and understand your financial stability.
              </p>
            </div>

            <div className="p-8 bg-gray-100 rounded-2xl shadow hover:shadow-xl transition">
              <div className="w-14 h-14 bg-purple-300 rounded-full mb-5"></div>
              <h3 className="font-semibold text-lg">Smart Budget Suggestions</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Get AI-powered suggestions to improve your saving habits.
              </p>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="px-10 py-20 bg-blue-50">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 text-center gap-8">
            {[
              "Register",
              "Add Income & Expense",
              "AI Analysis",
              "Get Suggestions",
            ].map((step, i) => (
              <div key={i} className="p-8 bg-white shadow rounded-2xl">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-green-100 text-green-600 font-bold rounded-full">
                  {i + 1}
                </div>
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          id="contact"
          className="text-center py-10 text-sm bg-white border-t"
        >
          <p>123, ABC Road, Theni, India</p>
          <p className="mt-2">jeyaram5408@gmail.com</p>
          <p className="mt-4">© 2026 AI Finance Advisor</p>
        </footer>

      </div>
    </PageWrapper>
  );
}

export default Home;
