import Image from "next/image";
import Home from "./components/Home";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Home />
      </div>
    </main>
  );
}
