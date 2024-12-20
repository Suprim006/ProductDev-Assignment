import CustomerPage from './(customerView)/page';
import CustomerLayout from './(customerView)/layout';

export default function HomePage() {
  return (
    <CustomerLayout>
      <CustomerPage />
    </CustomerLayout>
  );
}