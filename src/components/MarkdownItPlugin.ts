import MarkdownIt from "markdown-it";
import StateInline from 'markdown-it/lib/rules_inline/state_inline';

export default function ins_plugin(md: MarkdownIt) {

  function tokenize(state: StateInline, slient: boolean){
    var pos, token, contentStart = 0, contentEnd = 0,
      startPos = state.pos,
      posMax = state.posMax,
      inlineStr = state.src;

    if (inlineStr.charCodeAt(startPos) !== 0x5B /* [ */ && inlineStr.charCodeAt(startPos + 1) !== 0x5B /* [ */) {
      return false
    }

    contentStart = startPos + 2
    let found = false
    for(pos = contentStart; pos < posMax; pos++){
      if(inlineStr.charCodeAt(pos) === 0x5D && inlineStr.charCodeAt(pos + 1) === 0x5D){
        contentEnd = pos;
        found = true;
        break;
      }
    }
    if( !found ){
      return false;
    }
    let content = inlineStr.slice(contentStart, contentEnd);

    if(slient){
      return false;
    }
    state.pos = contentStart;
    state.posMax = contentEnd;

    token = state.push('backlink_open', 'a', 1)
    token.attrJoin("class", "backlink");
    token.attrJoin("href", `${window.location.pathname}?stacked=${content}`);
    state.md.inline.tokenize(state)
    state.push('backlink_close', 'a', -1)

    state.pos = contentEnd + 2;
    state.posMax = posMax

    return true;
  }

  md.inline.ruler.before('emphasis', 'backlink', tokenize)

};
