const sdk = require('./index.js');
const expectedGeneratedBoard = require('./expected/generatedBoard.json');

it('should generate an array of arrays', () => {
  expect(sdk.generateBoard(8, 8)).toEqual(expectedGeneratedBoard);
  expect(sdk.generateBoard(0, 0)).toEqual([]);
  expect(sdk.generateBoard(8, 0)).toEqual([]);
  expect(sdk.generateBoard(0, 8)).toEqual([]);
});

it('should get the piece name from pieceID', () => {
  expect(sdk.getChessPieceNameFromId('1A')).toBe('rook');
  expect(sdk.getChessPieceNameFromId('2A')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('1B')).toBe('knight');
  expect(sdk.getChessPieceNameFromId('2B')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('1C')).toBe('bishop');
  expect(sdk.getChessPieceNameFromId('2C')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('1D')).toBe('queen');
  expect(sdk.getChessPieceNameFromId('2D')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('1E')).toBe('king');
  expect(sdk.getChessPieceNameFromId('7E')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('8F')).toBe('bishop');
  expect(sdk.getChessPieceNameFromId('7F')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('8G')).toBe('knight');
  expect(sdk.getChessPieceNameFromId('7G')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('8H')).toBe('rook');
  expect(sdk.getChessPieceNameFromId('7H')).toBe('pawn');
  expect(sdk.getChessPieceNameFromId('5A')).toBeUndefined();
});

it('should handle bishop default movement', () => {
  expect(sdk.getBishopAllowedMovements([{ id: '1C', position: { x: '3', y: 'E' } }], '1C')).toEqual([
    '1G',
    '2F',
    '1C',
    '2D',
    '4D',
    '5C',
    '6B',
    '7A',
    '4F',
    '5G',
    '6H',
  ]);

  expect(sdk.getBishopAllowedMovements([{ id: '1C', position: { x: '1', y: 'C' } }], '1C')).toEqual([
    '2B',
    '3A',
    '2D',
    '3E',
    '4F',
    '5G',
    '6H',
  ]);

  expect(sdk.getBishopAllowedMovements([{ id: '1C', position: { x: '8', y: 'C' } }], '1C')).toEqual([
    '3H',
    '4G',
    '5F',
    '6E',
    '7D',
    '6A',
    '7B',
  ]);

  expect(sdk.getBishopAllowedMovements([{ id: '1C', position: { x: '8', y: 'A' } }], '1C')).toEqual([
    '1H',
    '2G',
    '3F',
    '4E',
    '5D',
    '6C',
    '7B',
  ]);

  expect(sdk.getBishopAllowedMovements([{ id: '1C', position: { x: '1', y: 'H' } }], '1C')).toEqual([
    '2G',
    '3F',
    '4E',
    '5D',
    '6C',
    '7B',
    '8A',
  ]);

  expect(sdk.getBishopAllowedMovements([{ id: '1C', position: { x: '1', y: 'A' } }], '1C')).toEqual([
    '2B',
    '3C',
    '4D',
    '5E',
    '6F',
    '7G',
    '8H',
  ]);

  expect(sdk.getBishopAllowedMovements([{ id: '1C', position: { x: '8', y: 'H' } }], '1C')).toEqual([
    '1A',
    '2B',
    '3C',
    '4D',
    '5E',
    '6F',
    '7G',
  ]);
});

it.only('should handle bishop collision', () => {
  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '7', y: 'B' } },
        { id: '2B', position: { x: '6', y: 'C' } },
      ],
      '1C'
    )
  ).toEqual(['6A', '8A', '8C']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '7', y: 'B' } },
        { id: '7B', position: { x: '6', y: 'C' } },
      ],
      '1C'
    )
  ).toEqual(['6C', '6A', '8A', '8C']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '2', y: 'B' } },
        { id: '2B', position: { x: '3', y: 'C' } },
      ],
      '1C'
    )
  ).toEqual(['1C', '1A', '3A']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '2', y: 'B' } },
        { id: '8A', position: { x: '3', y: 'C' } },
      ],
      '1C'
    )
  ).toEqual(['1C', '1A', '3A', '3C']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '2', y: 'G' } },
        { id: '2B', position: { x: '3', y: 'F' } },
      ],
      '1C'
    )
  ).toEqual(['1H', '1F', '3H']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '2', y: 'G' } },
        { id: '7A', position: { x: '3', y: 'F' } },
      ],
      '1C'
    )
  ).toEqual(['1H', '1F', '3F', '3H']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '7', y: 'G' } },
        { id: '2B', position: { x: '6', y: 'F' } },
      ],
      '1C'
    )
  ).toEqual(['6H', '8F', '8H']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '7', y: 'G' } },
        { id: '7A', position: { x: '6', y: 'F' } },
      ],
      '1C'
    )
  ).toEqual(['6H', '6F', '8F', '8H']);

  expect(
    sdk.getBishopAllowedMovements(
      [
        { id: '1C', position: { x: '5', y: 'D' } },
        { id: '8A', position: { x: '8', y: 'A' } },
        { id: '7A', position: { x: '7', y: 'B' } },
        { id: '7F', position: { x: '7', y: 'F' } },
        { id: '8G', position: { x: '8', y: 'G' } },
      ],
      '1C'
    )
  ).toEqual(['1H', '2G', '3F', '4E', '2A', '3B', '4C', '6C', '7B', '6E', '7F']);
});

it('should handle rook default movement', () => {
  expect(sdk.getRookAllowedMovements([{ id: '8H', position: { x: '4', y: 'A' } }], '8H')).toEqual([
    '1A',
    '2A',
    '3A',
    '5A',
    '6A',
    '7A',
    '8A',
    '4B',
    '4C',
    '4D',
    '4E',
    '4F',
    '4G',
    '4H',
  ]);
  expect(sdk.getRookAllowedMovements([{ id: '8H', position: { x: '1', y: 'D' } }], '8H')).toEqual([
    '2D',
    '3D',
    '4D',
    '5D',
    '6D',
    '7D',
    '8D',
    '1A',
    '1B',
    '1C',
    '1E',
    '1F',
    '1G',
    '1H',
  ]);
});

it('should handle rook collision', () => {
  expect(
    sdk.getRookAllowedMovements(
      [
        { id: '8H', position: { x: '4', y: 'A' } },
        { id: '7H', position: { x: '5', y: 'A' } },
      ],
      '8H'
    )
  ).toEqual(['1A', '2A', '3A', '4B', '4C', '4D', '4E', '4F', '4G', '4H']);
  expect(
    sdk.getRookAllowedMovements(
      [
        { id: '8H', position: { x: '4', y: 'A' } },
        { id: '7H', position: { x: '3', y: 'A' } },
      ],
      '8H'
    )
  ).toEqual(['5A', '6A', '7A', '8A', '4B', '4C', '4D', '4E', '4F', '4G', '4H']);
  expect(
    sdk.getRookAllowedMovements(
      [
        { id: '8H', position: { x: '4', y: 'A' } },
        { id: '1A', position: { x: '5', y: 'A' } },
      ],
      '8H'
    )
  ).toEqual(['1A', '2A', '3A', '5A', '4B', '4C', '4D', '4E', '4F', '4G', '4H']);
  expect(
    sdk.getRookAllowedMovements(
      [
        { id: '8H', position: { x: '4', y: 'A' } },
        { id: '1A', position: { x: '3', y: 'A' } },
      ],
      '8H'
    )
  ).toEqual(['3A', '5A', '6A', '7A', '8A', '4B', '4C', '4D', '4E', '4F', '4G', '4H']);
  expect(
    sdk.getRookAllowedMovements(
      [
        { id: '1A', position: { x: '1', y: 'A' } },
        { id: '2A', position: { x: '2', y: 'A' } },
        { id: '1B', position: { x: '1', y: 'B' } },
        { id: '8A', position: { x: '8', y: 'A' } },
      ],
      '1A'
    )
  ).toEqual([]);
});

it('should handle knight default movement', () => {
  expect(sdk.getKnightAllowedMovements([{ id: '8B', position: { x: '5', y: 'D' } }], '8B')).toEqual([
    '4B',
    '6B',
    '3C',
    '7C',
    '3E',
    '7E',
    '4F',
    '6F',
  ]);
  expect(sdk.getKnightAllowedMovements([{ id: '8B', position: { x: '1', y: 'A' } }], '8B')).toEqual(['3B', '2C']);
  expect(sdk.getKnightAllowedMovements([{ id: '8B', position: { x: '1', y: 'H' } }], '8B')).toEqual(['2F', '3G']);
  expect(sdk.getKnightAllowedMovements([{ id: '8B', position: { x: '8', y: 'A' } }], '8B')).toEqual(['6B', '7C']);
  expect(sdk.getKnightAllowedMovements([{ id: '8B', position: { x: '8', y: 'H' } }], '8B')).toEqual(['7F', '6G']);
});

it('should handle knight collision', () => {
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '5', y: 'D' } },
        { id: '7B', position: { x: '4', y: 'B' } },
        { id: '7C', position: { x: '6', y: 'B' } },
        { id: '7A', position: { x: '3', y: 'C' } },
        { id: '7D', position: { x: '7', y: 'C' } },
        { id: '7E', position: { x: '3', y: 'E' } },
        { id: '7F', position: { x: '7', y: 'E' } },
        { id: '7G', position: { x: '4', y: 'F' } },
        { id: '7H', position: { x: '6', y: 'F' } },
      ],
      '8B'
    )
  ).toEqual([]);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '1', y: 'H' } },
        { id: '1B', position: { x: '2', y: 'F' } },
      ],
      '8B'
    )
  ).toEqual(['2F', '3G']);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '1', y: 'H' } },
        { id: '8C', position: { x: '2', y: 'F' } },
      ],
      '8B'
    )
  ).toEqual(['3G']);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '8', y: 'A' } },
        { id: '1B', position: { x: '6', y: 'B' } },
      ],
      '8B'
    )
  ).toEqual(['6B', '7C']);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '8', y: 'A' } },
        { id: '7B', position: { x: '6', y: 'B' } },
      ],
      '8B'
    )
  ).toEqual(['7C']);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '1', y: 'A' } },
        { id: '1B', position: { x: '3', y: 'B' } },
      ],
      '8B'
    )
  ).toEqual(['3B', '2C']);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '1', y: 'A' } },
        { id: '7B', position: { x: '3', y: 'B' } },
      ],
      '8B'
    )
  ).toEqual(['2C']);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '8', y: 'H' } },
        { id: '1B', position: { x: '7', y: 'F' } },
      ],
      '8B'
    )
  ).toEqual(['7F', '6G']);
  expect(
    sdk.getKnightAllowedMovements(
      [
        { id: '8B', position: { x: '8', y: 'H' } },
        { id: '7B', position: { x: '7', y: 'F' } },
      ],
      '8B'
    )
  ).toEqual(['6G']);
});

it('should handle queen default movement', () => {
  expect(sdk.getQueenAllowedMovement([{ id: '1C', position: { x: '8', y: 'A' } }], '1C')).toEqual([
    '1H',
    '2G',
    '3F',
    '4E',
    '5D',
    '6C',
    '7B',
    '1A',
    '2A',
    '3A',
    '4A',
    '5A',
    '6A',
    '7A',
    '8B',
    '8C',
    '8D',
    '8E',
    '8F',
    '8G',
    '8H',
  ]);

  expect(sdk.getQueenAllowedMovement([{ id: '1C', position: { x: '1', y: 'H' } }], '1C')).toEqual([
    '2G',
    '3F',
    '4E',
    '5D',
    '6C',
    '7B',
    '8A',
    '2H',
    '3H',
    '4H',
    '5H',
    '6H',
    '7H',
    '8H',
    '1A',
    '1B',
    '1C',
    '1D',
    '1E',
    '1F',
    '1G',
  ]);

  expect(sdk.getQueenAllowedMovement([{ id: '1C', position: { x: '1', y: 'A' } }], '1C')).toEqual([
    '2B',
    '3C',
    '4D',
    '5E',
    '6F',
    '7G',
    '8H',
    '2A',
    '3A',
    '4A',
    '5A',
    '6A',
    '7A',
    '8A',
    '1B',
    '1C',
    '1D',
    '1E',
    '1F',
    '1G',
    '1H',
  ]);

  expect(sdk.getQueenAllowedMovement([{ id: '1C', position: { x: '8', y: 'H' } }], '1C')).toEqual([
    '1A',
    '2B',
    '3C',
    '4D',
    '5E',
    '6F',
    '7G',
    '1H',
    '2H',
    '3H',
    '4H',
    '5H',
    '6H',
    '7H',
    '8A',
    '8B',
    '8C',
    '8D',
    '8E',
    '8F',
    '8G',
  ]);
});

it('should handle king default movement', () => {
  expect(sdk.getKingAllowedMovement([{ id: '1C', position: { x: '2', y: 'B' } }], '1C')).toEqual([
    '1A',
    '1B',
    '1C',
    '2A',
    '2C',
    '3A',
    '3B',
    '3C',
  ]);
});

it('should handle king collision', () => {
  expect(
    sdk.getKingAllowedMovement(
      [
        { id: '1C', position: { x: '2', y: 'B' } },
        { id: '2C', position: { x: '1', y: 'A' } },
        { id: '2D', position: { x: '1', y: 'B' } },
        { id: '2E', position: { x: '1', y: 'C' } },
        { id: '8B', position: { x: '2', y: 'A' } },
        { id: '8B', position: { x: '2', y: 'C' } },
        { id: '8B', position: { x: '3', y: 'A' } },
        { id: '1A', position: { x: '3', y: 'B' } },
        { id: '1B', position: { x: '3', y: 'C' } },
      ],
      '1C'
    )
  ).toEqual(['2A', '2C', '3A']);
});

it('should handle pawn default movement', () => {
  expect(sdk.getPawnAllowedMovement([{ id: '2B', position: { x: '2', y: 'B' } }], '2B')).toEqual(['3B', '4B']);
  expect(sdk.getPawnAllowedMovement([{ id: '2B', position: { x: '3', y: 'B' } }], '2B')).toEqual(['4B']);
  expect(sdk.getPawnAllowedMovement([{ id: '7B', position: { x: '7', y: 'B' } }], '7B')).toEqual(['6B', '5B']);
  expect(sdk.getPawnAllowedMovement([{ id: '7B', position: { x: '6', y: 'B' } }], '7B')).toEqual(['5B']);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '2B', position: { x: '2', y: 'B' } },
        { id: '1B', position: { x: '3', y: 'B' } },
      ],
      '2B'
    )
  ).toEqual([]);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '2B', position: { x: '3', y: 'B' } },
        { id: '1B', position: { x: '4', y: 'B' } },
      ],
      '2B'
    )
  ).toEqual([]);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '7B', position: { x: '7', y: 'B' } },
        { id: '2B', position: { x: '6', y: 'B' } },
      ],
      '7B'
    )
  ).toEqual([]);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '7B', position: { x: '6', y: 'B' } },
        { id: '2B', position: { x: '5', y: 'B' } },
      ],
      '7B'
    )
  ).toEqual([]);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '2B', position: { x: '2', y: 'B' } },
        { id: '7B', position: { x: '3', y: 'A' } },
        { id: '7B', position: { x: '3', y: 'C' } },
      ],
      '2B'
    )
  ).toEqual(['3B', '4B', '3A', '3C']);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '2B', position: { x: '3', y: 'B' } },
        { id: '7B', position: { x: '4', y: 'A' } },
        { id: '7B', position: { x: '4', y: 'C' } },
      ],
      '2B'
    )
  ).toEqual(['4B', '4A', '4C']);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '7B', position: { x: '7', y: 'B' } },
        { id: '2B', position: { x: '6', y: 'C' } },
        { id: '2B', position: { x: '6', y: 'A' } },
      ],
      '7B'
    )
  ).toEqual(['6B', '5B', '6A', '6C']);
  expect(
    sdk.getPawnAllowedMovement(
      [
        { id: '7B', position: { x: '6', y: 'B' } },
        { id: '2B', position: { x: '5', y: 'C' } },
        { id: '7C', position: { x: '5', y: 'A' } },
      ],
      '7B'
    )
  ).toEqual(['5B', '5C']);
});

it('should update the gameboard if movement is allowed', () => {
  expect(sdk.movePiece([{ id: '2C', position: { x: '2', y: 'C' }, type: 'pawn' }], '2C', '4C')).toEqual([
    { id: '2C', position: { x: '4', y: 'C' }, type: 'pawn' },
  ]);
  expect(
    sdk.movePiece(
      [
        { id: '2C', position: { x: '2', y: 'C' }, type: 'pawn' },
        { id: '2B', position: { x: '3', y: 'C' }, type: 'pawn' },
      ],
      '2C',
      '4C'
    )
  ).toEqual([
    { id: '2C', position: { x: '2', y: 'C' }, type: 'pawn' },
    { id: '2B', position: { x: '3', y: 'C' }, type: 'pawn' },
  ]);
  expect(
    sdk.movePiece(
      [
        { id: '2C', position: { x: '2', y: 'C' }, type: 'pawn' },
        { id: '7B', position: { x: '3', y: 'B' }, type: 'pawn' },
      ],
      '2C',
      '3B'
    )
  ).toEqual([{ id: '2C', position: { x: '3', y: 'B' }, type: 'pawn' }]);
});
