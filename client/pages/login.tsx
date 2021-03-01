import { Navbar } from "components/navbar/navbar.component";
import Head from "next/head";
import { LoginLayout } from "layouts/login/login.layout";

export default function Login(): JSX.Element {
  return (
    <div>
      <div
        className="min-h-screen"
        style={{
          background: "url(/images/login/bg.svg) no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Head>
          <title>Ency | Sign Up</title>
        </Head>
        <Navbar />
        <LoginLayout />
      </div>
    </div>
  );
}
