'use client'

import serversidePoster, { serversideGetter } from "@/actions/serversideFetcher";
import LoadingIcon from "@/icons/loading";
import SendIcon from "@/icons/send";
import TrashIcon from "@/icons/trash";
import { TProduct } from "@/types/product";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const AdminUpdateProduct = () => {
   const params: { id: string } = useParams();
   const router = useRouter();
   const [title, setTitle] = useState<string>('')
   const [price, setPrice] = useState<string>('')
   const [quantity, setQuantity] = useState<number | null>(null)
   const [description, setDescription] = useState<string>('')


   const submitter = async (event: FormEvent) => {
      if (!product) {
         return false;
      }
      event.preventDefault()
      const formData = new FormData();

      formData.append("title", title);
      formData.append("price", price);
      formData.append("quantity", String(quantity));
      formData.append("description", description);

      const result = await serversidePoster(`product/update/${product.id}`, formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         return router.push('/admin/product/all')
      }
   };


   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [product, setProduct] = useState<TProduct | null>(null);

   const fetcher = async () => {
      const result = await serversideGetter(`product/details/${params.id}`);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         const res: TProduct = result;
         setProduct(res);
         setTitle(res.title);
         setPrice(String(res.price));
         setQuantity(res.quantity);
         setDescription(res.description);
      }
   };
   useEffect(() => { fetcher(); }, []);


   const remover = async (event: FormEvent) => {
      if (!product) {
         return false;
      }
      event.preventDefault()
      const formData = new FormData();

      const result = await serversidePoster(`product/remove/${product.id}`, formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         return router.push('/admin/product/all')
      }
   };



   return (
      <div className=" flex flex-col gap-6">
         <div className=" flex justify-between items-center gap-4">
            <div>update product</div>
            {
               loadingStatus == 0 || product == null ? <></>
                  : <form onSubmit={remover} className=" flex flex-col gap-6">
                     <button
                        className=" cursor-pointer bg-red-600 text-white p-2 rounded-md transition-all duration-500 hover:bg-red-400 "
                        type="submit"
                     >
                        <TrashIcon sizes={20} />
                     </button>
                  </form>
            }
         </div>
         <form onSubmit={submitter} className=" flex flex-col gap-6">
            <>{
               loadingStatus == 0 || product == null
                  ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div>
                  : <>
                     <div className=" flex flex-col gap-2">
                        <div className=" text-sm font-bold">title</div>
                        <input
                           type="text"
                           onChange={(e) => setTitle(e.target.value)}
                           className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
                           defaultValue={title}
                        />
                     </div>
                     <div className=" flex flex-col gap-2">
                        <div className=" text-sm font-bold">price ( in cents)</div>
                        <input
                           type="number"
                           onChange={(e) => setPrice(e.target.value)}
                           className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
                           defaultValue={Number(price)}
                        />
                     </div>
                     <div className=" flex flex-col gap-2">
                        <div className=" text-sm font-bold">quantity</div>
                        <input
                           type="text"
                           onChange={(e) => setQuantity(Number(e.target.value))}
                           className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
                           defaultValue={Number(quantity)}
                        />
                     </div>
                     <div className=" flex flex-col gap-2">
                        <div className=" text-sm font-bold">description</div>
                        <textarea
                           onChange={(e) => setDescription(e.target.value)}
                           rows={4}
                           className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
                           defaultValue={description}
                        />
                     </div>
                     <div className=" flex justify-end items-center ">
                        <button
                           className=" bg-sky-600 text-white p-3 rounded-full min-w-8 min-h-8 transition-all duration-500 hover:bg-sky-500 cursor-pointer"
                           type="submit"
                        >
                           <SendIcon sizes={20} />
                        </button>
                     </div>
                  </>
            }</>
         </form>
      </div>
   );
}

export default AdminUpdateProduct;