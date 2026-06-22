import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schema";
import type { BreadcrumbItem as BreadcrumbItemType } from "@/types";

interface BreadcrumbsProps {
  items: BreadcrumbItemType[];
}

/** Visual breadcrumb trail plus matching BreadcrumbList JSON-LD. */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <span key={item.url} className="contents">
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={item.url}>{item.name}</Link>} />
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
