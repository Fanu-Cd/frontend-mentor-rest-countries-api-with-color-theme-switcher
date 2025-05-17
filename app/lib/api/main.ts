import { getApiUrl } from "./getApiUrl";

const getFetchUrl = (url: string) => {
  return `${getApiUrl()}${url}`;
};

export const getAllCountries = () => {
  return fetch(getFetchUrl("all"))
    .then((res) => res)
    .then((res) => res.json());
};
