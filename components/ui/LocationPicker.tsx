'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

function LocationMarker({ setCoords }: { setCoords: (coords: { lat: number, lng: number }) => void }) {
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      setCoords(e.latlng)
    },
  })

  return position === null ? null : <Marker position={position} />
}

export default function LocationPicker({ onChange }: { onChange: (coords: { lat: number, lng: number }) => void }) {
  return (
    <div className="mt-4 h-[300px] w-full rounded-md overflow-hidden border border-gray-300">
      <MapContainer center={[24.8607, 67.0011]} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setCoords={onChange} />
      </MapContainer>
    </div>
  )
}
