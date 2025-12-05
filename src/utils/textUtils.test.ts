import { calculateReadingTime, formatDate } from './textUtils';

describe('textUtils', () => {

  describe('calculateReadingTime', () => {
    it('повертає 0 хв для пустий стрічки', () => {
      expect(calculateReadingTime("")).toBe("0 хв. читання");
    });

    it('повертає 1 хв для короткого тексту (менше 200 слів)', () => {
      const text = "слово ".repeat(50);
      expect(calculateReadingTime(text)).toBe("1 хв. читання");
    });

    it('повертає правильний час для довгого тексту (400 слів = 2 хв)', () => {
      const text = "слово ".repeat(400);
      expect(calculateReadingTime(text)).toBe("2 хв. читання");
    });

    it('округляє в більшу сторону (201 слово = 2 хв)', () => {
      const text = "слово ".repeat(201);
      expect(calculateReadingTime(text)).toBe("2 хв. читання");
    });
  });

  describe('formatDate', () => {
    it('правильно форматує дату', () => {
      // 1 січня 2024 року
      const date = new Date('2024-01-01').getTime();
      const result = formatDate(date);
      expect(result).toContain('2024');
    });
  });
});