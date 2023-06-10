import { useVideos } from '@/features/video/hooks/use-videos'

const HomePage = () => {
  useVideos()
  return <div>HomePage</div>
}
export default HomePage
