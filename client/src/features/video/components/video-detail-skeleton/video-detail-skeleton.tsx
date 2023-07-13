import { createStyles, Skeleton, Stack } from '@mantine/core'
import React from 'react'

export const VideoDetailSkeleton = () => {
  const { classes } = useStyles()
  return (
    <div className={classes.root}>
      <Stack>
        {/* Video player skeleton */}
        <Skeleton height={600} />
        {/* Channel skeleton  */}
        <Skeleton height={60} />
        {/* Comments skeleton */}
        <Skeleton height={40} width={'70%'} />
        <Skeleton height={40} width={'40%'} />
        <Skeleton height={40} width={'90%'} />
        <Skeleton height={40} width={'30%'} />
        <Skeleton height={40} width={'10%'} />
      </Stack>
      <Stack>
        {/* Suggested videos skeletons */}
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
        <Skeleton height={120} />
      </Stack>
    </div>
  )
}
const useStyles = createStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
}))
