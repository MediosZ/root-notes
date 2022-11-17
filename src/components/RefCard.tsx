import React, {useContext, useState, useEffect} from 'react';
import styled from 'styled-components';
import { StateContext, DispatchContext } from '../context/StateContext';
import AppContainerRefContext from '../context/AppContainerRefContext';
import ContentInfoContext from '../context/ContentInfoContext';
import IScrollOptions from './ScrollProps';
import { ScrollToHOC } from "react-scroll-to";
import matter from 'gray-matter';
import DeviceStateContext from '../context/DeviceStateContext';
import styleConfig from './style';

interface IProp {
  className?: string
  pageHash: string
  refHash: string
  scroll:  (props?: IScrollOptions) => void
}

const _RefCard: React.FC<IProp> = ({className, pageHash, refHash, scroll}) => {

  const contentInfo = useContext(ContentInfoContext)
  const containerRef = useContext(AppContainerRefContext)
  const dispatch = useContext(DispatchContext)
  const state = useContext(StateContext)
  const mobile = useContext(DeviceStateContext)
  const [initial, setInitial] = useState(true)
  const [pageTitle, setPageTitle] = useState("")
  const [pageAbstract, setPageAbstract] = useState("")


  useEffect(() => {
    if(initial){
      setInitial(false)
      const pageSource = contentInfo[refHash].contentSource
      const parsed = matter(pageSource)
      setPageTitle(parsed.data.title)
      setPageAbstract(parsed.data.abstract)
    }
  }, [setInitial, contentInfo, initial, refHash])

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(mobile){
      dispatch({type: 'replace', page: refHash})
      return
    }

    if( ! state.pages.includes(refHash) ){
      dispatch({type: "increment", page: refHash})
    }
    else{
      let index = state.pages.indexOf(refHash)
      scroll({
        ref: containerRef,
        x: (index-0.5) * window.innerWidth / 2,
        y: 0,
        smooth: true
      })
    }
  }

  return (
    <div className={className} onClick={handleClick} >
      <p className="title">{pageTitle}</p>
      <p className="abstract">{pageAbstract}</p>
    </div>
  )
}


const RefCard = styled(_RefCard)`
font-family: "Lucida Console";
background-color: ${styleConfig.refCardColor};
margin: 10px 0 10px 0;
display: flex;
flex-direction: column;
justify-content: start;
align-items: flex-start;
box-shadow: 0 0 3px rgba(60,60,60,0.3);
transition: box-shadow .3s ease-in-out;
width: 80%;
max-width: 300px;
border-radius: 5px;
p.title{
  text-align: start;
  font-size: 16px;
  flex: 1;
  margin: 4px;
  transition: font-size .5s ease-in-out;
}

p.abstract{
  font-size: 12px;
  text-align: start;
  flex: 3;
  margin: 4px;
  color: #666;
  transition: font-size .5s ease-in-out;
}

:hover{
  box-shadow: 0 0 5px rgba(60,60,60,0.5);
  transition: box-shadow .3s ease-in-out;
  p.title{
    font-size: 16.5px;
    transition: font-size .5s ease-in-out;
  }
  p.abstract{
    font-size: 12.5px;
    transition: font-size .5s ease-in-out;
  }
}

`;

export default ScrollToHOC(RefCard);
