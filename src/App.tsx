import React, {useReducer, useRef, useEffect, useState} from 'react';
import styled from 'styled-components';
import Page from 'Components/Page';
import {StateContext, DispatchContext, countReducer} from './context/StateContext';
import AppContainerContext from './context/AppContainerRefContext';
import ContentInfoContext from './context/ContentInfoContext';
import DeviceStateContext from './context/DeviceStateContext';
import { animated } from 'react-spring';
import { isMobileOnly } from 'react-device-detect';
import styleConfig from './components/style';
interface IProp {
  className? : string
}

const _App: React.FC<IProp> = ({className}) => {
  let container = useRef<HTMLDivElement>(null)
  let [contentInfo, setContentInfo] = useState({})
  const [initial, setInitial] = useState(true)
  const [mobile, setMobile] = useState(false);

  let [state, dispatch] = useReducer(countReducer, {
    pages: ["4660cd52573c93aca601d205"],
    overlays: [false],
    highlights: [false]
  })

  useEffect(() => {
    if(initial){
      setInitial(false)
      if(isMobileOnly || window.innerWidth <= 800){
        setMobile(true)
      }
      fetch(`${process.env.PUBLIC_URL}/contents/content.json`)
      .then(res => res.json())
      .then(res => {
        let requests = []
        for(let page in res){
          requests.push(new Promise<[string, string]>(resolve => {
            fetch(`${process.env.PUBLIC_URL}/contents/${page}.md`)
            .then(response => response.text())
            .then(response => {
              resolve([page, response])
            });
          }))
        }
        Promise.all(requests).then(pageSource => {
          for(let [page, source] of pageSource){
            res[page].contentSource = source
          }
          setContentInfo(res)
        })

      });
    }
  }, [initial])

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {

    const overlayCount = Math.trunc(event.currentTarget.scrollLeft / (window.innerWidth/2 - 45))
    let tempOverlay = Array<boolean>(state.overlays.length)
    tempOverlay.fill(false)
    for(let i =0; i < overlayCount; i++){
      tempOverlay[i] = true
    }
    if(event.currentTarget.scrollLeft < (event.currentTarget.scrollWidth - event.currentTarget.clientWidth - (window.innerWidth/2 - 50))){
      tempOverlay[tempOverlay.length - 1] = true
    }
    dispatch({type: 'overlay', overlays: tempOverlay})

  }

  const resetPage = (event: React.UIEvent<HTMLElement>) => {
    dispatch({type: 'reset'})
  }

  return (
    <div className={className}>
      <header className="app-header">
        <p onClick={resetPage}>
          Root Notes
        </p>
      </header>
      <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
      <AppContainerContext.Provider value={container}>
      <ContentInfoContext.Provider value={contentInfo}>
      <DeviceStateContext.Provider value={mobile}>
      <animated.div ref={container} onScroll={ mobile ? ()=>{} : handleScroll} className="page-container">
          {state.pages.map((path, i) =>
            <Page key={i}
                  zindex={i}
                  contentPath={path}
                  overlay={state.overlays[i]}
                  highlight={state.highlights[i]}
                  width={mobile ? window.innerWidth : window.innerWidth/2}
            />
          )}
        </animated.div>
      </DeviceStateContext.Provider>
      </ContentInfoContext.Provider>
      </AppContainerContext.Provider>
      </DispatchContext.Provider>
      </StateContext.Provider>

    </div>
  );
}

const App = styled(_App)`
text-align: center;
display: flex;
flex-direction: column;
.app-header{
  height: 30px;
  width: 100vw;
  background-color: #fff;
  box-shadow: 0 3px 3px rgba(0,0,0,0.1);;
  font-weight: bold;
  font-family: "Times New Roman", Times, serif;
  font-size: 20px;
  z-index: 5;
  display: flex;
  align-items: center;
  p{
    margin: 0;
    padding: 0;
    margin-left: 14px;
  }
  transition: .3s ease-in-out;
  :hover{
    color: ${styleConfig.primaryColor};
  }
}

.page-container{
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: auto;
  height: calc(100vh - 30px);
  top:0;
  bottom: 0;
}


.page-container::-webkit-scrollbar {
  height: 16px;
  width: 16px;
}
.page-container:hover::-webkit-scrollbar-thumb {
  background: ${styleConfig.scrollbarHoverColor};
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 8px;
}

.page-container::-webkit-scrollbar-thumb {
  background: ${styleConfig.scrollbarColor};
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 8px;
}

`

export default App
