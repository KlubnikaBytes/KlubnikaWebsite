export const locationsData = {
  stats: [
    { value: '1', label: 'Corporate Headquarters' },
    { value: '2', label: 'Regional Sales Centers' },
    { value: '3', label: 'International Sales Centers' },
    { value: 'Global', label: 'Market Coverage: India, Canada, UAE & USA' }
  ],
  detailCards: [
    {
      num: '01',
      title: 'Corporate Headquarters',
      country: 'India',
      badge: 'Primary',
      places: ['Kolkata, West Bengal'],
      address: '11th Floor, West Tower, Mani Casadona, International Financial Hub (CBD), Kolkata, West Bengal 700160'
    },
    {
      num: '02',
      title: 'Regional Sales Centers',
      country: 'India',
      badge: 'Regional Sales',
      places: ['Hinjewadi, Pune, Maharashtra 411057', 'Sector 63, Noida, Uttar Pradesh 201301']
    },
    {
      num: '03',
      title: 'International Sales Centers',
      country: 'Global',
      badge: 'International Sales',
      places: [
        'London, Ontario (Canada)',
        'Dubai (United Arab Emirates)',
        'Jersey City, New Jersey (United States)'
      ]
    }
  ],
  pins: [
    {
      id: 'kolkata',
      name: 'Kolkata, West Bengal',
      country: 'India',
      type: 'Corporate Headquarters',
      badge: 'Primary',
      region: 'india',
      lat: 22.5726,
      lng: 88.3639,
      isMain: true,
      address: '11th Floor, West Tower, Mani Casadona, International Financial Hub (CBD), Kolkata, West Bengal 700160'
    },
    {
      id: 'pune',
      name: 'Pune, Maharashtra',
      country: 'India',
      type: 'Regional Sales Center',
      badge: 'Regional Sales',
      region: 'india',
      lat: 18.5204,
      lng: 73.8567,
      isMain: false,
      address: 'Hinjewadi, Pune, Maharashtra 411057'
    },
    {
      id: 'noida',
      name: 'Noida, Uttar Pradesh',
      country: 'India',
      type: 'Regional Sales Center',
      badge: 'Regional Sales',
      region: 'india',
      lat: 28.5355,
      lng: 77.3910,
      isMain: false,
      address: 'Sector 63, Noida, Uttar Pradesh 201301'
    },
    {
      id: 'london-on',
      name: 'London, Ontario',
      country: 'Canada',
      type: 'International Sales Center',
      badge: 'International Sales',
      region: 'north-america',
      lat: 42.9849,
      lng: -81.2453,
      isMain: false,
      address: 'London, Ontario, Canada'
    },
    {
      id: 'dubai',
      name: 'Dubai',
      country: 'United Arab Emirates',
      type: 'International Sales Center',
      badge: 'International Sales',
      region: 'middle-east',
      lat: 25.2048,
      lng: 55.2708,
      isMain: false,
      address: 'Dubai, UAE'
    },
    {
      id: 'jersey-city',
      name: 'Jersey City, New Jersey',
      country: 'United States',
      type: 'International Sales Center',
      badge: 'International Sales',
      region: 'north-america',
      lat: 40.7178,
      lng: -74.0431,
      isMain: false,
      address: 'Jersey City, New Jersey, USA'
    }
  ]
};
