
import { StateCreator } from 'zustand';
import { EmployeeWithUser, OrganisationWithFounder } from '@/types/types';


export type OrgState = {
    createdOrg: OrganisationWithFounder[]
    joinedOrg: OrganisationWithFounder[]
    otherOrg: OrganisationWithFounder[]
    currentUser:EmployeeWithUser | null

};


export type OrgAction = {
    addCreatedOrg:(data:OrganisationWithFounder[] ) => void
    addJoinedOrg:(data: OrganisationWithFounder[]) => void
    addOtherOrg:(data: OrganisationWithFounder[]) => void
    addCurrentUser:(data: EmployeeWithUser) => void
    
}

export type OrgStore = OrgState & OrgAction

export const initialState: OrgState = {
    createdOrg: [],
    otherOrg: [],
    joinedOrg: [],
    currentUser: null,
    // Add other actions here if needed
 
};

export const createOrgSlice:StateCreator<OrgStore> = (set) =>({
    ...initialState,
    addCreatedOrg: (data: OrganisationWithFounder[]) => set({ createdOrg: data }),
    addOtherOrg: (data: OrganisationWithFounder[]) => set({ otherOrg: data }),
    addJoinedOrg: (data: OrganisationWithFounder[]) => set({ joinedOrg: data }),
    addCurrentUser: (data: EmployeeWithUser) => set({ currentUser: data }),
    // Add other actions here if needed


})