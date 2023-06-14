import { Loader, Stack } from '@mantine/core'
import {
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react'

interface Props<T, E extends ElementType> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  as?: E
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => Promise<unknown>
  loading?: ReactNode
}
export type InfiniteScrollProps<T, E extends ElementType> = Props<T, E> &
  Omit<ComponentPropsWithRef<E>, keyof Props<T, E> | 'children'>

export const InfiniteScroll = <T, E extends ElementType>({
  items,
  renderItem,
  as,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  loading,
  ...rest
}: InfiniteScrollProps<T, E>) => {
  const Component = as ?? 'div'

  const lastItemRef = useRef<HTMLDivElement | null>(null)

  const renderItems = useCallback(
    () =>
      items.map((item, index) => (
        <div key={index.toString()} ref={index === items.length - 1 ? lastItemRef : null}>
          {renderItem(item, index)}
        </div>
      )),
    [items, lastItemRef, renderItem]
  )

  useEffect(() => {
    const { current: lastItem } = lastItemRef
    if (!lastItem) return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (hasNextPage && !isFetchingNextPage) {
            if (fetchNextPage) fetchNextPage()
          }
        }
      }
    })
    observer.observe(lastItem)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <Stack>
      <Component {...rest}>{renderItems()}</Component>
      {isFetchingNextPage ? loading ?? <Loader /> : null}
    </Stack>
  )
}
