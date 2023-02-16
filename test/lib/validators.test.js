import {
  isEmptyString,
  isNumber,
  isPositiveInteger,
} from '../../src/lib/validators'

describe('isEmptyString', () => {
  describe('when undefined', () => {
    it('returns true', () => {
      expect(isEmptyString(undefined)).toEqual(true)
    })
  })

  describe('when null', () => {
    it('returns true', () => {
      expect(isEmptyString(null)).toEqual(true)
    })
  })

  describe('when empty string', () => {
    it('returns true', () => {
      expect(isEmptyString(' ')).toEqual(true)
    })
  })

  describe('when not empty string', () => {
    it('returns false', () => {
      expect(isEmptyString(' q ')).toEqual(false)
    })
  })

  describe('when number', () => {
    it('returns false', () => {
      expect(isEmptyString(1)).toEqual(false)
    })
  })
})

describe('isNumber', () => {
  describe('when undefined', () => {
    it('returns false', () => {
      expect(isNumber(undefined)).toEqual(false)
    })
  })

  describe('when null', () => {
    it('returns false', () => {
      expect(isNumber(null)).toEqual(false)
    })
  })

  describe('when string', () => {
    describe('when empty string', () => {
      it('returns false', () => {
        expect(isNumber(' ')).toEqual(false)
      })
    })

    describe('when not empty string', () => {
      it('returns false', () => {
        expect(isNumber(' q ')).toEqual(false)
      })
    })

    describe('when stringified integer', () => {
      describe('positive', () => {
        it('returns true', () => {
          expect(isNumber('1')).toEqual(true)
        })
      })

      describe('negative', () => {
        it('returns false', () => {
          expect(isNumber('-1')).toEqual(false)
        })
      })

      describe('with plus', () => {
        it('returns false', () => {
          expect(isNumber('+1')).toEqual(false)
        })
      })

      describe('with spaces', () => {
        it('returns false', () => {
          expect(isNumber(' 1 ')).toEqual(false)
        })
      })

      describe('when 1e3', () => {
        it('returns false', () => {
          expect(isNumber('1e3')).toEqual(false)
        })
      })

      describe('zero', () => {
        it('returns true', () => {
          expect(isNumber('0')).toEqual(true)
        })
      })

      describe('with leading zeros', () => {
        it('returns true', () => {
          expect(isNumber('001')).toEqual(true)
        })
      })
    })

    describe('when stringified float', () => {
      describe('positive', () => {
        it('returns true', () => {
          expect(isNumber('0.01')).toEqual(true)
        })
      })

      describe('negative', () => {
        it('returns false', () => {
          expect(isNumber('-0.01')).toEqual(false)
        })
      })

      describe('with plus', () => {
        it('returns false', () => {
          expect(isNumber('+0.01')).toEqual(false)
        })
      })

      describe('with spaces', () => {
        it('returns false', () => {
          expect(isNumber(' 0.01 ')).toEqual(false)
        })
      })

      describe('with comma', () => {
        it('returns false', () => {
          expect(isNumber('0,01')).toEqual(false)
        })
      })

      describe('with extra period', () => {
        it('returns false', () => {
          expect(isNumber('0.0.')).toEqual(false)
        })
      })

      describe('with invalid format', () => {
        it('returns false', () => {
          expect(isNumber('.0')).toEqual(false)
        })
      })

      describe('zero', () => {
        it('returns true', () => {
          expect(isNumber('0.0')).toEqual(true)
        })
      })

      describe('with long value', () => {
        it('returns true', () => {
          expect(isNumber('0.00000000000000000001')).toEqual(true)
        })
      })

      describe('with leading zeros', () => {
        it('returns true', () => {
          expect(isNumber('000.001')).toEqual(true)
        })
      })
    })
  })

  describe('when integer', () => {
    describe('positive', () => {
      it('returns true', () => {
        expect(isNumber(1)).toEqual(true)
      })
    })

    describe('negative', () => {
      it('returns true', () => {
        expect(isNumber(-1)).toEqual(true)
      })
    })

    describe('zero', () => {
      it('returns true', () => {
        expect(isNumber(0)).toEqual(true)
      })
    })
  })

  describe('when float', () => {
    describe('when positive', () => {
      it('returns true', () => {
        expect(isNumber(0.001)).toEqual(true)
      })
    })

    describe('when negative', () => {
      it('returns true', () => {
        expect(isNumber(-0.001)).toEqual(true)
      })
    })

    describe('when zero', () => {
      it('returns true', () => {
        expect(isNumber(0.0)).toEqual(true)
      })
    })
  })
})

describe('isPositiveInteger', () => {
  describe('when undefined', () => {
    it('returns false', () => {
      expect(isPositiveInteger(undefined)).toEqual(false)
    })
  })

  describe('when null', () => {
    it('returns false', () => {
      expect(isPositiveInteger(null)).toEqual(false)
    })
  })

  describe('when string', () => {
    describe('when empty string', () => {
      it('returns false', () => {
        expect(isPositiveInteger(' ')).toEqual(false)
      })
    })

    describe('when not empty string', () => {
      it('returns false', () => {
        expect(isPositiveInteger(' q ')).toEqual(false)
      })
    })

    describe('when stringified integer', () => {
      describe('positive', () => {
        it('returns true', () => {
          expect(isPositiveInteger('1')).toEqual(true)
        })
      })

      describe('negative', () => {
        it('returns false', () => {
          expect(isPositiveInteger('-1')).toEqual(false)
        })
      })

      describe('with plus', () => {
        it('returns false', () => {
          expect(isPositiveInteger('+1')).toEqual(false)
        })
      })

      describe('with spaces', () => {
        it('returns false', () => {
          expect(isPositiveInteger(' 1 ')).toEqual(false)
        })
      })

      describe('when 1e3', () => {
        it('returns false', () => {
          expect(isPositiveInteger('1e3')).toEqual(false)
        })
      })

      describe('zero', () => {
        it('returns false', () => {
          expect(isPositiveInteger('0')).toEqual(false)
        })
      })

      describe('with leading zeros', () => {
        it('returns true', () => {
          expect(isPositiveInteger('001')).toEqual(true)
        })
      })
    })

    describe('when stringified float', () => {
      describe('positive', () => {
        it('returns false', () => {
          expect(isPositiveInteger('0.01')).toEqual(false)
        })
      })

      describe('negative', () => {
        it('returns false', () => {
          expect(isPositiveInteger('-0.01')).toEqual(false)
        })
      })

      describe('with plus', () => {
        it('returns false', () => {
          expect(isPositiveInteger('+0.01')).toEqual(false)
        })
      })

      describe('with spaces', () => {
        it('returns false', () => {
          expect(isPositiveInteger(' 0.01 ')).toEqual(false)
        })
      })

      describe('with comma', () => {
        it('returns false', () => {
          expect(isPositiveInteger('0,01')).toEqual(false)
        })
      })

      describe('with extra period', () => {
        it('returns false', () => {
          expect(isPositiveInteger('0.0.')).toEqual(false)
        })
      })

      describe('with invalid format', () => {
        it('returns false', () => {
          expect(isPositiveInteger('.0')).toEqual(false)
        })
      })

      describe('zero', () => {
        it('returns false', () => {
          expect(isPositiveInteger('0.0')).toEqual(false)
        })
      })

      describe('with long value', () => {
        it('returns false', () => {
          expect(isPositiveInteger('0.00000000000000000001')).toEqual(false)
        })
      })

      describe('with leading zeros', () => {
        it('returns false', () => {
          expect(isPositiveInteger('000.001')).toEqual(false)
        })
      })
    })
  })

  describe('when integer', () => {
    describe('positive', () => {
      it('returns true', () => {
        expect(isPositiveInteger(1)).toEqual(true)
      })
    })

    describe('negative', () => {
      it('returns false', () => {
        expect(isPositiveInteger(-1)).toEqual(false)
      })
    })

    describe('zero', () => {
      it('returns false', () => {
        expect(isPositiveInteger(0)).toEqual(false)
      })
    })

    describe('with plus', () => {
      it('returns true', () => {
        expect(isPositiveInteger(+1)).toEqual(true)
      })
    })

    describe('when 1e3', () => {
      it('returns true', () => {
        expect(isPositiveInteger(1e3)).toEqual(true)
      })
    })
  })

  describe('when float', () => {
    describe('when positive', () => {
      it('returns false', () => {
        expect(isPositiveInteger(0.001)).toEqual(false)
      })
    })

    describe('when negative', () => {
      it('returns false', () => {
        expect(isPositiveInteger(-0.001)).toEqual(false)
      })
    })

    describe('when zero', () => {
      it('returns false', () => {
        expect(isPositiveInteger(0.0)).toEqual(false)
      })
    })
  })
})
