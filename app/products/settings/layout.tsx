import { OperatorAuthGate } from "@/components/layout/OperatorAuthGate";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OperatorAuthGate>{children}</OperatorAuthGate>;
}
