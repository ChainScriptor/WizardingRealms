import { cn } from '../lib/utils'

type MagicBagInventoryProps = {
  items: { imageUrl: string; amount: number }[]
  className?: string
}

const SLOT_COUNT = 9

export function MagicBagInventory({ items, className }: MagicBagInventoryProps) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, index) => items[index] ?? null)

  return (
    <div className={cn('relative w-auto h-auto flex items-center justify-center', className)}>
      <img
        src="/bag.svg"
        alt="Magic Bag"
        className="w-full h-auto object-contain"
        style={{ width: '660px', maxWidth: '660px' }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-16 pt-36 pb-36">
        <div className="grid w-full max-w-[240px] grid-cols-3 gap-2">
        {slots.map((slot, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg bg-amber-50/80 backdrop-blur-[1px] ring-1 ring-amber-900/20 shadow-inner flex items-center justify-center overflow-hidden"
          >
            {slot ? (
              <>
                <img
                  src={slot.imageUrl}
                  alt={`Bag item ${index + 1}`}
                  className="h-8 w-8 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
                />
                <div className="absolute inset-x-0 bottom-0.5 flex justify-center">
                  <span className="rounded bg-amber-900/90 px-1.5 py-0.5 text-[10px] font-semibold text-amber-100 shadow-md leading-tight">
                    {slot.amount}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm font-semibold text-amber-900/30">—</span>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

export default MagicBagInventory

