import { component$, $, useSignal } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';
import { HiPlusOutline } from '@qwikest/icons/heroicons';
import { Columns, TableServerPagination } from '../../components/dashboard/table/table-server-pagination';
import { LINK_MODAL_ID, LinkModal } from '../../components/dashboard/links/link-modal/link-modal';
import { formatDate } from '../../lib/date-utils';
import { useToaster } from '../../components/toaster/toaster';
import { getLinkFromKey } from '../../components/temporary-links/utils';

export default component$(() => {
  const refetchSignal = useSignal<number>(0);
  const toaster = useToaster();

  const onSubmitHandler = $(() => {
    refetchSignal.value++;

    toaster.add({
      title: 'Link created',
      description: 'Link created successfully and ready to use!',
      type: 'info',
    });
  });

  const columns: Columns = {
    key: {
      displayName: 'Shortened URL',
      classNames: 'w-1/4',
      format: $(({ value }) => {
        const url = getLinkFromKey(value as string);
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
            {process.env.DOMAIN}/{value}
          </a>
        );
      }),
    },
    url: {
      displayName: 'Destination URL',
      classNames: 'w-1/4',
      format: $(({ value }) => {
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
            {value}
          </a>
        );
      }),
    },
    expirationTime: {
      displayName: 'Expiration Time',
      classNames: 'w-1/4',
      sortable: true,
      format: $(({ value }) => {
        if (!value || value === '') {
          return 'Never';
        }

        return formatDate(new Date(value));
      }),
    },
    createdAt: {
      displayName: 'Created At',
      classNames: 'w-1/4',
      sortable: true,
      format: $(({ value }) => {
        return formatDate(new Date(value));
      }),
    },
  };

  return (
    <>
      <LinkModal onSubmitHandler={onSubmitHandler} />
      <div class="shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl w-full p-5">
        <TableServerPagination endpoint={`${process.env.CLIENTSIDE_API_DOMAIN}/api/v1/links`} columns={columns} refetch={refetchSignal}>
          <button class="btn btn-primary" onClick$={() => (document.getElementById(LINK_MODAL_ID) as any).showModal()}>
            <HiPlusOutline class="h-5 w-5" />
            Create a link
          </button>
        </TableServerPagination>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Reduced.to | Dashboard',
  meta: [
    {
      name: 'title',
      content: 'Reduced.to | Dashboard - My links',
    },
    {
      name: 'description',
      content: 'Reduced.to | Your links page. see your links, shorten links, and more!',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://reduced.to/dashboard',
    },
    {
      property: 'og:title',
      content: 'Reduced.to | Dashboard - My links',
    },
    {
      property: 'og:description',
      content: 'Reduced.to | Your links page. see your links, shorten links, and more!',
    },
    {
      property: 'twitter:card',
      content: 'summary',
    },
    {
      property: 'twitter:title',
      content: 'Reduced.to | Dashboard - My links',
    },
    {
      property: 'twitter:description',
      content: 'Reduced.to | Your links page. see your links, shorten links, and more!',
    },
  ],
};
