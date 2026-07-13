import JavelinLoader from '@/components/ui/JavelinLoader'

export default function ShopLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-w px-6 md:px-12">
      <JavelinLoader label="Loading the shop" />
    </div>
  )
}
