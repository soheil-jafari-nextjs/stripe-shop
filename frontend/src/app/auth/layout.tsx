import { serversideGetter } from "@/actions/serversideFetcher";
import { redirect } from "next/navigation";

const AuthLayout = async ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
   const response = await serversideGetter(`user/me`,);
   if (response.statusCode == 200) { redirect('/profile') }
   return (<>{children}</>);
}

export default AuthLayout;

