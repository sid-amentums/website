import LoadingFlag from '@/components/ui/LoadingFlag'

export default function ShopLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-w px-6 md:px-12">
      <LoadingFlag label="Loading the shop" />
    </div>
  )
}
