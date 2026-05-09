import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';
import HowItWorks from './pages/HowItWorks';

const Layout = () => (
  <div className="flex flex-col min-h-screen text-on-surface">
    <Header />
    <main className="flex-grow flex flex-col">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/result",
        element: <Result />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/how-it-works",
        element: <HowItWorks />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
