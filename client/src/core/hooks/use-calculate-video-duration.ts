import { useCallback, useEffect, useState } from 'react'

export const useCalculateVideoDuration = (url: string): string => {
  const [duration, setDuration] = useState<string>('00:00')

  const calculateVideoDuration = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = () => {
        const duration = video.duration
        const minutes = Math.floor(duration / 60)
        const seconds = Math.floor(duration % 60)
        const paddedMinutes = minutes.toString().padStart(2, '0')
        const paddedSeconds = seconds.toString().padStart(2, '0')
        resolve(`${paddedMinutes}:${paddedSeconds}`)
      }

      video.onerror = () => {
        reject(new Error('Failed to load video'))
      }
      video.src = url
    })
  }, [url])

  useEffect(() => {
    calculateVideoDuration().then(setDuration).catch(console.error)
  }, [calculateVideoDuration])

  return duration
}
