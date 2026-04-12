import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-bg-base transition-colors duration-500">
            <Navbar />
            {/* Standardized clearance for fixed navbar (h-20/24) */}
            <main className="grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
