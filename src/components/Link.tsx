import React, {useContext, useState, useEffect} from 'react';
import styled from 'styled-components';
import { StateContext, DispatchContext } from '../context/StateContext';
import { getHash } from '../utils';
import AppContainerRefContext from '../context/AppContainerRefContext';
import IScrollOptions from './ScrollProps';
import { ScrollToHOC } from "react-scroll-to";
import DeviceStateContext from '../context/DeviceStateContext';
import styleConfig from './style';

interface LinkProp {
  className? : string
  src: string
  dest: string
  scroll: (props?: IScrollOptions) => void
}

interface LinkTextProp {
  className? : string
  src: string
  status: LinkStatus
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  mouseEvent: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const _LinkText: React.FC<LinkTextProp> = ({className, src, onClick, mouseEvent}) => {
  return(
    <span className={className} onClick={onClick} onMouseEnter={mouseEvent} onMouseLeave={mouseEvent}>
      {src}
    </span>
  )
}

const LinkText = styled(_LinkText)`
  background-color: ${props => {
    switch(props.status){
      case 'opened':{
        return styleConfig.accentColor
      }
      case 'over': {
        return styleConfig.accentColor
      }
      case 'default': {
        return '#fff'
      }
      case 'openOver': {
        return styleConfig.accentColor
      }
    }
  }};
  border-radius: ${props => props.status === 'default' ? 0 : 5}px;
  color: ${props => props.status === 'default' ? styleConfig.primaryColor : '#333'};
  transition: background-color .3s ease-in-out, color .3s ease-in-out;
}
`

type LinkStatus =
| 'default'
| 'over'
| 'opened'
| 'openOver'

const _Link: React.FC<LinkProp> = ({className, src, dest, scroll}) => {
  const dispatch = useContext(DispatchContext)
  let state = useContext(StateContext)
  const ref = useContext(AppContainerRefContext)
  const mobile = useContext(DeviceStateContext)

  let [linkStatus, setLinkStatus] = useState<LinkStatus>('default')

  useEffect(()=>{
    if( state.pages.includes(`${getHash(dest)}`) ){
      setLinkStatus('opened')
    }

  }, [state.pages, dest])



  const goto = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const pageHash = `${getHash(dest)}`

    if(mobile){
      dispatch({type: "replace", page: pageHash})
      setLinkStatus('openOver')
      return
    }

    if( ! state.pages.includes(pageHash) ){
      dispatch({type: "increment", page: pageHash})
      setLinkStatus('openOver')

    }
    else{
      let index = state.pages.indexOf(pageHash)
      //console.log(`page ${dest} exists in ${index} pages`);
      scroll({
        ref: ref,
        x: (index-0.5) * window.innerWidth / 2,
        y: 0,
         smooth: true
      })

      //ref.current?.scrollTo((index-0.5) * window.innerWidth / 2, 0);
    }
  }

  const mouseOver = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(linkStatus === 'opened'){
      if(!mobile){
        const pageHash = `${getHash(dest)}`
        let index = state.pages.indexOf(pageHash)
        let tempHighlights = state.highlights
        tempHighlights[index] = true
        dispatch({type: "highlight", highlights: tempHighlights})
      }

      // enter open over status
      setLinkStatus('openOver')
    }
    else if(linkStatus === 'openOver'){
      if(!mobile){
        const pageHash = `${getHash(dest)}`
        let index = state.pages.indexOf(pageHash)
        let tempHighlights = state.highlights
        tempHighlights[index] = false
        dispatch({type: "highlight", highlights: tempHighlights})
      }

      // exit open over status
      setLinkStatus('opened')
    }
    else if(linkStatus === 'over'){
      if(state.pages.includes(`${getHash(dest)}`)){
        setLinkStatus('opened')
      }
      else{
        setLinkStatus('default')
      }
    }
    else{
      setLinkStatus('over')
    }

  }

  return (
    <LinkText
      className={className}
      onClick={goto}
      mouseEvent={mouseOver}
      src={src}
      status={linkStatus}
    />
  )
}

const Link = styled(_Link)`

`;

export default ScrollToHOC(Link);
