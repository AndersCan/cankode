import { block } from 'typed-tester';

// Properties
block('Block A start', (test) => {
  test.describe('A', (test) => {
    test.describe('AA', (test) => {
      test.it('Testing from A - AA1', () => {});
      test.it('Testing from A - AA2', () => {});
    });
    test.describe('AB', (test) => {
      test.it('Testing from A - AB1', () => {});
      test.it('Testing from A - AB2', () => {});
    });
  });

  test.describe('B', (test) => {
    test.describe('BA', (test) => {
      test.it('Testing from B - BA1', () => {});
      test.it('Testing from B - BA2', () => {
        // throw new Error('BAD SOMETHING');
      });
    });
    test.describe('BB', (test) => {
      test.it('Testing from B - BB1', () => {});
      test.it('Testing from B - BB2', () => {});
    });
  });
});

block('Block B start', (test) => {
  test.describe('A', (test) => {
    test.describe('AA', (test) => {
      test.it('Testing from A - AA1', () => {});
      test.it('Testing from A - AA2', () => {});
    });
    test.describe('AB', (test) => {
      test.it('Testing from A - AB1', () => {});
      test.it('Testing from A - AB2', () => {});
    });
  });
  test.describe('B', (test) => {
    test.describe('BA', (test) => {
      test.it('Testing from B - BA1', () => {});
      test.it('Testing from B - BA2', () => {});
    });
    test.describe('BB', (test) => {
      test.it('Testing from B - BB1', () => {});
      test.it('Testing from B - BB2', () => {});
    });
  });
});
