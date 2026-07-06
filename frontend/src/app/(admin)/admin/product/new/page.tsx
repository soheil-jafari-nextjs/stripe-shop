'use client'

import serversidePoster from "@/actions/serversideFetcher";
import SendIcon from "@/icons/send";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const AdminSubPage = () => {
   const router = useRouter();
   const [title, setTitle] = useState<string>('')
   const [price, setPrice] = useState<Number | null>(null)
   const [quantity, setQuantity] = useState<Number | null>(null)
   const [description, setDescription] = useState<string>('')


   const makeSlug = (text: string) => {
      return text
         .trim()
         .toLowerCase()
         .replace(/[^\w\s-]/g, "")
         .replace(/\s+/g, "-")
         .replace(/-+/g, "-");
   };
   const submitter = async (event: FormEvent) => {
      event.preventDefault()
      const formData = new FormData();

      formData.append("title", title);
      formData.append("slug", makeSlug(title));
      formData.append("price", String(price));
      formData.append("quantity", String(quantity));
      formData.append("description", description);

      const result = await serversidePoster('product/new', formData);

      if (result?.error) {
         return toast.error(result.error)
      }
      else {
         return router.push('/admin/product/all')
      }
   };

   return (
      <form onSubmit={submitter} className=" flex flex-col gap-6">
         <div>new product</div>
         <div className=" flex flex-col gap-2">
            <div className=" text-sm font-bold">title</div>
            <input
               type="text"
               onChange={(e) => setTitle(e.target.value)}
               className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
            />
         </div>
         <div className=" flex flex-col gap-2">
            <div className=" text-sm font-bold">price ( in cents)</div>
            <input
               type="number"
               onChange={(e) => setPrice(Number(e.target.value))}
               className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
            />
         </div>
         <div className=" flex flex-col gap-2">
            <div className=" text-sm font-bold">quantity</div>
            <input
               type="number"
               onChange={(e) => setQuantity(Number(e.target.value))}
               className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
            />
         </div>
         <div className=" flex flex-col gap-2">
            <div className=" text-sm font-bold">description</div>
            <textarea
               onChange={(e) => setDescription(e.target.value)}
               rows={4}
               className=" p-2 border border-zinc-200 focus-visible:border-sky-300 text-sm outline-none  w-full rounded-lg"
            />
         </div>
         <div className=" flex justify-end items-center ">
            <button
               className=" bg-sky-600 text-white p-3 rounded-full min-w-8 min-h-8 transition-all cursor-pointer duration-500 hover:bg-sky-500"
               type="submit"
            >
               <SendIcon sizes={20} />
            </button>
         </div>
      </form>
   );
}

export default AdminSubPage;