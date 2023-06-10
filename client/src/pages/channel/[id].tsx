import { useRouter } from 'next/router'

const ChannelDetailsPage = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  return <div>ChannelDetailsPage : {id}</div>
}
export default ChannelDetailsPage
