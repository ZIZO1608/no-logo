// The real root layout lives in [lang]/layout.tsx so <html> can carry the language and direction.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
