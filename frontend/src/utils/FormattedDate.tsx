export function formattedDate(dateString : string) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
  }
