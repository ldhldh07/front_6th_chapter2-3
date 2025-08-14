import { Footer } from "@/widgets/footer/ui/footer";
import { Header } from "@/widgets/header/ui/header";

import type { PropsWithChildren } from "react";

export function RootLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
