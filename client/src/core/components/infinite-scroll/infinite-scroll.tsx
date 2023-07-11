import { Loader, Stack } from '@mantine/core'
import { type ReactNode, useEffect, useRef } from 'react'

export interface InfiniteScrollProps<T> {
  children: ReactNode
  hasMore: boolean | undefined
  isLoadingMore: boolean | undefined
  threshold?: number
  onLoadMore: () => T | Promise<T>
}
export const InfiniteScroll = <T = void,>({
  children,
  hasMore,
  isLoadingMore,
  threshold = 300,
  onLoadMore,
}: InfiniteScrollProps<T>) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !isLoadingMore && hasMore) {
          onLoadMore()
        }
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])

  return (
    <Stack>
      {children}
      <div
        ref={ref}
        style={{
          height: threshold,
          display: isLoadingMore || !hasMore ? 'none' : 'block',
        }}
      />
      {isLoadingMore ? <Loader /> : null}
    </Stack>
  )
}
