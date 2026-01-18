import { navigationRef } from "./appNav";


export function navigate(name,params = {}) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name,params);
    console.log('Navigation Object:', navigationRef);
  }
}