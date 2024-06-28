import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/utils/authOptions";

async function page() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return <LoginForm />;
}

export default page;
