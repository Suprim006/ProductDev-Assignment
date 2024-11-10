import Image from "next/image";
import ChatApp from '@/components/ChatApp';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <ChatApp />
    </main>
  );
}
