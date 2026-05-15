import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { DividerBlockComponent } from '@/blocks/Divider/Component'
import { FAQsListBlock } from '@/blocks/FAQsList/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MailingListSignupBlock } from '@/blocks/MailingListSignup/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { NextSeminarBlock } from '@/blocks/NextSeminar/Component'
import { PastSeminarsBlock } from '@/blocks/PastSeminars/Component'
import { PeopleGridBlock } from '@/blocks/PeopleGrid/Component'
import { SiteIntroBlock } from '@/blocks/SiteIntro/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  divider: DividerBlockComponent,
  faqsList: FAQsListBlock,
  formBlock: FormBlock,
  mailingListSignup: MailingListSignupBlock,
  mediaBlock: MediaBlock,
  nextSeminar: NextSeminarBlock,
  pastSeminars: PastSeminarsBlock,
  peopleGrid: PeopleGridBlock,
  siteIntro: SiteIntroBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              // Each block owns its own vertical padding via the Section
              // primitive — no wrapper margin here.
              return (
                // @ts-expect-error there may be some mismatch between the expected types here
                <Block {...block} key={index} disableInnerContainer />
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
