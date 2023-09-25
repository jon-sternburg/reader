import "server-only";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Page_User from "../components/Page_User";
import { getServerSession } from "next-auth/next";
import auth_options from "../auth_options";

export const metadata: Metadata = {
  title: "Reader! - User Page",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

async function fetch_data(id: string) {
  return await fetch(
    `${process.env.NEXT_PUBLIC_CB_URL}/api/user?user_id=${id}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => {
      console.log(err);
      return null;
    });
}

export default async function Page(): Promise<JSX.Element | void> {
  const session = await getServerSession(auth_options);

  if (session) {
    const user_data = await fetch_data(session?.user._id);
    const user_id = session?.user._id ? session.user._id : "";
    const email = session?.user.email ? session.user.email : "";
    return <Page_User user_data={user_data} email={email} user_id={user_id} />;
  } else {
    redirect("/");
  }
}
