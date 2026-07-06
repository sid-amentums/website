export default function ShopLoading() {
  return (
    <div className="px-6 pb-24 md:px-12">
      <div className="border-t border-border py-11">
        <div className="h-10 w-64 animate-pulse rounded bg-off2" />
      </div>
      <div className="grid grid-cols-1 gap-px bg-off3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col bg-w p-5">
            <div className="mb-4 aspect-[4/3] animate-pulse rounded bg-off2" />
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-off2" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-off2" />
          </div>
        ))}
      </div>
    </div>
  )
}
