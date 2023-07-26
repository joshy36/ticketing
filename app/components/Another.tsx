'use client'
import useSWR from 'swr'
 
const fetcher = (...args) => fetch(...args).then((res) => res.json())
 
export default function Profile() {
  const { data, error } = useSWR('/api/data', fetcher)
 
  console.log('DATA', data[0].name)
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
 
  return (
    <div>
      <h1>{data[0].name}</h1>
      <p>{data[0].description}</p>
    </div>
  )
}