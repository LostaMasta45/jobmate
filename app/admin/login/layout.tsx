export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout overrides the parent admin layout
  // No sidebar for login page
  return <>{children}</>;
}
