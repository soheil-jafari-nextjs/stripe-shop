'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import { time_biutifier } from "@/actions/time_biutifier";
import CartIcon from "@/icons/cart";
import LoadingIcon from "@/icons/loading";
import ProductIcon from "@/icons/product";
import ShipIcon from "@/icons/ship";
import TransactionIcon from "@/icons/transaction";
import TrashIcon from "@/icons/trash";
import UserIcon from "@/icons/user";
import { orderStatus, TOrder } from "@/types/order";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


const AdminAllOrders = () => {
   const search_params = useSearchParams();
   const [reloader, serReloader] = useState<boolean>(false);
   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [orders, setOrders] = useState<TOrder[]>([]);

   const fetcher = async () => {
      const result = await serversideGetter(`order/all?${search_params.toString()}`,);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         setOrders(result)
      }
   };
   useEffect(() => { fetcher(); }, [reloader]);
   const remover = async (event: FormEvent, id: string) => {
      event.preventDefault()
      if (!id) {
         return false;
      }
      const formData = new FormData();
      const result = await serversidePoster(`order/remove/${id}`, formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };



   function getNextOrderStatus(current: orderStatus): orderStatus {
      const statuses = Object.values(orderStatus) as orderStatus[];
      const currentIndex = statuses.findIndex(status => status === current);
      if (currentIndex === -1) {
         throw new Error(`Invalid order status: ${current}`);
      }
      return statuses[(currentIndex + 1) % statuses.length];
   }

   const updater = async (event: FormEvent, item: TOrder) => {
      event.preventDefault()
      if (!item.id) {
         return false;
      }
      const formData = new FormData();
      formData.append('status', getNextOrderStatus(item.status))
      const result = await serversidePoster(`order/update/${item.id}`, formData);

      if (result?.error) { return toast.error(result.error) }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };

   return (
      <div className=" flex flex-col gap-6">
         <div>all orders</div>
         <>{
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <div className=" grid grid-cols-2 gap-2">
                  {orders.map((item, index: number) => (
                     <div className=" min-h-40 border bg-white border-zinc-200 rounded-3xl p-6 gap-3 flex flex-col justify-start" key={index}>
                        <div className=" flex justify-between items-center gap-2 ">
                           <div className=" flex justify-start items-center gap-2">
                              <div className=" font-bold flex justify-start items-center gap-1">
                                 <span>{item.totalPrice / 100} $</span>
                                 <form onSubmit={(e) => updater(e, item)} className=" flex flex-col gap-6">
                                    <button type="submit" className=" cursor-pointer bg-sky-600 text-white p-1 text-sm rounded-md" > {item.status} </button>
                                 </form>
                              </div>
                              <div className=" text-sm text-zinc-500">{time_biutifier(item.createdAt)}</div>
                           </div>
                           <div className=" flex justify-end items-center gap-4">
                              <Link
                                 target="_blank"
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/user/all?id=${item.userId}`}
                              >
                                 <UserIcon sizes={20} />
                              </Link>
                              <Link
                                 target="_blank"
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/cart/all?userId=${item.userId}`}
                              >
                                 <CartIcon sizes={20} />
                              </Link>
                              <Link
                                 target="_blank"
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/ship/all?orderId=${item.id}`}
                              >
                                 <ShipIcon sizes={20} />
                              </Link>
                              <Link
                                 target="_blank"
                                 className=" cursor-pointer bg-green-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-green-400 "
                                 href={`/admin/transaction/all?orderId=${item.id}`}
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
                        <div className=" grid grid-cols-2 gap-8">
                           {item.orderItems.map((t, i) => (
                              <div key={i} className=" bg-zinc-200 p-1 text-xs rounded-md" >
                                 <div className=" break-all">{t.quantity} {t.title} </div>
                                 <div className=" flex justify-between items-center ">
                                    <div className="">{t.price * t.quantity / 100} $</div>
                                    <Link
                                       target="_blank"
                                       className=" cursor-pointer bg-green-600 text-white p-1 rounded-md transition-all duration-500 hover:bg-green-400"
                                       href={`/admin/product/all?id=${t.productId}`}
                                    >
                                       <ProductIcon sizes={20} />
                                    </Link>
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

export default AdminAllOrders;