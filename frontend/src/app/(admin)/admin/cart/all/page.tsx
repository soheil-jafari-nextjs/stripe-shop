'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import { time_biutifier } from "@/actions/time_biutifier";
import LoadingIcon from "@/icons/loading";
import TrashIcon from "@/icons/trash";
import UserIcon from "@/icons/user";
import { TCart } from "@/types/cart";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


const AdminAllCarts = () => {

   const search_params = useSearchParams();

   const [reloader, serReloader] = useState<boolean>(false);
   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [carts, setCarts] = useState<TCart[]>([]);

   const fetcher = async () => {
      console.log(`cart/all?${search_params.toString()}`)
      const result = await serversideGetter(`cart/all?${search_params.toString()}`,);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         setCarts(result)
      }
   };
   useEffect(() => { fetcher(); }, [reloader]);
   const remover = async (event: FormEvent, id: string) => {
      event.preventDefault()
      if (!id) {
         return false;
      }
      const formData = new FormData();
      const result = await serversidePoster(`cart/remove/${id}`, formData);

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
         <div>all carts</div>
         <>{
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <div className=" grid grid-cols-2 gap-2">
                  {carts.map((item, index: number) => (
                     <div className=" min-h-40 border bg-white border-zinc-200 rounded-3xl p-6 gap-3 flex flex-col justify-start" key={index}>
                        <div className=" flex justify-between items-center gap-2 ">
                           <div className=" text-sm text-zinc-500">{time_biutifier(item.createdAt)}</div>
                           <div className=" flex justify-end items-center gap-2">
                              <Link
                                 target="_blank"
                                 className=" text-sm text-white bg-green-600 hover:bg-green-400 p-2 rounded-md"
                                 href={`/admin//user/all?id=${item.user.id}`}
                              >
                                 <UserIcon sizes={20} />
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
                        <div className=" grid grid-cols-2 gap-6">
                           {item.items.map((t, i) => (
                              <div key={i} className=" bg-zinc-100 p-2 border border-zinc-200 rounded-md" >
                                 <Link
                                    className=" text-sky-600 hover:text-sky-400 font-bold"
                                    href={`/admin/product/all?id=${t.productId}`}
                                 >
                                    {t.product.title}
                                 </Link>
                                 <div className=" flex justify-between items-center gap-4 text-sm text-zinc-600">
                                    <div className=" break-all">
                                       {t.quantity} numbers
                                    </div>
                                    <div>{t.product.price / 100} $</div>
                                 </div>
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

export default AdminAllCarts;