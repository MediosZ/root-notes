import React, {Dispatch} from 'react';

const StateContext = React.createContext<State>({
  pages: ["4660cd52573c93aca601d205"],
  overlays: [false],
  highlights: [false]
})
const DispatchContext = React.createContext<Dispatch<Action>>(() => null)


type State = {
  pages: Array<string>
  overlays: Array<boolean>
  highlights: Array<boolean>
}

type Action =
 | { type: 'increment', page: string}
 | { type: 'highlight', highlights: Array<boolean>}
 | { type: 'reset'}
 | { type: 'overlay', overlays: Array<boolean> }
 | { type: 'replace', page: string}

function countReducer(state: State, action: Action) {
  switch (action.type) {
    case 'increment': {
      if(state.pages.includes(action.page)){
        return state
      }
      let tempPages = state.pages
      let tempOverlays = state.overlays
      let tempHighlights = state.highlights
      tempPages.push(action.page)
      tempOverlays.push(false)
      tempHighlights.push(false)
      return {pages: tempPages, overlays: tempOverlays, highlights: tempHighlights}
    }
    case 'highlight': {
      return {pages: state.pages, overlays: state.overlays, highlights: action.highlights}
    }
    case 'overlay': {
      return {pages: state.pages, overlays: action.overlays, highlights: state.highlights}
    }
    case 'reset': {
      return {pages: ["4660cd52573c93aca601d205"], overlays: [false], highlights: [false]}
    }
    case 'replace': {
      return {pages: [action.page], overlays: [false], highlights: [false]}
    }
  }
}
export {DispatchContext, StateContext, countReducer}
