/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';

// Define the structure for an order
export interface Order {
  id: string;
  customer: string;
  event: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  tickets: number;
}

// Define the context state
interface OrdersContextState {
  orders: Order[];
  filteredOrders: Order[];
  filterOrders: (status?: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (items: number) => void;
  isLoading: boolean;
}

// Create the context
const OrdersContext = createContext<OrdersContextState | undefined>(undefined);

// Sample data for orders
const sampleOrders: Order[] = [
  {
    id: '1',
    customer: 'John Doe',
    event: 'Summer Music Festival',
    date: '2025-06-15',
    amount: 125.0,
    status: 'completed',
    tickets: 2,
  },
  {
    id: '2',
    customer: 'Alice Smith',
    event: 'Business Conference',
    date: '2025-07-20',
    amount: 299.0,
    status: 'pending',
    tickets: 1,
  },
  {
    id: '3',
    customer: 'Robert Johnson',
    event: 'Tech Workshop',
    date: '2025-05-10',
    amount: 149.99,
    status: 'completed',
    tickets: 3,
  },
  {
    id: '4',
    customer: 'Emily Clark',
    event: 'Comedy Night',
    date: '2025-05-25',
    amount: 45.0,
    status: 'cancelled',
    tickets: 2,
  },
  {
    id: '5',
    customer: 'Michael Wilson',
    event: 'Dance Festival',
    date: '2025-08-05',
    amount: 85.5,
    status: 'completed',
    tickets: 1,
  },
  {
    id: '6',
    customer: 'Sarah Brown',
    event: 'Art Exhibition',
    date: '2025-06-30',
    amount: 25.0,
    status: 'completed',
    tickets: 2,
  },
  {
    id: '7',
    customer: 'David Lee',
    event: 'Film Screening',
    date: '2025-07-12',
    amount: 15.0,
    status: 'refunded',
    tickets: 1,
  },
  {
    id: '8',
    customer: 'Jennifer Taylor',
    event: 'Food Festival',
    date: '2025-09-18',
    amount: 50.0,
    status: 'pending',
    tickets: 4,
  },
  {
    id: '9',
    customer: 'Kevin Martinez',
    event: 'Sports Tournament',
    date: '2025-08-22',
    amount: 75.0,
    status: 'completed',
    tickets: 2,
  },
  {
    id: '10',
    customer: 'Lisa Anderson',
    event: 'Music Concert',
    date: '2025-10-05',
    amount: 110.0,
    status: 'completed',
    tickets: 1,
  },
  {
    id: '11',
    customer: 'James White',
    event: 'Theater Play',
    date: '2025-06-08',
    amount: 65.0,
    status: 'cancelled',
    tickets: 3,
  },
  {
    id: '12',
    customer: 'Patricia Harris',
    event: 'Photography Workshop',
    date: '2025-07-15',
    amount: 200.0,
    status: 'completed',
    tickets: 1,
  },
  {
    id: '13',
    customer: 'Thomas Moore',
    event: 'Book Signing',
    date: '2025-05-20',
    amount: 10.0,
    status: 'completed',
    tickets: 2,
  },
  {
    id: '14',
    customer: 'Jessica Scott',
    event: 'Career Fair',
    date: '2025-09-10',
    amount: 0.0,
    status: 'pending',
    tickets: 1,
  },
  {
    id: '15',
    customer: 'Daniel Rodriguez',
    event: 'Health & Wellness Expo',
    date: '2025-08-15',
    amount: 35.0,
    status: 'completed',
    tickets: 2,
  },
];

// Create the provider
export const OrdersContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [orders] = useState<Order[]>(sampleOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(sampleOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading] = useState(false);

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Filter orders by status
  const filterOrders = (status?: string) => {
    if (!status || status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      orders,
      filteredOrders,
      filterOrders,
      currentPage,
      setCurrentPage,
      totalPages,
      itemsPerPage,
      setItemsPerPage,
      isLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orders, filteredOrders, currentPage, itemsPerPage, totalPages, isLoading]
  );

  return (
    <OrdersContext.Provider value={contextValue}>
      {children}
    </OrdersContext.Provider>
  );
};

// Custom hook to use the orders context
export const useOrdersContext = (): OrdersContextState => {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error(
      'useOrdersContext must be used within an OrdersContextProvider'
    );
  }
  return context;
};
