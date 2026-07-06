'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import { time_biutifier } from "@/actions/time_biutifier";
import LoadingIcon from "@/icons/loading";
import OrderIcon from "@/icons/order";
import ProductIcon from "@/icons/product";
import TrashIcon from "@/icons/trash";
import UserIcon from "@/icons/user";
import { ShipStatus, TShip } from "@/types/ship";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


const AdminAllShips = () => {
   const search_params = useSearchParams();
   const [reloader, serReloader] = useState<boolean>(false);
   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [ships, setShips] = useState<TShip[]>([]);

   const fetcher = async () => {
      const result = await serversideGetter(`ship/all?${search_params.toString()}`,);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         setShips(result)
      }
   };
   useEffect(() => { fetcher(); }, [reloader]);


   const remover = async (event: FormEvent, id: string) => {
      event.preventDefault()
      if (!id) {
         return false;
      }
      const formData = new FormData();
      const result = await serversidePoster(`ship/remove/${id}`, formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };

   function getNextShipStatus(current: ShipStatus): ShipStatus {
      const statuses = Object.values(ShipStatus) as ShipStatus[];
      const currentIndex = statuses.findIndex(status => status === current);
      if (currentIndex === -1) {
         throw new Error(`Invalid ship status: ${current}`);
      }
      return statuses[(currentIndex + 1) % statuses.length];
   }

   const updater = async (event: FormEvent, item: TShip) => {
      event.preventDefault()
      if (!item.id) {
         return false;
      }
      const formData = new FormData();
      formData.append('status', getNextShipStatus(item.status))
      const result = await serversidePoster(`ship/update/${item.id}`, formData);

      if (result?.error) { return toast.error(result.error) }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };

   return (
      <div className=" flex flex-col gap-6">
         <div>all ships</div>
         <>{
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <div className=" grid grid-cols-2 gap-2">
                  {ships.map((item, index: number) => (
                     <div className=" min-h-40 border bg-white border-zinc-200 rounded-3xl p-6 gap-3 flex flex-col justify-start" key={index}>
                        <div className=" flex justify-between items-center gap-2 ">
                           <form onSubmit={(e) => updater(e, item)} className=" flex flex-col gap-6">
                              <button type="submit" className=" cursor-pointer bg-sky-600 text-white p-1 text-sm rounded-md" > {item.status} </button>
                           </form>
                           <div className=" flex justify-end items-center gap-4">
                              <Link
                                 target="_blank"
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/order/all?id=${item.orderId}`}
                              >
                                 <OrderIcon sizes={20} />
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
                        <div className=" font-bold">tracking code : {item.trackingCode}</div>
                        <div className=" flex justify-start items-start gap-4">
                           <div className=" text-sm text-zinc-500">updatedAt : {time_biutifier(item.updatedAt)}</div>
                           <div className=" text-sm text-zinc-500">createdAt : {time_biutifier(item.createdAt)}</div>
                        </div>
                     </div>
                  ))}
               </div>
         }</>
      </div>
   );
}

export default AdminAllShips;