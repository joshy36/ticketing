export const dateToString = (date: string): string => {
  const months: Record<string, string> = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'March',
    '4': 'April',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
  };

  const dateObj = new Date(date);

  const dateFormat = dateObj.toLocaleString();
  const timeFormat = dateObj.toLocaleTimeString();
  const time = timeFormat.split(':')[0] + ':' + timeFormat.split(':')[1];
  let ampm;
  switch (true) {
    case timeFormat.includes('PM'):
      ampm = 'PM';
      break;
    case timeFormat.includes('AM'):
      ampm = 'AM';
      break;
    default:
      ampm = '';
  }
  const day = dateFormat.split('/')[1]!;
  const month = months[dateFormat.split('/')[0]!];
  return month + ' ' + day + ', ' + time + ' ' + ampm;
};

export const blurhash = 'L04U]7j[fQj[offQfQfQfQfQfQfQ';

// export const ipAddress = '67.85.181.216';
export const ipAddress = '192.168.1.213'; // 222
// export const ipAddress = '192.168.1.165'; // jackson

export const replaceLocalhostWithIP = (event: any) => {
  if (!event) {
    return null;
  }

  if (event.image && typeof event.image === 'string') {
    event.image = event.image.replace('localhost', ipAddress);
  }

  if (event.profile_image && typeof event.profile_image === 'string') {
    event.profile_image = event.profile_image.replace('localhost', ipAddress);
  }

  return event;
};

export const truncate = (
  str: string | null | undefined,
  maxLength: number
): string => {
  if (!str) {
    return ''; // Return an empty string if the input is null or undefined
  }

  if (str.length <= maxLength) {
    return str; // If the string is already shorter than the maximum length, return it as is
  }

  // Truncate the string to the specified length and add an ellipsis (...)
  return str.slice(0, maxLength - 3) + '...';
};
