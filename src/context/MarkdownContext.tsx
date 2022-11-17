import React from 'react';
import Markdown from 'markdown-it';
import backlinkPlugin from '../components/MarkdownItPlugin';

const markdown = new Markdown().use(backlinkPlugin, "backlink")

export const markdownContext = React.createContext(
  markdown // default value
)
