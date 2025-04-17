import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatsCard } from '@/components/ui/stats-card';
import {
  Download,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CalendarDays,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock payout data
interface Payout {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'processing';
  date: string;
  eventName: string;
  tickets: number;
  revenue: number;
  serviceFee: number;
  paymentFee: number;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  breakdown: {
    category: string;
    amount: number;
  }[];
}

const mockPayouts: Payout[] = [
  {
    id: 'PYT-001',
    amount: 67500,
    status: 'completed',
    date: 'Apr 10, 2025',
    eventName: 'Summer Music Festival',
    tickets: 750,
    revenue: 75000,
    serviceFee: 6000,
    paymentFee: 1500,
    bankDetails: {
      accountName: 'Event Organizer LLC',
      accountNumber: 'XXXX-XXXX-1234',
      bankName: 'Chase Bank',
    },
    breakdown: [
      { category: 'Ticket Revenue', amount: 75000 },
      { category: 'Service Fee (8%)', amount: -6000 },
      { category: 'Payment Processing (2%)', amount: -1500 },
    ],
  },
  {
    id: 'PYT-002',
    amount: 47250,
    status: 'completed',
    date: 'Mar 25, 2025',
    eventName: 'Tech Conference 2025',
    tickets: 350,
    revenue: 52500,
    serviceFee: 4200,
    paymentFee: 1050,
    bankDetails: {
      accountName: 'Event Organizer LLC',
      accountNumber: 'XXXX-XXXX-1234',
      bankName: 'Chase Bank',
    },
    breakdown: [
      { category: 'Ticket Revenue', amount: 52500 },
      { category: 'Service Fee (8%)', amount: -4200 },
      { category: 'Payment Processing (2%)', amount: -1050 },
    ],
  },
  {
    id: 'PYT-003',
    amount: 22500,
    status: 'pending',
    date: 'Apr 20, 2025',
    eventName: 'Food & Wine Expo',
    tickets: 420,
    revenue: 25000,
    serviceFee: 2000,
    paymentFee: 500,
    bankDetails: {
      accountName: 'Event Organizer LLC',
      accountNumber: 'XXXX-XXXX-1234',
      bankName: 'Chase Bank',
    },
    breakdown: [
      { category: 'Ticket Revenue', amount: 25000 },
      { category: 'Service Fee (8%)', amount: -2000 },
      { category: 'Payment Processing (2%)', amount: -500 },
    ],
  },
  {
    id: 'PYT-004',
    amount: 12600,
    status: 'processing',
    date: 'Apr 25, 2025',
    eventName: 'Art Exhibition',
    tickets: 280,
    revenue: 14000,
    serviceFee: 1120,
    paymentFee: 280,
    bankDetails: {
      accountName: 'Event Organizer LLC',
      accountNumber: 'XXXX-XXXX-1234',
      bankName: 'Chase Bank',
    },
    breakdown: [
      { category: 'Ticket Revenue', amount: 14000 },
      { category: 'Service Fee (8%)', amount: -1120 },
      { category: 'Payment Processing (2%)', amount: -280 },
    ],
  },
  {
    id: 'PYT-005',
    amount: 32400,
    status: 'pending',
    date: 'May 10, 2025',
    eventName: 'Business Summit',
    tickets: 180,
    revenue: 36000,
    serviceFee: 2880,
    paymentFee: 720,
    bankDetails: {
      accountName: 'Event Organizer LLC',
      accountNumber: 'XXXX-XXXX-1234',
      bankName: 'Chase Bank',
    },
    breakdown: [
      { category: 'Ticket Revenue', amount: 36000 },
      { category: 'Service Fee (8%)', amount: -2880 },
      { category: 'Payment Processing (2%)', amount: -720 },
    ],
  },
];

// Monthly payout trend
const payoutTrendData = [
  { name: 'Jan', amount: 35000 },
  { name: 'Feb', amount: 40000 },
  { name: 'Mar', amount: 50000 },
  { name: 'Apr', amount: 70000 },
  { name: 'May', amount: 35000 },
  { name: 'Jun', amount: 60000 },
];

const Payouts = () => {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedPayout, setExpandedPayout] = useState<string | null>(null);

  const handleDownloadStatement = (payout: Payout) => {
    toast({
      title: 'Statement Downloaded',
      description: `Payout statement for ${payout.eventName} has been downloaded`,
    });
  };

  const handleSetupPayment = () => {
    toast({
      title: 'Payment Setup',
      description: 'Banking information updated successfully',
    });
  };

  // Calculate total completed payouts
  const totalCompletedAmount = mockPayouts
    .filter((payout) => payout.status === 'completed')
    .reduce((acc, payout) => acc + payout.amount, 0);

  // Calculate pending payouts
  const pendingPayoutsAmount = mockPayouts
    .filter(
      (payout) => payout.status === 'pending' || payout.status === 'processing'
    )
    .reduce((acc, payout) => acc + payout.amount, 0);

  // Get total number of payouts
  const totalPayoutCount = mockPayouts.length;

  // Filter payouts based on status
  const filteredPayouts =
    statusFilter === 'all'
      ? mockPayouts
      : mockPayouts.filter((payout) => payout.status === statusFilter);

  const getStatusBadge = (status: 'completed' | 'pending' | 'processing') => {
    switch (status) {
      case 'completed':
        return (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-600 border-green-200 flex items-center gap-1'
          >
            <CheckCircle2 className='h-3 w-3' />
            <span>Completed</span>
          </Badge>
        );
      case 'pending':
        return (
          <Badge
            variant='outline'
            className='bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1'
          >
            <Clock className='h-3 w-3' />
            <span>Pending</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge
            variant='outline'
            className='bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1'
          >
            <AlertCircle className='h-3 w-3' />
            <span>Processing</span>
          </Badge>
        );
    }
  };

  return (
    <div className='space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold'>Payouts</h1>
          <p className='text-muted-foreground mt-1'>
            Track your earnings and payment history
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='flex items-center gap-2'
            onClick={handleSetupPayment}
          >
            <span>Payment Settings</span>
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatsCard
          title='Total Payouts'
          value={`$${totalCompletedAmount.toLocaleString()}`}
          icon={<DollarSign className='h-8 w-8' />}
        />
        <StatsCard
          title='Pending Payouts'
          value={`$${pendingPayoutsAmount.toLocaleString()}`}
          icon={<Clock className='h-8 w-8' />}
        />
        <StatsCard
          title='Total Transactions'
          value={totalPayoutCount.toString()}
          icon={<CalendarDays className='h-8 w-8' />}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Payout Trend</CardTitle>
            <CardDescription>Monthly payout amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={payoutTrendData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id='colorAmount'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='5%' stopColor='#24005b' stopOpacity={0.8} />
                      <stop
                        offset='95%'
                        stopColor='#24005b'
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey='name' />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <CartesianGrid strokeDasharray='3 3' vertical={false} />
                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toLocaleString()}`,
                      'Amount',
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      boxShadow:
                        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E5E7EB',
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='amount'
                    stroke='#24005b'
                    fillOpacity={1}
                    fill='url(#colorAmount)'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Banking Information</CardTitle>
            <CardDescription>Your payout method details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='rounded-lg border p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <div className='bg-primary/10 p-2 rounded-full'>
                      <DollarSign className='h-5 w-5 text-primary' />
                    </div>
                    <span className='font-medium'>Bank Account</span>
                  </div>
                  <Badge>Default</Badge>
                </div>

                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Account Name:</span>
                    <span>Event Organizer LLC</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Account Number:</span>
                    <span>XXXX-XXXX-1234</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500'>Bank Name:</span>
                    <span>Chase Bank</span>
                  </div>
                </div>

                <Button className='w-full mt-4' variant='outline'>
                  Edit Bank Details
                </Button>
              </div>

              <div className='bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm'>
                <div className='flex items-start gap-2'>
                  <AlertCircle className='h-4 w-4 text-amber-600 mt-0.5 shrink-0' />
                  <div>
                    <p className='font-medium text-amber-800'>
                      Payout Schedule
                    </p>
                    <p className='text-amber-700 mt-1'>
                      Payouts are processed 7 days after the event to allow for
                      any refunds or disputes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                List of all your payouts and their status
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='processing'>Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payout ID</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayouts.length > 0 ? (
                  filteredPayouts.map((payout) => (
                    <React.Fragment key={payout.id}>
                      <TableRow
                        className='cursor-pointer hover:bg-gray-50'
                        onClick={() =>
                          setExpandedPayout(
                            expandedPayout === payout.id ? null : payout.id
                          )
                        }
                      >
                        <TableCell className='font-medium'>
                          {payout.id}
                        </TableCell>
                        <TableCell>{payout.eventName}</TableCell>
                        <TableCell>${payout.amount.toLocaleString()}</TableCell>
                        <TableCell>{payout.date}</TableCell>
                        <TableCell>{getStatusBadge(payout.status)}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button
                              size='sm'
                              variant='ghost'
                              className='h-8 w-8 p-0'
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadStatement(payout);
                              }}
                            >
                              <span className='sr-only'>
                                Download statement
                              </span>
                              <FileText className='h-4 w-4' />
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              className='h-8 w-8 p-0'
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedPayout(
                                  expandedPayout === payout.id
                                    ? null
                                    : payout.id
                                );
                              }}
                            >
                              {expandedPayout === payout.id ? (
                                <ChevronUp className='h-4 w-4' />
                              ) : (
                                <ChevronDown className='h-4 w-4' />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {expandedPayout === payout.id && (
                        <TableRow>
                          <TableCell colSpan={6} className='p-0'>
                            <div className='bg-gray-50 p-4'>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div>
                                  <h4 className='font-medium mb-2'>
                                    Payout Details
                                  </h4>
                                  <div className='space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                      <span className='text-gray-500'>
                                        Tickets Sold:
                                      </span>
                                      <span>{payout.tickets}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                      <span className='text-gray-500'>
                                        Total Revenue:
                                      </span>
                                      <span>
                                        ${payout.revenue.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className='flex justify-between'>
                                      <span className='text-gray-500'>
                                        Service Fee:
                                      </span>
                                      <span>
                                        -${payout.serviceFee.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className='flex justify-between'>
                                      <span className='text-gray-500'>
                                        Payment Processing Fee:
                                      </span>
                                      <span>
                                        -${payout.paymentFee.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className='flex justify-between font-medium pt-2 border-t'>
                                      <span>Net Payout:</span>
                                      <span>
                                        ${payout.amount.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className='font-medium mb-2'>
                                    Transferred To
                                  </h4>
                                  <div className='space-y-2 text-sm'>
                                    <div className='flex justify-between'>
                                      <span className='text-gray-500'>
                                        Account Name:
                                      </span>
                                      <span>
                                        {payout.bankDetails.accountName}
                                      </span>
                                    </div>
                                    <div className='flex justify-between'>
                                      <span className='text-gray-500'>
                                        Account Number:
                                      </span>
                                      <span>
                                        {payout.bankDetails.accountNumber}
                                      </span>
                                    </div>
                                    <div className='flex justify-between'>
                                      <span className='text-gray-500'>
                                        Bank Name:
                                      </span>
                                      <span>{payout.bankDetails.bankName}</span>
                                    </div>
                                  </div>

                                  <div className='mt-4'>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='flex items-center gap-2'
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadStatement(payout);
                                      }}
                                    >
                                      <Download className='h-4 w-4' />
                                      <span>Download Statement</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='text-center py-6 text-muted-foreground'
                    >
                      No payouts found matching the selected filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout FAQs</CardTitle>
          <CardDescription>
            Answers to common questions about the payout process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type='single' collapsible className='w-full'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>When are payouts processed?</AccordionTrigger>
              <AccordionContent>
                Payouts are typically processed 7 days after your event has
                concluded. This waiting period allows for any potential refunds
                or disputes to be processed before the final payout is
                calculated.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>
                What fees are deducted from my payout?
              </AccordionTrigger>
              <AccordionContent>
                The platform deducts a service fee of 8% from your total ticket
                revenue. Additionally, a payment processing fee of 2% is applied
                to cover transaction costs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>
                How can I update my banking information?
              </AccordionTrigger>
              <AccordionContent>
                You can update your banking information in the Payment Settings
                section. Please note that changes to banking details may require
                verification and can take 2-3 business days to process.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4'>
              <AccordionTrigger>
                What if there's an issue with my payout?
              </AccordionTrigger>
              <AccordionContent>
                If you notice any discrepancies or issues with your payout,
                please contact our support team immediately with your payout ID
                and details of the issue. Our team will investigate and resolve
                the matter within 48 hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payouts;
