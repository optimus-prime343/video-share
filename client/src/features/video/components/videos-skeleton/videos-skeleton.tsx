import { Flex, Grid, Skeleton, Stack } from '@mantine/core'
import React, { useCallback } from 'react'

export const VideosSkeleton = () => {
  const renderVideosSkeleton = useCallback(
    () =>
      Array.from({ length: 10 }).map((_, index) => (
        <Grid.Col key={index} span={3}>
          <Stack>
            <Skeleton height={150} width={350} />
            <Flex align='center' gap='md'>
              <Skeleton height={60} radius='xl' width={60} />
              <Flex direction='column' gap='xs' sx={{ flex: 1 }}>
                <Skeleton height={10} />
                <Skeleton height={10} width={120} />
                <Skeleton height={10} width={60} />
              </Flex>
            </Flex>
          </Stack>
        </Grid.Col>
      )),
    []
  )
  return <Grid>{renderVideosSkeleton()}</Grid>
}
