'use client'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import MarkerIcon from '../node_modules/leaflet/dist/images/marker-icon.png';
import MarkerShadow from '../node_modules/leaflet/dist/images/marker-shadow.png';

const Map = () => {
  const [markers, setMarkers] = useState<Array<{position: [number, number], link: string, title: string}>>([]);
  const [tempPin, setTempPin] = useState<[number, number] | null>(null);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  // center of the US by default
  const defaultLocation: [number, number] = [39.50, -98.35];

  const addPin = () => {
    if (tempPin) {
      setMarkers([...markers, {position: tempPin, link, title}]);
      setTempPin(null);
      setOpen(false);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        setTempPin([e.latlng.lat, e.latlng.lng]);
        setOpen(true);
      },
    });
    return null;
  };

  // load the leaflet-providers library for custom map styling
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet-providers@latest/leaflet-providers.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // create a custom icon
  const customIcon = new L.Icon({
    iconUrl: 'path/to/image.png', // The URL to the image of the icon.
    iconRetinaUrl: 'path/to/image@2x.png', // Optional: The URL to a retina sized version of the icon image.
    iconSize: [38, 95], // Size of the icon in pixels.
    iconAnchor: [22, 94], // The coordinates of the "tip" of the icon (relative to its top left corner).
    popupAnchor: [-3, -76], // The coordinates of the point from which popups will "open", relative to the icon anchor.
    shadowUrl: 'path/to/shadow.png', // Optional: The URL to the image of the icon shadow.
    shadowSize: [68, 95], // Optional: Size of the shadow image in pixels.
    shadowAnchor: [22, 94] // Optional: The coordinates of the "tip" of the shadow (relative to its top left corner).
  });

  return (
    <div>
      <MapContainer style={{ height: '100vh', width: '100vw' }} center={defaultLocation} zoom={5}>
        <MapEvents />
        <TileLayer
          attribution='&copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
        />
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={marker.position}
            icon={
              new L.Icon({
                iconUrl: MarkerIcon.src,
                iconRetinaUrl: MarkerIcon.src,
                iconSize: [25, 41],
                iconAnchor: [12.5, 41],
                popupAnchor: [0, -41],
                shadowUrl: MarkerShadow.src,
                shadowSize: [41, 41],
              })
            }
          />
        ))}
        </MapContainer>
        <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Pin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="link"
            label="Link"
            type="text"
            fullWidth
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <TextField
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addPin} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Map