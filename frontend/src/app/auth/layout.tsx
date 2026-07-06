import { serversideGetter } from "@/actions/serversideFetcher";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
   const response = await serversideGetter(`user/me`,);
   if (response.statusCode != 401) { redirect('/profile') }
   return (<>{children}</>);
}

export default AdminLayout;

