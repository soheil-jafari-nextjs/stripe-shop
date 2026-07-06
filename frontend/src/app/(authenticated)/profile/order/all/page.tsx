'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import { TOrder } from "@/types/order";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormEvent } from 'react'
import Link from "next/link";
import ProductIcon from "@/icons/product";
import { time_biutifier } from "@/actions/time_biutifier";
import LoadingIcon from "@/icons/loading";
import { ShipStatus } from "@/types/ship";
const AllOrders = () => {

   const search_params = useSearchParams();
   const [reloader, serReloader] = useState<boolean>(false);
   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [orders, setOrders] = useState<TOrder[]>([]);

   const fetcher = async () => {
      const result = await serversideGetter(`order/me/all?${search_params.toString()}`,);
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

   const checkoutHandler = async (event: FormEvent, id: string) => {
      event.preventDefault();
      if (!id) { return false; }
      const formData = new FormData();
      formData.append('orderId', id)
      const result = await serversidePoster(`checkout/new`, formData);
      if (result?.error) { return toast.error(result.error) }
      toast.success('please wait. you are redirecting to gateway...')
      window.location.assign(result.response?.data.redirectUrl);
   };

   return (
      <div className=" flex flex-col gap-6">
         <div>all orders</div>
         <>{
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <div className=" grid grid-cols-2 gap-2">
                  {orders.map((item, index: number) => (
                     <div className=" min-h-40 border bg-white border-zinc-200 rounded-3xl p-6 gap-3 flex flex-col justify-start" key={index}>
                        <div className=" flex justify-between items-center gap-2">
                           <div className=" font-bold">{item.totalPrice / 100} $ <span className=" text-sm text-zinc-500">{time_biutifier(item.createdAt)}</span></div>
                           <>{
                              item.status == 'PENDING' &&
                              <form onSubmit={(e) => checkoutHandler(e, item.id)} className=" flex flex-col gap-6">
                                 <button type="submit" className=" cursor-pointer bg-sky-600 text-white p-1 text-sm rounded-md" >Pay Now</button>
                              </form>
                           }</>
                           <>{
                              item.status == 'PAID' &&
                              <div className=" cursor-pointer bg-green-600 text-white p-1 text-sm rounded-md" >Paid</div>
                           }</>
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
                                       href={`/product/${t.product.slug}`}
                                    >
                                       <ProductIcon sizes={20} />
                                    </Link>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <hr className="  border-zinc-300" />
                        <div className=" flex flex-col gap-2">
                           <div className=" text-sm font-bold">Transactions</div>
                           {item.transactions.map((t, i) => (
                              <div key={i} className=" bg-zinc-200 p-1 text-xs rounded-md flex justify-between items-center gap-4" >
                                 <div className=" flex justify-start items-center gap-4">
                                    <div className=" rounded-md bg-white p-1 min-w-6 min-h-6 flex justify-center items-center">{i + 1}</div>
                                    <div>{time_biutifier(t.createdAt)}</div>
                                 </div>
                                 <div className={` p-1 rounded-md  ${t.status == 'SUCCESS' ? 'bg-green-600 text-white' : ''}`}>{t.status} </div>
                              </div>
                           ))}
                        </div>
                        <>{
                           item.ship &&
                           <>
                              <hr className="  border-zinc-300" />
                              <div className=" flex flex-col gap-2">
                                 <div className=" text-sm font-bold">Ship Data</div>
                                 <div className=" bg-zinc-200 p-1 text-xs rounded-md flex justify-between items-center gap-4" >
                                    <div>trackingCode: {item.ship.trackingCode}</div>
                                    <div className=" flex justify-end items-center gap-4">
                                       <div>{time_biutifier(item.ship.updatedAt)}</div>
                                       <div className={` p-1 rounded-md  ${item.ship.status == ShipStatus.PENDING ? 'bg-zinc-400 text-white' :
                                          item.ship.status == ShipStatus.SHIPPED ? 'bg-green-400 text-white' :
                                             item.ship.status == ShipStatus.DELIVERED ? 'bg-green-600 text-white' :
                                                ''}`}>{item.ship.status} </div>
                                    </div>
                                 </div>
                              </div>
                           </>
                        }</>
                     </div>
                  ))}
               </div>
         }</>
      </div>
   );
}

export default AllOrders;