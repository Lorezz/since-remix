import NavBar from './NavBar';
import Footer from './Footer';

export default function Layout({
  data,
  children,
}: {
  data: any;
  children: React.ReactElement;
}) {
  const user = data?.user;

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <NavBar user={user} />
      <div className="grow container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}
