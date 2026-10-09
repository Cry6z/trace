import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Parameter lat dan lng wajib disertakan' },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: 'Koordinat tidak valid' },
      { status: 400 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'TraceBengkulu/1.0 (contact@trace-bengkulu.id)',
          'Accept': 'application/json',
          'Accept-Language': 'id, en',
        },
        signal: controller.signal,
        next: { revalidate: 3600 },
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Nominatim error status: ${res.status}`);
    }

    const data = await res.json();
    const addr = data.address || {};

    const road =
      addr.road ||
      addr.pedestrian ||
      addr.path ||
      addr.street ||
      addr.amenity ||
      data.name ||
      '';

    const village =
      addr.village ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.quarter ||
      'Kota Bengkulu';

    const district =
      addr.county ||
      addr.city_district ||
      addr.city ||
      'Kota Bengkulu';

    const city =
      addr.city ||
      addr.town ||
      addr.municipality ||
      'Kota Bengkulu';

    // Format nama jalan / alamat ringkas yang natural
    let formattedAddress = '';
    if (road && village && !road.toLowerCase().includes(village.toLowerCase())) {
      formattedAddress = `${road}, ${village}`;
    } else if (road) {
      formattedAddress = `${road}, ${district}`;
    } else if (village) {
      formattedAddress = `${village}, Kec. ${district}`;
    } else {
      formattedAddress = `Kawasan ${district}, ${city}`;
    }

    return NextResponse.json({
      success: true,
      address: formattedAddress,
      road: road || 'Jalan Sekitar',
      village,
      district,
      city,
      displayName: data.display_name || formattedAddress,
      coords: { lat: latitude, lng: longitude },
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    // Graceful fallback agar aplikasi tetap berjalan efektif
    return NextResponse.json({
      success: false,
      address: `Titik Terpilih (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
      road: 'Jalan Sekitar',
      village: 'Kota Bengkulu',
      district: 'Bengkulu',
      city: 'Kota Bengkulu',
      coords: { lat: latitude, lng: longitude },
    });
  }
}
