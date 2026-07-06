'use client'

import { serversideGetter } from "@/actions/serversideFetcher";
import LoadingIcon from "@/icons/loading";
import { TProduct } from "@/types/product";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";


const HomePage = () => {

   const [loadingStatus, setLoadingStatus] = useState<number>(0);
   const [products, setProducts] = useState<TProduct[]>([]);

   const fetcher = async () => {
      const result = await serversideGetter('product/main-page-all',);
      if (result?.error) {
         setLoadingStatus(-1);
         return toast.error(result.error)
      }
      else {
         setLoadingStatus(1);
         setProducts(result)
      }
   };
   useEffect(() => { fetcher(); }, []);

   return (
      <div className=" flex flex-col gap-6 mt-12 container mx-auto">
         <>{
            loadingStatus == 0 ? <div className=" flex justify-center items-center p-6"><LoadingIcon sizes={40} /></div> :
               <div className=" grid grid-cols-3 gap-2">
                  {products && products.map((item, index: number) => (
                     <div className=" min-h-40 border bg-white border-zinc-200 rounded-3xl p-6 flex flex-col justify-between" key={index}>
                        <div className=" flex flex-col gap-2">
                           <div className=" font-bold">{item.title}</div>
                           <div className=" text-sm text-zinc-500">{item.price / 100} $</div>
                        </div>
                        <div className=" flex justify-end items-center">
                           <Link
                              href={`/product/${item.slug}`}
                              className=" underline underline-offset-8 text-sky-600 transition-all duration-500 hover:text-sky-400"
                           >
                              go to checkout
                           </Link>
                        </div>
                     </div>
                  ))}
               </div>
         }</>
      </div>
   );
}

export default HomePage;