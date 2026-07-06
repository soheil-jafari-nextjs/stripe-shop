import CartManger from "@/components/cart-manager";
import { cookies } from "next/headers";

const CartPage = async () => {
   const cookieStore = await cookies();
   const actoken = cookieStore.get('actoken');
   return (
      <div className=" mt-12 container mx-auto">
         <CartManger actoken={actoken?.value} />
      </div>
   );
}

export default CartPage;