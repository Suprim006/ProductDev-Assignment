'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Users,
  MessageSquare,
  FileText,
  Calendar,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

interface Event {
  date: string;
  event_name: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_inquiries: 0,
    total_articles: 0,
    upcoming_events: 0,
  });
  const [barChartData, setBarChartData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch aggregate data from the backend
    axios.get('http://127.0.0.1:5000/api/dashboard')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching overview data:', error));

      fetch('http://127.0.0.1:5000/api/inquiries/status')
      .then((res) => res.json())
      .then((data) => setBarChartData(data));

      fetch('http://127.0.0.1:5000/api/inquiries/timeline')
      .then((res) => res.json())
      .then((data) => {
        setTimelineData(data.timeline);
        setEvents(data.events);
      });
  }, []);

  const quickActions = [
    { label: 'New Article', icon: FileText, color: '#213555', link: '/admin/articles' },
    { label: 'New Event', icon: Calendar, color: '#3E5879', link: '/admin/events' },
    { label: 'Add Past Solution', icon: BarChart2, color: '#D8C4B6', link: '/admin/solutions' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: '#213555' }}>
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-[#213555]">{stats.total_users}</p>
          <Users className="h-8 w-8 mt-2" style={{ color: '#213555' }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: '#3E5879' }}>
          <p className="text-sm text-gray-600">New Inquiries</p>
          <p className="text-2xl font-bold text-[#213555]">{stats.total_inquiries}</p>
          <MessageSquare className="h-8 w-8 mt-2" style={{ color: '#3E5879' }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: '#D8C4B6' }}>
          <p className="text-sm text-gray-600">Articles</p>
          <p className="text-2xl font-bold text-[#213555]">{stats.total_articles}</p>
          <FileText className="h-8 w-8 mt-2" style={{ color: '#D8C4B6' }} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: '#F5EFE7' }}>
          <p className="text-sm text-gray-600">Upcoming Events</p>
          <p className="text-2xl font-bold text-[#213555]">{stats.upcoming_events}</p>
          <Calendar className="h-8 w-8 mt-2" style={{ color: '#F5EFE7' }} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-[#213555] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.link}
              className="p-4 text-center bg-[#F5EFE7] rounded-lg hover:bg-[#D8C4B6] transition-colors"
            >
              <action.icon className="h-6 w-6 mx-auto mb-2" style={{ color: action.color }} />
              <span className="text-sm text-[#213555]">{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#213555] mb-4">Inquiries by Status</h3>
          {/* Placeholder for Bar Chart */}
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#213555] mb-4">Inquiries by Status</h3>
            <BarChart
              width={600}
              height={300}
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#213555" />
            </BarChart>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-[#213555] mb-4">Solutions by Industry</h3>
          {/* Timeline Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-[#213555] mb-4">Customer Inquiries Timeline</h3>
            <div className="relative w-full overflow-x-auto">
              <LineChart
                width={800} // Dynamically adjust based on data
                height={300}
                data={timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#213555" />
              </LineChart>
            </div>
            {/* Flags for events */}
            <div className="mt-4">
              <h4 className="text-md font-medium text-[#3E5879] mb-2">Events</h4>
              {events.map((event, index) => (
                <p key={index} className="text-sm text-gray-600">
                  {event.date}: {event.event_name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
