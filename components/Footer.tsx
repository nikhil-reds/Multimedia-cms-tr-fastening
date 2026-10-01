export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-8 py-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-semibold tracking-tight">TR Fastenings Multimedia</p>
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} TR Fastenings Multimedia. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
