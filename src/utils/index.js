// 判斷是否還有剩餘座位
// Available: 尚有座位
// Limited: 座位有限
// Full: 已無座位
export const hasAvailableSeat = (seatStatus = '') => (/(Limited|Available)/i.test(seatStatus));
export const noAvailableSeat = (seatStatus = '') => (/Full/i.test(seatStatus));

// 判斷票種
// TicketType: 標準
// TicketType: 商務
export const isRegularTicket = (ticketType = '') => ticketType === '標準';
export const isBusinessTicket = (ticketType = '') => ticketType === '商務';

export default {
  hasAvailableSeat,
  noAvailableSeat,
  isRegularTicket,
  isBusinessTicket,
};
