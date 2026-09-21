
'use client'
import { usePathname } from '@/components/navigation'
import { cn } from "@/lib/utils"

const PageTitle = ({ title, className }: { title?: string, className?: string }) => {
    const pathname = usePathname();
    const name = pathname?.split('/').slice(1).join(' ');

    return (
        <div className={cn('flex flex-wrap gap-4 items-center justify-between', className)}>
            <div className="text-2xl font-medium text-default-800 capitalize">
                {title ? title : name ? name : null}
                <p className="font-normal text-gray text-sm">Platform overview and key metrics</p>
            </div>
        </div>
    )
}

export default PageTitle