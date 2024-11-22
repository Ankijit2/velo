"use client"
import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore as zuseStore, create } from 'zustand';
import { OrgStore,createOrgSlice } from '@/app/store/organization-store';

export const StoreContext = createContext<StoreApi<OrgStore>|null>(null);


export interface StoreProviderProps {
    children: ReactNode;
  }
export const StoreProvider = ({ children }: StoreProviderProps) => {
    const storeRef =
      useRef<
        StoreApi<
          OrgStore
        >
      >();
    if (!storeRef.current) {
      storeRef.current = create<
        OrgStore
      >((...a) => ({
        ...createOrgSlice(...a),
       
      }));
    }
  
    return (
      <StoreContext.Provider value={storeRef.current}>
        {children}
      </StoreContext.Provider>
    );
  };
  
  export const useStore = <T,>(
    selector: (
      store: OrgStore
    ) => T
  ): T => {
    const storeContext = useContext(StoreContext);
  
    if (!storeContext) {
      throw new Error(`useStore must be use within StoreProvider`);
    }
  
    return zuseStore(storeContext, selector);
  };
  