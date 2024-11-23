import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Chip } from '@mantine/core';

export default function CustomersPage() {
  return (
    <div>
      <Chip>Awesome chip</Chip>

      <Card>
        {/* <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>View all customers and their orders.</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      */}
      </Card>
    </div>

  );
}
