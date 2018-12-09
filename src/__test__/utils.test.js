import {
  hasAvailableSeat,
  noAvailableSeat,
  isRegularTicket,
  isBusinessTicket,
} from '../utils';

// 判斷車廂座位狀態
// Available: 尚有座位
// Limited: 座位有限
// Full: 已無座位
describe('available seat status', () => {
  describe('when car has available seat, hasAvailableSeat', () => {
    it('should passed exact string', () => {
      expect(hasAvailableSeat('Available')).toBe(true);
      expect(hasAvailableSeat('available')).toBe(true);
      expect(hasAvailableSeat('Limited')).toBe(true);
      expect(hasAvailableSeat('limited')).toBe(true);
    });

    it('should failed inexact string', () => {
      expect(hasAvailableSeat('SeatAvailable')).toBe(false);
      expect(hasAvailableSeat('AvailableSeat')).toBe(false);
      expect(hasAvailableSeat('SeatLimited')).toBe(false);
      expect(hasAvailableSeat('LimitedSeat')).toBe(false);
    });
  });

  describe('when car has no available seat, noAvailableSeat', () => {
    it(`should passed exact string`, () => {
      expect(noAvailableSeat('Full')).toBe(true);
      expect(noAvailableSeat('full')).toBe(true);
    });
    it(`should failed inexact string`, () => {
      expect(noAvailableSeat('SeatFull')).toBe(false);
      expect(noAvailableSeat('FullSeat')).toBe(false);
    });
  });
});

// 判斷票種
// TicketType: 標準
// TicketType: 商務
describe('ticket type', () => {
  describe('when ticket type is regular, isRegularTicket', () => {
    it(`should passed \'標準\'`, () => {
      expect(isRegularTicket('標準')).toBe(true);
    });
    it(`should failed \'商務\'`, () => {
      expect(isRegularTicket('商務')).toBe(false);
    });
  });

  describe('when ticket type is business, isBusinessTicket', () => {
    it(`should passed \'商務\'`, () => {
      expect(isBusinessTicket('商務')).toBe(true);
    });
    it(`should failed \'標準\'`, () => {
      expect(isBusinessTicket('標準')).toBe(false);
    });
  });
});
