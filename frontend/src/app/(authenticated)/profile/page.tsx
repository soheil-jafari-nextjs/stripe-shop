import { serversideGetter } from "@/actions/serversideFetcher";
import { time_biutifier } from "@/actions/time_biutifier";
import Logout from "@/components/logout";
import { TUser } from "@/types/user";

const ProfilePage = async () => {

   const response = await serversideGetter(`user/me`,);
   const userData: TUser = response;
   return (
      <div className="flex flex-col gap-4">
         <div className=" flex justify-between items-start gap-4">
            <div className="flex flex-col gap-4">
               <div className=" font-bold">{userData.phone}</div>
               <div>{userData.role}</div>
               <div>{time_biutifier(userData.createdAt)}</div>
            </div>
            <Logout />
         </div>
         <div className=" grid grid-cols-3 gap-1">
            {userData.tokens && userData.tokens.map((t, i) => (
               <div key={i} className=" bg-zinc-100 p-1 text-xs rounded-md" >
                  <p className="break-all">{i + 1}. {t.code}</p>
                  <div className=" text-sm font-bold">{time_biutifier(t.createdAt)}</div>
               </div>
            ))}
         </div>
      </div>
   );
}

export default ProfilePage;