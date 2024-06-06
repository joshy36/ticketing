// export const dateToString = (date: string): string => {
//   const months: Record<string, string> = {
//     '1': 'Jan',
//     '2': 'Feb',
//     '3': 'March',
//     '4': 'April',
//     '5': 'May',
//     '6': 'June',
//     '7': 'July',
//     '8': 'Aug',
//     '9': 'Sep',
//     '10': 'Oct',
//     '11': 'Nov',
//     '12': 'Dec',
//   };

//   const dateObj = new Date(date);
//   const dateFormat = dateObj.toLocaleString();
//   const timeFormat = dateObj.toLocaleTimeString();
//   const time =
//     timeFormat.split(':')[0] +
//     ':' +
//     timeFormat.split(':')[1] +
//     ' ' +
//     timeFormat.split(' ')[1];
//   const day = dateFormat.split('/')[1]!;
//   const month = months[dateFormat.split('/')[0]!];
//   return month + ' ' + day + ', ' + time;
// };

import { add, format, parseISO } from 'date-fns';

export const dateToString = (dateString: string): string => {
  const dateObj = parseISO(dateString);
  // // Subtract 5 hours for Eastern Standard Time (EST)
  // const estTime = add(dateObj, { hours: -5 });
  const formattedDate = format(dateObj, 'MMM d, h:mm a');
  return formattedDate;
};

export const formatEthAddress = (address: string | null): string => {
  return (
    address?.substring(0, 6) + '...' + address?.substring(address.length - 4)
  );
};
