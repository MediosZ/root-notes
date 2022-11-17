import React from 'react';

interface PageInfo{
  contentSource: string
  backLinks: Array<string>
  containedLinks: Array<[string, string]>
}
interface ContentInfo {
  [Key: string]: PageInfo
}

const ContentInfoContext = React.createContext<ContentInfo>({})

export default ContentInfoContext
