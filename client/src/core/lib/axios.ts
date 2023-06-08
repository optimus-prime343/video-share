import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_REQUEST_URL ?? 'http://localhost:8000/api/v1'

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
})
