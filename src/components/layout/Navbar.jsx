import Link from 'next/link';
import { Activity } from 'lucide-react';

// Add this Link:
<Link href="/iot-network" className="flex items-center space-x-2 p-3 rounded-xl hover:bg-gray-800/50 transition-all">
  <Activity className="w-5 h-5" />
  <span>IoT Network</span>
</Link>
