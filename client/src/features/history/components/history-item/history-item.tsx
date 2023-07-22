import { Button, createStyles, Stack, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import parse from 'html-react-parser'
import Image from 'next/image'
import Link from 'next/link'

import type { IHistory } from '../../schemas/history'

export interface HistoryItemProps {
  history: IHistory
}
export const HistoryItem = ({ history }: HistoryItemProps) => {
  const { classes } = useStyles()
  return (
    <Link
      className={classes.root}
      href={{ pathname: '/watch', query: { id: history.video.id, time: history.timestamp } }}
    >
      <Stack align='flex-start'>
        <Image
          alt={history.video.title}
          height={200}
          src={history.video.thumbnail}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
          width={400}
        />
        <Stack className={classes.infoContainer} spacing='xs'>
          <Title order={4}>{history.video.title}</Title>
          <Text>{history.video.channel.name}</Text>
          <Text>{history.video.views} views</Text>
          <Text>{dayjs(history.createdAt).format('ll')}</Text>
          <Text className={classes.description} color='dimmed'>
            {parse(history.video.description?.trim() ?? '')}
          </Text>
        </Stack>
        <Button color='red' variant='outline'>
          Remove
        </Button>
      </Stack>
    </Link>
  )
}
const useStyles = createStyles(theme => ({
  root: {
    textDecoration: 'none',
    color: 'inherit',
    maxWidth: 'fit-content',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
    borderRadius: '8px',
    padding: theme.spacing.sm,
  },
  infoContainer: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
    padding: theme.spacing.xs,
    borderRadius: '8px',
    maxWidth: '400px',
  },
  description: {
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
  },
}))
