import { Table } from '@mantine/core'
import { useMemo } from 'react'

import { AdminSideBar } from '@/core/components/layouts/admin-sidebar'
import { VideoRow } from '@/features/admin/components/videos/video-row'
import { useAdminVideos } from '@/features/admin/hooks/use-admin-videos'

const AdminDashboardVideosPage = () => {
  const { data: paginatedVideos } = useAdminVideos()

  const rows = useMemo(
    () =>
      (paginatedVideos?.videos ?? []).map(video => <VideoRow key={video.id} video={video} />),
    [paginatedVideos?.videos]
  )
  return (
    <AdminSideBar>
      <Table striped>
        <thead>
          <tr>
            <th>Uploaded By</th>
            <th>Title</th>
            <th>Views</th>
            <th>Likes</th>
            <th>Dislikes</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </AdminSideBar>
  )
}

export default AdminDashboardVideosPage
