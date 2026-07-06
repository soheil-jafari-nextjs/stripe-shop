import { serversideGetter } from "@/actions/serversideFetcher";
import Link from "next/link";
import ZDataSetter from "./z-data-setter";

const Header = async () => {
   const response = await serversideGetter(`user/get-z-data`,);
   return (
      <div className=" container mx-auto mt-6 ">
         <div
            className=" bg-sky-300 rounded-xl border-sky-300 border shadow-[0px_0px_5px_5px_rgba(0,166,244,.1)] p-4 flex justify-between items-center gap-4"
         >
            <Link
               className=" text-lg font-bold text-white"
               href={'/'}
            >
               Logo
            </Link>
            <ZDataSetter response={response} />
         </div>
      </div>
   );
}

export default Header;