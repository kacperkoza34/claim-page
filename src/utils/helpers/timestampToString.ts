export const timestampToString = (timeStamp: number) => {
  const days = Math.floor(timeStamp / (3600 * 24));
  const hours = Math.floor((timeStamp % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeStamp % 3600) / 60);
  const seconds = Math.floor(timeStamp % 60);

  return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
};
