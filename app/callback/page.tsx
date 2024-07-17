import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { createUser, getUserByID } from "../neo4j.action";

export default async function CallbackPage() {
  const { isAuthenticated, getUser } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    return redirect(
      `/api/auth/login?post_login_redirect_url=${process.env.KINDE_SITE_URL}/callback`
    );
  }

  const user = await getUser();

  if (!user) {
    return redirect(
      `/api/auth/login?post_login_redirect_url=${process.env.KINDE_SITE_URL}/callback`
    );
  }

  //Check if the user is already in the neo4j database
  const dbUser = await getUserByID(user.id);

  //If the user is not in the database, add the user to the database
  if (!dbUser) {
    await createUser({
      applicationId: user.id,
      email: user.email!,
      firstname: user.given_name!,
      lastname: user.family_name ?? undefined,
    });
  }

  redirect("/");
}
