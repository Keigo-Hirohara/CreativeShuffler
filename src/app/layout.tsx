import './globals.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="h-16 bg-[#1D5D9B] text-white font-bold tracking-wider flex items-center pl-4 text-2xl">
          CreativeShuffler
        </header>
        {children}
      </body>
    </html>
  );
}
