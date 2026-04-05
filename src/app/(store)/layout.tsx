import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export const dynamic = "force-dynamic";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
