import LoadingFlag from '@/components/ui/LoadingFlag'

export default function CheckoutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-w">
      <LoadingFlag label="Loading checkout" />
    </div>
  )
}
