'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import { time_biutifier } from "@/actions/time_biutifier";
import CartIcon from "@/icons/cart";
import LoadingIcon from "@/icons/loading";
import OrderIcon from "@/icons/order";
import TransactionIcon from "@/icons/transaction";
import TrashIcon from "@/icons/trash";
import { TUser } from "@/types/user";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


const AdminAllUsers = () => {
   const search_params = useSearchParams();
   const [reloader, serReloader] = useState<boolean>(false);
   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [users, setUsers] = useState<TUser[]>([]);

   const fetcher = async () => {
      const result = await serversideGetter(`user/all?${search_params.toString()}`,);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         setUsers(result)
      }
   };
   useEffect(() => { fetcher(); }, [reloader]);
   const remover = async (event: FormEvent, id: string) => {
      event.preventDefault()
      if (!id) {
         return false;
      }
      const formData = new FormData();
      const result = await serversidePoster(`user/remove/${id}`, formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };

   const udpateRole = async (event: FormEvent, item: TUser) => {
      event.preventDefault()
      if (!item.id) {
         return false;
      }
      const formData = new FormData();
      formData.append('role', item.role == 'ADMIN' ? 'USER' : 'ADMIN')
      const result = await serversidePoster(`user/update/${item.id}`, formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };

   return (
      <div className=" flex flex-col gap-6">
         <div>all users</div>
         <>{
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <div className=" grid grid-cols-2 gap-2">
                  {users.map((item, index: number) => (
                     <div className=" min-h-40 border bg-white border-zinc-200 rounded-3xl p-6 gap-3 flex flex-col justify-start" key={index}>
                        <div className=" flex justify-between items-center gap-2 ">
                           <div className=" flex justify-start items-center gap-2">
                              <div className=" font-bold flex justify-start items-center gap-1">
                                 <span>{item.phone}</span>
                                 <form onSubmit={(e) => udpateRole(e, item)} className=" flex flex-col gap-6">
                                    <button type="submit" className=" cursor-pointer bg-sky-600 text-white p-1 text-sm rounded-md" > {item.role} </button>
                                 </form>
                              </div>
                              <div className=" text-sm text-zinc-500">{new Date(item.createdAt).toLocaleDateString('fa-ir', { hour: '2-digit', minute: '2-digit' })}</div>
                           </div>
                           <div className=" flex justify-end items-center gap-4">
                              <Link
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/cart/all?userId=${item.id}`}
                              >
                                 <CartIcon sizes={20} />
                              </Link>
                              <Link
                                 target="_blank"
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/order/all?userId=${item.id}`}
                              >
                                 <OrderIcon sizes={20} />
                              </Link>
                              <Link
                                 target="_blank"
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/transaction/all?userId=${item.id}`}
                              >
                                 <TransactionIcon sizes={20} />
                              </Link>
                              <form onSubmit={(e) => remover(e, item.id)} className=" flex flex-col gap-6">
                                 <button
                                    className=" cursor-pointer bg-red-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-red-400 "
                                    type="submit"
                                 >
                                    <TrashIcon sizes={20} />
                                 </button>
                              </form>
                           </div>
                        </div>
                        <div className=" flex flex-col gap-1">
                           {item.tokens.map((t, i) => (
                              <div key={i} className=" bg-zinc-200 p-1 text-xs rounded-md" >
                                 <div className=" break-all">
                                    {i + 1} {t.code}
                                 </div>
                                 <div className=" text-sm font-bold">{time_biutifier(t.createdAt)}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
         }</>
      </div>
   );
}

export default AdminAllUsers;