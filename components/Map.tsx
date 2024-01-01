'use client'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from 'react-leaflet';

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

  // // Fetch the markers from the database when the component mounts
  // useEffect(() => {
  //   fetch('/api/markers')
  //     .then(response => response.json())
  //     .then(data => {
  //       // Convert the 'location' string into a [latitude, longitude] array
  //       const markers = data.map(marker => ({
  //         ...marker,
  //         position: marker.location.split(' ').map(Number),
  //       }));
  //       setMarkers(markers);
  //     });
  // }, []);

  // create a custom icon
  const customIcon = new L.Icon({
    iconUrl: '/fountain-pen.png', // The URL to the image of the icon.
    iconSize: [30, 30], // Size of the icon in pixels.
    iconAnchor: [19, 95], // The coordinates of the "tip" of the icon (relative to its top left corner).
    popupAnchor: [0, -76], // The coordinates of the point from which popups will "open", relative to the icon anchor
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
            icon={customIcon}
            eventHandlers={{
              click: () => {
                window.location.href = marker.link;
              },
            }}
            >
            <Tooltip
              offset={[-15,-80]}
              direction={'left'}
              opacity={0.7}
              permanent
            >
              {marker.title}
            </Tooltip>
          </Marker>
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