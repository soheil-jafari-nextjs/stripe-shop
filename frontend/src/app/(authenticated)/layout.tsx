import { serversideGetter } from "@/actions/serversideFetcher";
import { redirect } from "next/navigation";

const ProfileLayout = async ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
   const response = await serversideGetter(`user/me`,);
   if (response.statusCode == 401) { redirect('/auth') }
   return (
      <div className=" mt-6">
         {children}
      </div>
   );
}
export default ProfileLayout;