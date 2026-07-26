// import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-5 font-display">NP Library</h1>
          <p className="text-xl mb-5 font-sans">
            Welcome to the future of library management. Seamless, efficient,
            and designed for the modern reader.
          </p>
          <div className="flex gap-5 justify-center">
            <Link href="/reader/dashboard">
              <button className="btn btn-primary border-0 mt-5">
                Reader Login
              </button>
            </Link>
            <Link href="/librarian/dashboard">
              <button className="btn btn-primary border-0 mt-5">
                Librarian Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
