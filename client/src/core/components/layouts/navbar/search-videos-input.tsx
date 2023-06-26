import { ActionIcon, TextInput } from '@mantine/core'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import type { KeyboardEvent} from 'react';
import { useState } from 'react'
import { useCallback } from 'react'

export const SearchVideosInput = () => {
  const [query, setQuery] = useState('')

  const router = useRouter()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        if (!query) return
        router.push({
          pathname: '/',
          query: { search: query },
        })
      }
    },
    [query, router]
  )

  const handleClearSearch = useCallback(() => {
    setQuery('')
    router.push('/')
  }, [router])

  return (
    <TextInput
      icon={<IconSearch />}
      miw={600}
      onChange={event => setQuery(event.currentTarget.value)}
      onKeyDown={handleKeyDown}
      placeholder='Search videos'
      radius='xl'
      rightSection={
        query ? (
          <ActionIcon onClick={handleClearSearch} size='sm'>
            <IconX />
          </ActionIcon>
        ) : null
      }
      size='md'
      value={query}
    />
  )
}
