"use client";
//import { NextAuthProvider } from "./util/providers";
import { usePathname } from "next/navigation";

type RL_Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function RootLayout(props: RL_Props) {
  const pathname = usePathname();
  const modal_ = pathname.includes("login") ? props.modal : null;

  return (
    <html lang="en">
      <body>
        {props.children}
        {modal_}
      </body>
    </html>
  );
}
