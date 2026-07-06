'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import { time_biutifier } from "@/actions/time_biutifier";
import LoadingIcon from "@/icons/loading";
import OrderIcon from "@/icons/order";
import TrashIcon from "@/icons/trash";
import UserIcon from "@/icons/user";
import { TransactionStatus, TTransaction } from "@/types/order";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


const AdminAllTransactions = () => {
   const search_params = useSearchParams();
   const [reloader, serReloader] = useState<boolean>(false);
   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [transactions, setTransactions] = useState<TTransaction[]>([]);

   const fetcher = async () => {
      const result = await serversideGetter(`transaction/all?${search_params.toString()}`,);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         setTransactions(result)
      }
   };
   useEffect(() => { fetcher(); }, [reloader]);
   const remover = async (event: FormEvent, id: string) => {
      event.preventDefault()
      if (!id) {
         return false;
      }
      const formData = new FormData();
      const result = await serversidePoster(`transaction/remove/${id}`, formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };



   function getNextTransactionStatus(current: TransactionStatus): TransactionStatus {
      const statuses = Object.values(TransactionStatus) as TransactionStatus[];
      const currentIndex = statuses.findIndex(status => status === current);
      if (currentIndex === -1) {
         throw new Error(`Invalid transaction status: ${current}`);
      }
      return statuses[(currentIndex + 1) % statuses.length];
   }

   const updater = async (event: FormEvent, item: TTransaction) => {
      event.preventDefault()
      if (!item.id) {
         return false;
      }
      const formData = new FormData();
      formData.append('status', getNextTransactionStatus(item.status))
      const result = await serversidePoster(`transaction/update/${item.id}`, formData);

      if (result?.error) { return toast.error(result.error) }
      else {
         setLoadingStatus(0);
         return serReloader((prev: boolean) => !prev);
      }
   };

   return (
      <div className=" flex flex-col gap-6">
         <div>all transactions</div>
         <>{
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <div className=" grid grid-cols-2 gap-2">
                  {transactions.map((item, index: number) => (
                     <div className=" min-h-40 border bg-white border-zinc-200 rounded-3xl p-6 gap-6 flex flex-col justify-start" key={index}>
                        <div className=" flex justify-between items-center gap-2 ">
                           <div className=" flex justify-start items-center gap-2">
                              <div className=" font-bold flex justify-start items-center gap-1">
                                 <span>{item.amount / 100} $</span>
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
                        <div className=" flex flex-col gap-3 text-sm break-all">
                           <div> <span className=" font-bold">gatewayRedirectId</span> : {item.gatewayRedirectId}</div>
                           <div className=" flex justify-between items-center gap-2">
                              <div> <span className=" font-bold">createdAt</span> : {time_biutifier(item.createdAt)}</div>
                              <div> <span className=" font-bold">paymentGateway</span> : {item.paymentGateway}</div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
         }</>
      </div>
   );
}

export default AdminAllTransactions;