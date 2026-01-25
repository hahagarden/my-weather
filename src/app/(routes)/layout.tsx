import Header from "@/widgets/header/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen relative">
      <Header />
      {children}
    </div>
  );
}