import { useState } from 'react'

export default function Contact() {
  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold brand-font">Contact Us</h1>
        <p className="text-gray-600 mt-2">We’d love to hear from you. Reach us using the details below.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="text-sm uppercase tracking-wide text-gray-500">Customer Care</div>
            <div className="mt-2 text-xl font-semibold">+91 88888 88888</div>
            <div className="mt-1 text-gray-600">9:00 AM – 9:00 PM, all days</div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="text-sm uppercase tracking-wide text-gray-500">Restaurant</div>
            <div className="mt-2 text-xl font-semibold">+91 99999 99999</div>
            <div className="mt-1 text-gray-600">Road No. 12, Banjara Hills, Hyderabad</div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="text-sm uppercase tracking-wide text-gray-500">Email</div>
            <div className="mt-2 text-xl font-semibold break-all">support@manaruchulu.com</div>
            <div className="mt-1 text-gray-600 break-all">hello@manaruchulu.com</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="bg-white border rounded-xl p-0 shadow-sm overflow-hidden">
            <iframe
              title="Map"
              className="w-full h-72 lg:h-[420px]"
              src="https://www.google.com/maps?q=banjara%20hills%20hyderabad&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Visit Us</h2>
            <p className="text-gray-600 mt-2 leading-relaxed">
              We are located in the heart of Banjara Hills. Parking is available. For large group bookings or events, please call our restaurant line.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>• Dine-in hours: 11:00 AM – 11:00 PM</li>
              <li>• Takeaway available all day</li>
              <li>• Catering on request</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Branches Across India</h2>
            <p className="text-gray-600 mt-2">We’re expanding rapidly and already serve customers in multiple cities.</p>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-800">
              <div className="border rounded-lg px-4 py-3">Hyderabad</div>
              <div className="border rounded-lg px-4 py-3">Bengaluru</div>
              <div className="border rounded-lg px-4 py-3">Chennai</div>
              <div className="border rounded-lg px-4 py-3">Mumbai</div>
              <div className="border rounded-lg px-4 py-3">Delhi</div>
              <div className="border rounded-lg px-4 py-3">Pune</div>
              <div className="border rounded-lg px-4 py-3">Vizag</div>
              <div className="border rounded-lg px-4 py-3">Andhra</div>
              <div className="border rounded-lg px-4 py-3">Kolkata</div>
            </div>
            <p className="text-gray-600 mt-3">Looking for a branch near you? Call our Customer Care for directions and timings.</p>
          </div>
        </div>
      </div>
    </div>
  )
}














