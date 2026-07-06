import ProfileRightNavbar from "@/components/profile/right-navbar";

const AdminLayout = async ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
   return (
      <div className=" grid grid-cols-5 container mx-auto  mt-6  gap-6  min-h-screen">
         <ProfileRightNavbar />
         <div className=" col-span-4 bg-zinc-100 p-5 rounded-2xl">
            {children}
         </div>
      </div>
   );
}
export default AdminLayout;