import dynamic from 'next/dynamic';
import MapTitle from '../components/MapTitle';

const DynamicMap = dynamic(() => import('../components/Map'), {
  ssr: false
});

export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <MapTitle />
      <div style={{ flex: 1 }}>
        <DynamicMap />
      </div>
    </main>
  )
}