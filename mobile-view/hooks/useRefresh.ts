import { useState } from 'react';

export const useRefresh = (refetchFn?: () => Promise<any>) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (refetchFn) {
      await refetchFn();
    }
    setRefreshing(false);
  };

  return { refreshing, onRefresh };
};
