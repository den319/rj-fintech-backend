
export interface CursorPaginatedResult<T> {
  data: T[];
  meta: {
    nextCursor: string | null;
    hasNextPage: boolean;
  };
}

export const paginateWithCursor = async <T>(
  model: any,
  query: { cursor?: string; limit?: string | number },
  args: any = {}
): Promise<CursorPaginatedResult<T>> => {
  const limit = Math.max(Number(query.limit) || 10, 1);
  const cursor = query.cursor;

  const data = await model.findMany({
    ...args,
    take: limit + 1, // Fetch one extra to check if there's a next page
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0, // Skip the cursor itself if it exists
    orderBy: args.orderBy || { id: 'asc' },
  });

  const hasNextPage = data.length > limit;
  const resultData = hasNextPage ? data.slice(0, limit) : data;
  
  // The last item in our current set becomes the cursor for the next request
  const nextCursor = hasNextPage ? resultData[resultData.length - 1].id : null;

  return {
    data: resultData,
    meta: {
      nextCursor,
      hasNextPage,
    },
  };
};