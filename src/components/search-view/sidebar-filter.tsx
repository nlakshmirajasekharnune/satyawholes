import { CustomDisclosure } from '@/components/ui/disclosure';
import { useTranslation } from 'next-i18next';
import PriceFilter from '@/components/search-view/price-filter';
import CategoryFilter from '@/components/search-view/category-filter-view';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import { drawerAtom } from '@/store/drawer-atom';
import ArrowNarrowLeft from '@/components/icons/arrow-narrow-left';
import { useIsRTL } from '@/lib/locals';
import Button from '@/components/ui/button';
import { useCategories } from '@/framework/category';
import DiscountPriceFilter from './newarrival';
import ArrivalFilter from './arrival';
import { useRouter } from 'next/router';

const FieldWrapper = ({ children, title }: any) => (
  <div className="border-b border-gray-200 last:border-0 mt-3">
    <CustomDisclosure title={title}>{children}</CustomDisclosure>
  </div>
);

function ClearFiltersButton() {
  const { t } = useTranslation('common');
  const router = useRouter();

  function clearFilters() {
    const {
      price,
      category,
      sortedBy,
      orderBy,
      tags,
      manufacturer,
      text,
      ...rest
    } = router.query;
    router.push({
      pathname: router.pathname,
      query: {
        // ...rest,
        ...(router.route !== '/[searchType]/search' && { category }),
      },
    });
    // router.push(Routes.home);
  }
  return (
    <button
      className="text-sm font-semibold transition-colors text-red-500 focus:text-red-500 focus:outline-none lg:m-0"
      onClick={clearFilters}
    >
      {t('text-clear-all')}
    </button>
  );
}
const SidebarFilter: React.FC<{
  type?: string;
  showManufacturers?: boolean;
  className?: string;
}> = ({ type, showManufacturers = true, className }) => {
  const router = useRouter();
  const { isRTL } = useIsRTL();
  const { t } = useTranslation('common');
  const [_, closeSidebar] = useAtom(drawerAtom);
  // @ts-ignore
  const { categories, isLoading, error } = useCategories({
    ...(type ? { type } : { type: router.query.searchType }),
    limit: 1000
  });
  const findParent=categories.find(d=>d.slug==router.query.category&&d.parent_id==null);
  return (
    <div
      className={classNames(
        'flex bg-white w-full h-full lg:h-auto flex-col',
        className
      )}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-1 bg-white border-b border-gray-200 lg:static rounded-tl-xl rounded-tr-xl">
        <div className="flex items-center space-x-3 rtl:space-x-reverse lg:space-x-0">
          <button
            className="text-body focus:outline-none lg:hidden"
            onClick={() => closeSidebar({ display: false, view: '' })}
          >
            <ArrowNarrowLeft
              className={classNames('h-7', {
                'rotate-180': isRTL,
              })}
              strokeWidth={1.7}
            />
            <span className="sr-only">{t('text-close')}</span>
          </button>
          {(router.asPath != '/') ?<h3 className="text-xl font-semibold lg:text-2xl text-heading">
            {t('text-filter')}
          </h3>: null}
        </div>
        {(router.asPath != '/') ? <ClearFiltersButton />: null}       
      </div>
      <div className="flex-1 px-5 py-2">  
        {/* <FieldWrapper title="text-search">
          <Search variant="minimal" label="search" />
        </FieldWrapper> */}
        {/* {router.route !== '/[searchType]/search' && (
          <FieldWrapper title="text-sort">
            <Sorting />
          </FieldWrapper>
        )} */}
        {/* <PriceFilter /> */}
        {/* <FieldWrapper title="text-categories"> */}
        {(router.asPath != '/'&&findParent!=undefined) ?<div><h6 className="font-bold text-heading py-4">{t('text-brands')}</h6> <CategoryFilter type={type} /></div>: null}
        {/* </FieldWrapper> */}
        <div>
        {(findParent==undefined&&(router.asPath != '/'))?<div><h6 className="font-bold text-heading py-2">{t('text-newarrival')}</h6><ArrivalFilter/></div>
        :null
        }
        </div>
        {(findParent==undefined&&(router.asPath != '/'))?<div><h6 className="font-bold text-heading py-2">{t('text-price')}</h6>  <PriceFilter /></div>
        :null
      }
        {/* {(findParent==undefined&&(router.asPath != '/'))?<div><h6 className="font-bold text-heading py-2">{t('text-offer')}</h6><DiscountPriceFilter/></div>
        :null
        } */}
        {/* <FieldWrapper title="text-tags">
          <TagFilter />
        </FieldWrapper> */}

        {/* {showManufacturers && (
          <FieldWrapper title="text-manufacturers">
            <ManufacturerFilter />
          </FieldWrapper>
        )} */}
      </div>
      <div className="p-5 bg-white sticky bottom-0 z-10 border-t border-gray-200 mt-auto lg:hidden">
        <Button
          className="w-full"
          onClick={() => closeSidebar({ display: false, view: '' })}
        >
          Show Products
        </Button>
      </div>
    </div>
  );
};

export default SidebarFilter;
