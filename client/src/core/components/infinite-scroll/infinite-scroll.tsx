import { Loader, Stack } from '@mantine/core'
import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactNode} from 'react';
import {
  useCallback,
  useEffect,
  useRef,
} from 'react'

interface Props<T, E extends ElementType, W extends ElementType> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  as?: E
  wrapperAs?: W
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  fetchNextPage?: () => Promise<unknown>
  loading?: ReactNode
  wrapperProps?: ComponentPropsWithoutRef<W>
}
export type InfiniteScrollProps<T, E extends ElementType, W extends ElementType> = Props<
  T,
  E,
  W
> &
  Omit<ComponentPropsWithRef<E>, keyof Props<T, E, W> | 'children'>

export const InfiniteScroll = <T, E extends ElementType, W extends ElementType>({
  items,
  renderItem,
  as,
  wrapperAs,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  loading,
  wrapperProps,
  ...rest
}: InfiniteScrollProps<T, E, W>) => {
  const Component = as ?? 'div'

  const lastItemRef = useRef<HTMLDivElement | null>(null)

  const renderItems = useCallback(() => {
    const Wrapper = wrapperAs ?? 'div'
    return items.map((item, index) => (
      <Wrapper
        key={index.toString()}
        ref={index === items.length - 1 ? lastItemRef : null}
        {...wrapperProps}
      >
        {renderItem(item, index)}
      </Wrapper>
    ))
  }, [items, renderItem, wrapperAs, wrapperProps])

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
