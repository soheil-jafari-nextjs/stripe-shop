'use client'

import RightAngleIcon from "@/icons/right-angle";
import Link from "next/link";


const ProfileRightNavbar = () => {

   const links: { title: string, slug: string }[] = [
      {
         title: 'info',
         slug: ''
      },
      {
         title: 'edit password',
         slug: 'edit-password'
      },
      {
         title: 'all orders',
         slug: 'order/all'
      },
   ]

   return (
      <div className="col-span-1 bg-zinc-100 p-5 rounded-2xl">
         {
            links.map((item, index: number) => (
               <Link
                  href={`/profile/${item.slug}`}
                  key={index}
                  className=" bg-zinc-100 w-full text-black font-bold text-sm transition-all duration-500 hover:bg-zinc-200 hover:text-sky-600 p-3 rounded-lg group flex justify-start items-center"
               >
                  <span>{item.title}</span>
                  <span className=" rotate-180 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 "><RightAngleIcon sizes={17} /></span>
               </Link>
            ))
         }
      </div>
   );
}

export default ProfileRightNavbar;