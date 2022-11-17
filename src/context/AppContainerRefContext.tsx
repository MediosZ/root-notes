import React, {RefObject, createRef} from 'react';

let initialRef = createRef<HTMLDivElement>()
const AppContainerRefContext = React.createContext<RefObject<HTMLDivElement>>(initialRef)

export default AppContainerRefContext
