import type { Order } from '@/lib/types'
import OrderCard from '@/components/account/OrderCard'

export default function OrdersList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-mid">You haven&apos;t placed any orders yet.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-10">
      <h1 className="mb-6 font-serif text-3xl text-ink">My Orders</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
