// Redirect /login to /sign-in
import { redirect } from "next/navigation";

export default function LoginRedirect() {
  redirect("/sign-in");
}
