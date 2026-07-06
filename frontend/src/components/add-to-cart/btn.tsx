"use client";

import CartIcon from "@/icons/cart";

export default function AddToCartBtn({ quantity, onIncrease, onDecrease, }: { quantity: number; onIncrease: () => void; onDecrease: () => void; }) {
   if (quantity === 0) {
      return (
         <button
            onClick={onIncrease}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 font-medium text-white transition-all duration-200 hover:bg-sky-600 active:scale-[0.98] cursor-pointer"
         >
            <CartIcon sizes={20} />
            Add To Cart
         </button>
      );
   }

   return (
      <div className="flex h-12 w-full items-center overflow-hidden rounded-xl border border-sky-500 bg-white">
         <button
            onClick={onIncrease}
            className="flex h-full w-14 items-center justify-center text-sky-600 transition hover:bg-sky-50 active:bg-sky-100 cursor-pointer"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="size-5"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={2.5}
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14M5 12h14"
               />
            </svg>
         </button>

         <div className="flex flex-1 items-center justify-center border-x border-sky-100 text-lg font-bold text-sky-700">
            {quantity}
         </div>

         <button
            onClick={onDecrease}
            className="flex h-full w-14 items-center justify-center text-red-500 transition hover:bg-red-50 active:bg-red-100 cursor-pointer"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="size-5"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={2.5}
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14"
               />
            </svg>
         </button>
      </div>
   );
}