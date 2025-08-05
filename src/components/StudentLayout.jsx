import StudentNav from './StudentNav';
import Footer from './Footer';

const StudentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <StudentNav />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default StudentLayout;