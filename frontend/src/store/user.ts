import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { Role } from '@/types/user';

export type ZUSER = {
   id: string,
   phone: string,
   role: Role
}
export type ZUserStore = {
   user: ZUSER,
   set_user: (t: ZUSER) => void
}


export const useUserStore = create<ZUserStore, [['zustand/persist', { siteId: string; email: string; siteUrl: string }],]>(
   persist(
      (set) => (
         {
            user: { id: "", phone: "", role: Role.USER, },
            set_user: (data: ZUSER) => { set(() => ({ user: data })) },
         }
      ),
      { name: "user" }
   )
)



