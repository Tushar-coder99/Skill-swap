import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen relative font-sans text-gray-100">
      <div className="background-gradient" />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
