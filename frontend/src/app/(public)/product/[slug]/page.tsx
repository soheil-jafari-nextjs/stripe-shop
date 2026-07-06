import { serversideGetter } from "@/actions/serversideFetcher";
import AddToCart from "@/components/add-to-cart";
import { cookies } from "next/headers";


const AdminUpdateProduct = async ({ params }: { params: Promise<{ slug: string }> }) => {
   const myParams = await params;
   const product = await serversideGetter(`product/details-by-slug/${myParams.slug}`);
   if (product?.error) {
      return <div>Error In Searchin Product</div>
   }

   const cookieStore = await cookies();

   return (
      <div className=" flex flex-col gap-6 container mx-auto mt-12">
         <div className=" grid grid-cols-6 gap-4">
            <div className=" text-sm font-bold col-span-5">{product.title}</div>
            <AddToCart product={product} actoken={cookieStore.get('actoken')?.value} />
         </div>
         <div className=" text-sm font-bold">{product.quantity} number</div>
         <div className=" text-sm font-bold">{product.price / 100} $</div>
         <div dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
   );
}

export default AdminUpdateProduct;