/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { FileButtonProps } from '@mantine/core'
import { ActionIcon, createStyles, FileButton, Text, UnstyledButton } from '@mantine/core'
import { openModal } from '@mantine/modals'
import {
  IconAlertCircle,
  IconEye,
  IconPhoto,
  IconTrash,
  IconUpload,
  IconVideo,
} from '@tabler/icons-react'
import { useCallback, useRef, useState } from 'react'

import { ONE_MB_IN_BYTES } from '@/core/constants/numbers'
import { IMAGE_FILE_REGEX, VIDEO_FILE_REGEX } from '@/core/constants/regex'

import { FileInfo } from './file-info'

interface UploadFileInputProps extends Omit<FileButtonProps, 'children'> {
  label: string
  withAsterick?: boolean
  /**
   * The maximum file size to be allowed in MB
   */
  limit?: number
}
export const UploadFileInput = ({
  label,
  withAsterick,
  multiple,
  onChange,
  limit = 100,
  ...rest
}: UploadFileInputProps) => {
  const { classes, cx } = useStyles()
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | undefined>(undefined)
  const resetRef = useRef<() => void>(null)

  const handleChange = useCallback(
    (file: File | File[] | null) => {
      if (!file) return
      const newFiles = Array.isArray(file) ? file : Array.of(file)
      if (newFiles.some(file => file.size > limit * ONE_MB_IN_BYTES)) {
        setError(`File size should not exceed ${limit} MB`)
        return
      }
      setFiles(prevFiles => [...newFiles, ...prevFiles])
      setError(undefined)
      //@ts-ignore  File is an array if multiple is true else it is a single file
      onChange(file)
    },
    [limit, onChange]
  )

  const handleFileClick = useCallback((file: File) => {
    openModal({
      title: 'Preview',
      children: <FileInfo file={file} />,
    })
  }, [])

  const handleFileRemove = useCallback(
    (fileIndex: number) => {
      const updatedFiles = files.filter((file, index) => index !== fileIndex)
      if (updatedFiles.length === 0) resetRef.current?.()
      setFiles(updatedFiles)
      //@ts-ignore  File is an array if multiple is true else it is a single file
      onChange(multiple ? updatedFiles : updatedFiles.at(0) ?? null)
    },
    [files, multiple, onChange]
  )

  const renderPreviews = useCallback(
    () =>
      files.map((file, index) => (
        <li className={classes.preview} key={index}>
          {IMAGE_FILE_REGEX.test(file.name) ? (
            <IconPhoto />
          ) : VIDEO_FILE_REGEX.test(file.name) ? (
            <IconVideo />
          ) : (
            <IconAlertCircle color='red' />
          )}
          <div className='actions'>
            <ActionIcon onClick={() => handleFileClick(file)}>
              <IconEye />
            </ActionIcon>
            <ActionIcon onClick={() => handleFileRemove(index)}>
              <IconTrash color='red' />
            </ActionIcon>
          </div>
        </li>
      )),
    [classes.preview, files, handleFileClick, handleFileRemove]
  )

  return (
    <div>
      <Text fw='bold' mb={4} size='sm'>
        {label}{' '}
        {withAsterick ? (
          <Text color='red' component='span'>
            *
          </Text>
        ) : null}
      </Text>
      <div>
        <FileButton {...rest} onChange={handleChange} resetRef={resetRef}>
          {props => (
            <UnstyledButton
              className={cx(classes.uploadButton, error && classes.uploadButtonError)}
              {...props}
            >
              <IconUpload size={20} />
              <Text fw='bold'>Browse Files</Text>
            </UnstyledButton>
          )}
        </FileButton>
        {error ? (
          <Text color='red' my='xs' size='sm'>
            {error}
          </Text>
        ) : null}
        <ul className={classes.previews}>{renderPreviews()}</ul>
      </div>
    </div>
  )
}
const useStyles = createStyles(theme => ({
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingInline: theme.spacing.md,
    paddingBlock: theme.spacing.sm,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderCollapse: 'separate',
    borderRadius: theme.radius.sm,
    width: '100%',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
  },
  uploadButtonError: {
    borderColor: theme.colors.red[7],
  },
  previews: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  preview: {
    position: 'relative',
    width: 80,
    height: 60,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4],
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

    '& .actions': {
      position: 'absolute',
      opacity: 0,
      visibility: 'hidden',
      inset: 0,
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: '300ms ease-in-out',
    },
    '&:hover .actions': {
      opacity: 1,
      visibility: 'visible',
    },
  },
}))
