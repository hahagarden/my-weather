import Header from "@/widgets/header/ui/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      {children}
    </div>
  );
}