import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div className="bg-green-900 w-screen h-screen flex items-center">
      <div className="text-center w-full">
        <button className="bg-white p-2 rounded-md">
          Login With Google
        </button>
      </div>
    </div>
  );
}
