/** @format */

import React from 'react'
import GlobalStore from './global'
import TagViewStore from './tag-view'
// import cardStore from './cardStore'

const Store: React.FC = prpos => {
  return (
    <GlobalStore.Provider>
      <TagViewStore.Provider>{prpos.children}</TagViewStore.Provider>
    </GlobalStore.Provider>
  )
}
export default Store
