import React from 'react'
import Grid from '@material-ui/core/Grid'
import { Title } from 'components/Title'
import Content from 'components/Content'
import { OcrKeys } from './OcrKeys'
import { P2PKeys } from './P2PKeys'

export const KeysIndex = () => {
  React.useEffect(() => {
    document.title = 'Keys'
  }, [])
  return (
    <Content>
      <Grid container>
        <Grid item xs={12}>
          <Title>Keys</Title>
        </Grid>
        <OcrKeys />
        <P2PKeys />
      </Grid>
    </Content>
  )
}

export default KeysIndex
