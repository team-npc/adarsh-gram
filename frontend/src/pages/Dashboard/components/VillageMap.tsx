import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Keep libraries as a const outside component to avoid reloading warnings
const GOOGLE_MAPS_LIBRARIES: ("places")[] = ['places'];

interface Village {
  id: string;
  name: string;
  district: string;
  status: 'registered' | 'under_assessment' | 'in_development' | 'adarsh_gram';
  latitude: number;
  longitude: number;
  problemCount: number;
}

const VillageMap: React.FC = () => {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'terrain'>('terrain');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(false);

  // Google Maps API Key from environment variable
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  // Debug: Log API key status
  React.useEffect(() => {
    console.log('=== Google Maps Debug Info ===');
    console.log('API Key present:', !!googleMapsApiKey);
    console.log('API Key length:', googleMapsApiKey.length);
    if (googleMapsApiKey) {
      console.log('API Key:', googleMapsApiKey);
    }
    console.log('Environment:', process.env.NODE_ENV);
  }, [googleMapsApiKey]);

  // Mock village data with actual coordinates (Sitapur district, Uttar Pradesh)
  const villages: Village[] = [
    {
      id: '1',
      name: 'Rampur',
      district: 'Sitapur',
      status: 'under_assessment',
      latitude: 27.5667,
      longitude: 80.6833,
      problemCount: 3,
    },
    {
      id: '2',
      name: 'Krishnanagar',
      district: 'Sitapur',
      status: 'in_development',
      latitude: 27.5800,
      longitude: 80.7000,
      problemCount: 1,
    },
    {
      id: '3',
      name: 'Shanti Nagar',
      district: 'Sitapur',
      status: 'adarsh_gram',
      latitude: 27.5500,
      longitude: 80.6500,
      problemCount: 0,
    },
  ];

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '12px',
  };

  // Center of the map (Sitapur district)
  const center = {
    lat: 27.5667,
    lng: 80.6833,
  };

  // Map options
  const mapOptions: google.maps.MapOptions = {
    mapTypeId: mapView === 'satellite' ? 'hybrid' : 'terrain',
    zoom: 11,
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: mapView === 'terrain' ? [] : undefined,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setIsLoaded(false);
  }, []);

  // Update map type when view changes
  React.useEffect(() => {
    if (map) {
      map.setMapTypeId(mapView === 'satellite' ? 'hybrid' : 'terrain');
    }
  }, [mapView, map]);

  const getMarkerIcon = (status: Village['status']) => {
    // Only create marker icon if Google Maps API is loaded
    if (!isLoaded || typeof google === 'undefined') {
      return undefined;
    }

    const colors = {
      registered: '#3B82F6',      // Blue
      under_assessment: '#EAB308',  // Yellow
      in_development: '#F97316',    // Orange
      adarsh_gram: '#10B981',       // Green
    };

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colors[status],
      fillOpacity: 0.9,
      strokeColor: '#FFFFFF',
      strokeWeight: 3,
      scale: 10,
    };
  };

  const getStatusLabel = (status: Village['status']) => {
    switch (status) {
      case 'registered':
        return 'Registered';
      case 'under_assessment':
        return 'Under Assessment';
      case 'in_development':
        return 'In Development';
      case 'adarsh_gram':
        return 'Adarsh Gram';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Village Locations</h3>
          <p className="text-gray-600 mt-1">Interactive map showing village development status</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMapView('terrain')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              mapView === 'terrain'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Terrain
          </button>
          <button
            onClick={() => setMapView('satellite')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              mapView === 'satellite'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Map Container */}
      {useIframe ? (
        // Fallback: Use Google Maps Embed API (works without billing)
        <div className="relative">
          <iframe
            title="Village Locations Map"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '12px' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=Sitapur,Uttar+Pradesh&zoom=11&maptype=${mapView === 'satellite' ? 'satellite' : 'roadmap'}`}
          />
          <div className="absolute top-4 right-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2 text-sm">
            <p className="font-semibold text-yellow-900">Using Fallback Map</p>
            <button
              onClick={() => {
                setUseIframe(false);
                window.location.reload();
              }}
              className="mt-2 text-xs text-yellow-700 underline hover:text-yellow-900"
            >
              Try JavaScript API again
            </button>
          </div>
        </div>
      ) : googleMapsApiKey ? (
        <LoadScript 
          googleMapsApiKey={googleMapsApiKey}
          libraries={GOOGLE_MAPS_LIBRARIES}
          onLoad={() => {
            setLoadError(null);
            console.log('✅ Google Maps loaded successfully');
          }}
          onError={(error) => {
            console.error('❌ Google Maps loading error:', error);
            setLoadError('Billing Not Enabled: Google Maps requires a billing account. Add payment method at Google Cloud Console (includes $200 free monthly credit).');
            // Auto-switch to iframe after 3 seconds
            setTimeout(() => setUseIframe(true), 3000);
          }}
          loadingElement={
            <div className="h-96 bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
                <p className="text-xs text-gray-500 mt-2">If this takes too long, we'll load a fallback map</p>
              </div>
            </div>
          }
        >
          {loadError ? (
            <div className="relative h-96 bg-red-50 rounded-xl border-2 border-red-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-lg px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Google Maps API Error</h3>
                  <p className="text-sm text-red-700 mb-4">{loadError}</p>
                  <div className="bg-white rounded-lg p-4 text-left border border-red-200 mb-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Most Common Issue:</p>
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-3">
                      <p className="text-xs font-bold text-yellow-900">⚠️ BILLING ACCOUNT REQUIRED</p>
                      <p className="text-xs text-yellow-800 mt-1">Google Maps requires a billing account (even with free $200/month credit)</p>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 mb-2">Quick Fixes:</p>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                      <li>Go to <a href="https://console.cloud.google.com/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Billing</a> and add payment method</li>
                      <li>Enable <strong>Maps JavaScript API</strong> and <strong>Maps Embed API</strong></li>
                      <li>Remove ALL API key restrictions temporarily</li>
                      <li>Wait 2-5 minutes, then refresh this page</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button
                      onClick={() => setUseIframe(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Use Fallback Map (Works Now!)
                    </button>
                    <a 
                      href="https://console.cloud.google.com/google/maps-apis/credentials"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Fix API Key
                      <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              options={mapOptions}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
            {/* Village Markers */}
            {villages.map((village) => (
              <Marker
                key={village.id}
                position={{
                  lat: village.latitude,
                  lng: village.longitude,
                }}
                icon={getMarkerIcon(village.status)}
                onClick={() => setSelectedVillage(village)}
                title={village.name}
              />
            ))}

            {/* Info Window */}
            {selectedVillage && (
              <InfoWindow
                position={{
                  lat: selectedVillage.latitude,
                  lng: selectedVillage.longitude,
                }}
                onCloseClick={() => setSelectedVillage(null)}
              >
                <div className="p-2">
                  <h4 className="font-semibold text-gray-900 mb-1">{selectedVillage.name}</h4>
                  <p className="text-sm text-gray-600">{selectedVillage.district} District</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Status: {getStatusLabel(selectedVillage.status)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedVillage.problemCount} pending reports
                  </p>
                </div>
              </InfoWindow>
            )}
            </GoogleMap>
          )}
        </LoadScript>
      ) : (
        <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-700 font-medium text-sm mb-2">Google Maps API Key Required</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Please add your Google Maps API key to the <code className="bg-gray-200 px-1 py-0.5 rounded">.env.local</code> file:
              </p>
              <code className="block mt-2 text-xs bg-gray-100 p-2 rounded text-left text-gray-700">
                REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
              </code>
              <a 
                href="https://console.cloud.google.com/google/maps-apis/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Get API Key →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-600">Registered</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-600">Under Assessment</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-600">In Development</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow"></div>
          <span className="text-gray-600">Adarsh Gram</span>
        </div>
      </div>
    </div>
  );
};

export default VillageMap;