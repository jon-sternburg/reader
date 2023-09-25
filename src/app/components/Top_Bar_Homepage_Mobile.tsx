"use client";
import { Fragment } from "react";
import styles from "../css/topbar_styles.module.css";
import { AiFillCloseCircle } from "react-icons/ai";
import { FcBookmark } from "react-icons/fc";
import { signOut } from "next-auth/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useRouter, usePathname } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

type TBHM_Props = {
  show_book_list: () => void;
  book_list: boolean;
  logged_in: boolean;
};

export default function Top_Bar_Homepage_Mobile(props: TBHM_Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handle_signout() {
    await signOut({ callbackUrl: process.env.NEXTAUTH_URL });
  }

  function handle_user_click() {
    //if (session?.user?.email) {
    if (props.logged_in) {
      router.push("/user");
    } else {
      localStorage.setItem("prev_url_login", JSON.stringify(""));
      router.push("/login");
    }
  }
  return (
    <header className={styles.top_bar_frame_mobile}>
      <div className={styles.title_wrap_mobile}>
        <div className={styles.book_icon_wrap_mobile}>
          <FcBookmark className={styles.book_icon_mobile} />
        </div>
        <div className={styles.title_mobile}>{"Reader!"}</div>
      </div>

      {props.book_list ? (
        <AiFillCloseCircle
          className={styles.close_grid_sidebar_icon}
          onClick={() => props.show_book_list()}
        />
      ) : (
        <nav className={styles.mobile_right_icon_wrap}>
          {pathname.includes("user") ? (
            <Fragment>
              <AiFillHome
                className={styles.user_icon}
                onClick={() => router.push("/")}
              />
              <button
                aria-label={"Sign out"}
                type={"button"}
                className={styles.sign_out_top}
                onClick={() => handle_signout()}
              >
                Sign out
              </button>
            </Fragment>
          ) : (
            <Fragment>
              <FaUserCircle
                className={styles.user_icon}
                onClick={() => handle_user_click()}
              />
              <RxHamburgerMenu
                className={styles.hamburger_icon}
                onClick={() => props.show_book_list()}
              />
            </Fragment>
          )}
        </nav>
      )}
    </header>
  );
}
