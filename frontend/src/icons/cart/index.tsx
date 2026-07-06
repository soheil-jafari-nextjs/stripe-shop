const CartIcon = ({ sizes }: { sizes: number }) => {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         className="size-5"
         fill="none"
         viewBox="0 0 24 24"
         stroke="currentColor"
         strokeWidth={2}
         width={sizes} height={sizes}
      >
         <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l1 5m0 0h12l2-5H6zm0 0l1.5 7h9L18 8M9 19a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z"
         />
      </svg>
   );
}

export default CartIcon;