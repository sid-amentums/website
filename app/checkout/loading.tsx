import JavelinLoader from '@/components/ui/JavelinLoader'

export default function CheckoutLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-w">
      <JavelinLoader label="Loading checkout" />
    </div>
  )
}
