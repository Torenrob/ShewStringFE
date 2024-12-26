import {createContext, MutableRefObject, useRef} from "react";

export enum SelectedNavItem {
    Calendar,
    Budget
}

export const NavContext = createContext<MutableRefObject<SelectedNavItem>>(undefined!);