import moment from 'moment';
import pageData from './pages.json';

export function getUserDetails() {
  return JSON.parse(localStorage.getItem('userDetails'));
}

export function makeColumn(arr) {
  return arr.length > 0
    ? Object.keys(arr?.[0])
        .filter((key) => typeof arr[0]?.[key] === 'string')
        .filter((key) => arr[0][key] != null)
        .filter((key) => key !== 'description')
        .map((key) => ({
          accessorKey: key,
          header: key?.charAt(0).toUpperCase() + key?.slice(1),
        }))
    : [];
}

export function makePayload(sectionName, method, data, operation) {
  return {
    method,
    ...(method !== 'SELECT' && {
      data: [
        ...pageData[sectionName].fields.map((e) => ({
          key: e.name,
          value: e.type === 'date' ? moment(`${data[e.name]}`).format('DD/MM/YYYY') : data[e.name],
        })),
        {
          key: 'storeid',
          value: getUserDetails().storeid,
        },
      ],
    }),
    condition: {
      data: [
        { key: 'storeid', value: getUserDetails().storeid },
        ...Object.keys(data).reduce((result, key) => {
          if (key.includes('id')) {
            result.push({ key, value: data[key] });
          }
          return result;
        }, []),
      ],
      operation,
    },
  };
}
