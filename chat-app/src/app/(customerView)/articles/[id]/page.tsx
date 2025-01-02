import ArticleDetailPage from '@/components/(customerView)/Articles/ArticleDetailPage';

export default function ArticleDetailWrapper({ params }: { params: { id: string } }) {
  return (
    <div className="bg-[#F5EFE7] min-h-screen p-4">
      <ArticleDetailPage articleId={params.id} />
    </div>
  );
}