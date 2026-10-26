import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Eclora Aesthetics',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F6F3EA] font-body text-[#1E2115]">{children}</div>;
}
