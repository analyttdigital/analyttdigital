import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/**
 * Editing flag (M3). `true` inside the Puck canvas, `false` on published
 * pages. Heavy components (GSAP, three.js) read this to pause or simplify
 * animations while editing so drag and drop stays usable.
 *
 * Components consume the hook directly; M5 may additionally inject an
 * `editing` prop at registration time.
 */

const EditingContext = createContext<boolean>(false);

export function EditingProvider({ editing, children }: { editing: boolean; children: ReactNode }) {
  return <EditingContext.Provider value={editing}>{children}</EditingContext.Provider>;
}

export function useEditing(): boolean {
  return useContext(EditingContext);
}
