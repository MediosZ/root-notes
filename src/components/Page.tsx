import React, { useState, useEffect, useContext} from 'react';
import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';
import Link from './Link';
import AppContainerRefContext from '../context/AppContainerRefContext';
import ContentInfoContext from '../context/ContentInfoContext';
import { StateContext } from '../context/StateContext';
import {animated, useTransition} from 'react-spring';
import matter from 'gray-matter';
import { ScrollToHOC } from "react-scroll-to";
import IScrollOptions from './ScrollProps';
import RefCard from './RefCard';
import styleConfig from './style';

interface IProp {
  className? : string
  contentPath: string
  zindex: number
  overlay: boolean
  highlight: boolean
  width: number
  scroll: (props?: IScrollOptions) => void
}


const _Page: React.FC<IProp> = ({className, contentPath, zindex, overlay, scroll}) => {
  const [mdSrc, setMdSrc] = useState("");
  const [header, setHeader] = useState<any>({})
  const [initial, setInitial] = useState(true)
  const [hash, setHash] = useState<string>("")
  const [backlinks, setBacklinks] = useState<Array<string>>([])
  const ref = useContext(AppContainerRefContext)
  const contentInfo = useContext(ContentInfoContext)
  let state = useContext(StateContext)

  useEffect(() => {
    if(contentInfo[contentPath]){
      let parsed = matter(contentInfo[contentPath].contentSource)
      setMdSrc(parsed.content)
      setHeader(parsed.data)
    }
    else{
      fetch(`${process.env.PUBLIC_URL}/contents/${contentPath}.md`)
      .then(res => res.text())
      .then(res => {
        let parsed = matter(res)
        setMdSrc(parsed.content)
        setHeader(parsed.data)
      });
    }
    setHash(contentPath)
    if(contentInfo[contentPath]){
      setBacklinks(contentInfo[contentPath].backLinks)
    }

    if(initial){
      setInitial(false)
      scroll({ ref: ref, x: ref.current?.scrollWidth, y: 0, smooth: true})
    }

  }, [contentPath, initial, contentInfo, hash, ref, backlinks, scroll])


  const handleTitle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>{
    let index = state.pages.indexOf(hash)
    //console.log(`page ${dest} exists in ${index} pages`);
    scroll({
      ref: ref,
      x: (index-0.5) * window.innerWidth / 2,
      y: 0,
       smooth: true
    })
  }

  const transitions = useTransition(overlay, null, {
    from: { position: 'absolute', opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: {
      duration: 30
    }
    }
  )

  return (
    <animated.div className={className}>
      {
        transitions.map(({ item, key, props }) =>
        item && <animated.div key={key} style={props} className="overlay">
          <p className="title" onClick={handleTitle} >{header.title || "title"}</p>
        </animated.div>
        )
      }

      <div className="markdown-container">
        <Markdown children={mdSrc}
          options={{
            overrides: {
                Link: {
                    component: Link,
                }},

          }}
        />
      </div>
      <div className="backlink-container">
        {backlinks.length !== 0
          && <p className="hint">These pages contain the links to current page.</p>
        }
        {backlinks.map((link,i) => <RefCard key={i}  pageHash={hash} refHash={link}/>)}
      </div>
    </animated.div>
  );
}


const Page = styled(_Page)`
text-align: center;
max-width: ${props => props.width}px;
min-width: ${props => props.width}px;
overflow-y: auto;
position: sticky;
background-color: #fff;
box-shadow: 0px 0px 15px 3px rgba(0,0,0,0.1);
left: ${props => props.zindex * 40}px;
right: -${props => props.width - 40}px;

.markdown-container{
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  text-align: start;
  margin: 0;
  padding: 28px 18px 28px 18px;
  h1{
    font-size: 24px;
  }
}

.backlink-container {
  border-top: solid thin #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  margin: 0;
  padding: 6px 18px 6px 18px;
  .hint{
    margin: 0;
    padding: 0;
  }
}

.overlay{
  position: absolute;
  background-color: #fff;
  height: 100%;
  width: 100%;
  z-index: 10;
  margin: 0;
  padding: 0;
  top: 30px;
  transition: opacity .5s ease-in-out;
  opacity: ${props => props.overlay ? 1 : 0};
  .title{
    font-size: 17px;
    letter-spacing: 0.03em;
    font-weight: 700;
    line-height: 40px;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    margin: 0;
    padding: 0;
    padding-top: 16px;
    writing-mode: vertical-lr;
    width: 40px;
    height: calc(100vh - 46px);
    background-color: transparent;
    color: ${props => props.highlight ? styleConfig.primaryColor : "#333"};
    overflow: hidden;
    text-align: start;
    transition: .3s ease-in-out;
    :hover{
      color: ${styleConfig.primaryColor};
    }
  }
}

::-webkit-scrollbar {
  height: 16px;
  width: 16px;
}
:hover::-webkit-scrollbar-thumb {
  background: ${styleConfig.scrollbarHoverColor};
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: ${styleConfig.scrollbarColor};
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 8px;
}



`

export default ScrollToHOC(Page);
