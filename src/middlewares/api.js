import fetch from 'cross-fetch';
import queryString from 'query-string';
import { camelizeKeys, pascalizeKeys } from 'humps';
import { cloneDeep } from 'lodash';

export const CALL_API = Symbol('Call API');

function callApi({
  url,
  params,
  method = 'GET',
  headers = {},
} = {}) {
  let fullUrl = url;
  const fetchOptions = {
    method,
    mode: 'cors',
    headers: cloneDeep(headers),
    credentials: 'include',
  };

  fetchOptions.headers['Content-Type'] = 'application/json';
  if (typeof params !== 'undefined' && method === 'GET') {
    fullUrl = `${fullUrl}?${queryString.stringify(params)}`;
  } else if (typeof params !== 'undefined') {
    fetchOptions.body = JSON.stringify(pascalizeKeys(params));
  }

  return fetch(fullUrl, fetchOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then(response => camelizeKeys(response));
}

export default () => next => (action) => {
  const apiAction = action[CALL_API];
  if (typeof apiAction === 'undefined') {
    return next(action);
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  }

  const {
    url,
    headers,
    params,
    method,
    types,
  } = apiAction;
  const [requestType, successType, failureType] = types;
  next(actionWith({
    type: requestType,
  }));

  return callApi({
    url,
    params,
    method,
    headers,
  })
    .then((response) => {
      next(actionWith({
        response,
        type: successType,
      }));
      return Promise.resolve(response);
    })
    .catch((error) => {
      next(actionWith({
        type: failureType,
        error,
      }));
      return Promise.reject(error);
    });
};
