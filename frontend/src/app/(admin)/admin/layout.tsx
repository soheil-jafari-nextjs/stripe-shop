import { serversideGetter } from "@/actions/serversideFetcher";
import AdminRightNavbar from "@/components/admin/right-navbar";
import { TUser } from "@/types/user";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children, }: Readonly<{ children: React.ReactNode; }>) => {

   const response = await serversideGetter(`user/me`,);
   if (response.statusCode == 401) { redirect('/') }
   const userData: TUser = response;
   if (userData.role != 'ADMIN') {
      redirect('/')
   }

   return (
      <div className=" grid grid-cols-5 container mx-auto  mt-6  gap-6">
         <AdminRightNavbar />
         <div className=" col-span-4 bg-zinc-100 p-5 rounded-2xl">
            {children}
         </div>
      </div>
   );
}

export default AdminLayout;

