import './globals.css';
import '@mantine/core/styles.css';

export const metadata = {
  title: 'Siemens RiskFlow - Protecting Your Systems',
  description:
    'Siemens RiskFlow is a highly advanced risk analysis tool that helps you identify and mitigate security risks in your systems.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
    </html>
  );
}
