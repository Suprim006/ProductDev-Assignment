import EventDetailPage from '@/components/(customerView)/Events/EventDetailPage';

export default function EventDetailWrapper({ params }: { params: { id: string } }) {
  return (
    <div className="bg-[#F5EFE7] min-h-screen p-4">
      <EventDetailPage eventId={params.id} />
    </div>
  );
}