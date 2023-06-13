import { createStyles } from '@mantine/core'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { VideoCategory } from '@/features/video/schemas/video'

export interface VideoCategoryListProps {
  categories: VideoCategory[]
}
export const VideoCategoryList = ({ categories }: VideoCategoryListProps) => {
  const router = useRouter()
  const { classes, cx } = useStyles()

  const isCategoryActive = useCallback(
    (categoryName: string) => router.query.category === categoryName,
    [router.query.category]
  )
  const renderVideoCategories = useCallback(
    () =>
      categories.map(category => (
        <Link
          className={cx(
            classes.category,
            isCategoryActive(category.name) && classes.categoryActive
          )}
          href={{
            pathname: '/',
            query: isCategoryActive(category.name) ? undefined : { category: category.name },
          }}
          key={category.id}
        >
          {category.name}
        </Link>
      )),
    [categories, classes.category, classes.categoryActive, cx, isCategoryActive]
  )
  return <div className={classes.categories}>{renderVideoCategories()}</div>
}

const useStyles = createStyles(theme => ({
  categories: {
    position: 'sticky',
    top: 0,
    left: 0,
    display: 'flex',
    gap: theme.spacing.md,
  },
  category: {
    textDecoration: 'none',
    color: 'inherit',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
    paddingInline: theme.spacing.xl,
    paddingBlock: theme.spacing.xs,
    borderRadius: theme.radius.xl,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
    },
  },
  categoryActive: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[7],
    color: theme.colorScheme === 'dark' ? theme.black : theme.white,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.dark[6],
    },
  },
}))
