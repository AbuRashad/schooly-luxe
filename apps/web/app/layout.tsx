import './globals.css';

export const metadata = {
  title: 'Schooly Luxe',
  description: 'Premium school operations platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
