
const open = (history, param) =>
  history.push({
    pathname: history.location.pathname,
    search: history.location.search + `modal-${param}=true`
  });

const close = (history, param) =>{
  const newSearch = history.location.search.replace(`modal-${param}=true`, '');
  return history.push({
    pathname: history.location.pathname,
    search: newSearch,
  });
}

const isOpen = (history, param) => history.location.search.includes(`modal-${param}=true`);

export const createQueryParamModalHelpers = (history, param) => ({
  open: () => open(history, param),
  close: () => close(history, param),
  isOpen: () => isOpen(history, param),
});

