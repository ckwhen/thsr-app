export const hasAvailableSeat = (seatStatus = '') => (/^(Limited|Available)$/i.test(seatStatus));
export const noAvailableSeat = (seatStatus = '') => (/^Full$/i.test(seatStatus));

export const isRegularTicket = (ticketType = '') => ticketType === '標準';
export const isBusinessTicket = (ticketType = '') => ticketType === '商務';

export default {
  hasAvailableSeat,
  noAvailableSeat,
  isRegularTicket,
  isBusinessTicket,
};
