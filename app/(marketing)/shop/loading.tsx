import JavelinLoader from '@/components/ui/JavelinLoader'

export default function ShopLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 md:px-12">
      <JavelinLoader label="Loading the shop" />
    </div>
  )
}
