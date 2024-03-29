const letterToNumber = require('./convertLetterToNumber.json');
const numberToLetter = require('./convertNumberToLetter.json');
const newGameBoardInfos = require('./newGameBoardInfos.json');

const isBetween1and8Included = (number) => number <= 8 && number > 0;
const getPieceById = (arrayOfChessPieces, chessPieceId) => arrayOfChessPieces.find(({ id }) => chessPieceId === id);

const generateBoard = (width, height) => {
  if (!width || !height) {
    return [];
  }

  const result = [];

  for (let i = 0; i < width; i++) {
    const newRow = [];
    newRow.length = height;
    newRow.fill(0);
    result.push(newRow);
  }

  return result;
};

// The ID is the position of the piece at the beginning of the game
const getChessPieceNameFromId = (chessPieceId) => {
  if (chessPieceId[0] === '7' || chessPieceId[0] === '2') return 'pawn';
  else if (chessPieceId[0] === '1' || chessPieceId[0] === '8') {
    if (chessPieceId[1] === 'A' || chessPieceId[1] === 'H') return 'rook';
    if (chessPieceId[1] === 'B' || chessPieceId[1] === 'G') return 'knight';
    if (chessPieceId[1] === 'C' || chessPieceId[1] === 'F') return 'bishop';
    if (chessPieceId[1] === 'D') return 'queen';
    if (chessPieceId[1] === 'E') return 'king';
  }
};

const getPieceByCoordinate = (arrayOfChessPieces, coordinates) => {
  return arrayOfChessPieces.find((piece) => `${piece.position.x}${piece.position.y}` === coordinates);
};

const getColor = (id) => {
  if (id[0] === '1' || id[0] === '2') {
    return 'black';
  } else if (id[0] === '7' || id[0] === '8') {
    return 'white';
  }

  console.error(`ID error in getColor function with params ${id}`);
};

const getOppositeColor = (color) => {
  if (color === 'white') {
    return 'black';
  }

  if (color === 'black') {
    return 'white';
  }

  console.warn('Unknow color sent to getOppositeColor');
  return '';
};

const isSameColor = (id1, id2) => {
  const id1Color = getColor(id1);
  const id2Color = getColor(id2);

  if (!id1Color || !id2Color) {
    console.error(`ID error in isSameColor function with params ${id1} and ${id2}`);

    return false;
  }

  return id1Color === id2Color;
};

const getBishopAllowedMovements = (arrayOfChessPieces, chessPieceId) => {
  const { position } = getPieceById(arrayOfChessPieces, chessPieceId);
  const pieceOrdinate = letterToNumber[position.y];
  const pieceAbscissa = Number(position.x);
  let result1 = [];
  let result2 = [];
  let result3 = [];
  let result4 = [];

  for (let i = 1; i <= 8; i++) {
    const distanceFromPosition = i - pieceAbscissa;
    if (distanceFromPosition < 0) {
      // smaller absicca and ordinate of bishop
      const negativeDifferenceFromAbscissa = pieceOrdinate - distanceFromPosition;
      if (isBetween1and8Included(negativeDifferenceFromAbscissa)) {
        const coordinates = `${i}${numberToLetter[negativeDifferenceFromAbscissa]}`;
        const collideWithPiece = getPieceByCoordinate(arrayOfChessPieces, coordinates);
        if (collideWithPiece) {
          result1 = [];
        }

        if (!collideWithPiece || !isSameColor(collideWithPiece.id, chessPieceId)) {
          result1.push(coordinates);
        }
      }

      // smaller ordinate and bigger absicca of bishop
      const positiveDifferenceFromAbscissa = pieceOrdinate + distanceFromPosition;
      if (isBetween1and8Included(positiveDifferenceFromAbscissa)) {
        const coordinates = `${i}${numberToLetter[positiveDifferenceFromAbscissa]}`;
        const collideWithPiece = getPieceByCoordinate(arrayOfChessPieces, coordinates);
        if (collideWithPiece) {
          result2 = [];
        }

        if (!collideWithPiece || !isSameColor(collideWithPiece.id, chessPieceId)) {
          result2.push(coordinates);
        }
      }
    } else if (distanceFromPosition > 0) {
      // bigger ordinate and smaller absicca of bishop
      const negativeDifferenceFromAbscissa = pieceOrdinate - distanceFromPosition;
      if (isBetween1and8Included(negativeDifferenceFromAbscissa)) {
        const coordinates = `${i}${numberToLetter[negativeDifferenceFromAbscissa]}`;
        const collideWithPiece = getPieceByCoordinate(arrayOfChessPieces, coordinates);

        if (collideWithPiece) {
          if (!isSameColor(collideWithPiece.id, chessPieceId) && !result3.hasCollided) {
            result3.push(coordinates);
          }
          result3.hasCollided = true;
        }

        if (!result3.hasCollided) {
          result3.push(coordinates);
        }
      }

      // bigger absicca and ordinate of bishop
      const positiveDifferenceFromAbscissa = pieceOrdinate + distanceFromPosition;
      if (isBetween1and8Included(positiveDifferenceFromAbscissa)) {
        const coordinates = `${i}${numberToLetter[positiveDifferenceFromAbscissa]}`;
        const collideWithPiece = getPieceByCoordinate(arrayOfChessPieces, coordinates);

        if (collideWithPiece) {
          if (!isSameColor(collideWithPiece.id, chessPieceId) && !result4.hasCollided) {
            result4.push(coordinates);
          }
          result4.hasCollided = true;
        }

        if (!result4.hasCollided) {
          result4.push(coordinates);
        }
      }
    }
  }

  return [...result1, ...result2, ...result3, ...result4];
};

const getRookAllowedMovements = (arrayOfChessPieces, chessPieceId) => {
  const { position } = getPieceById(arrayOfChessPieces, chessPieceId);
  let result1 = [];
  let result2 = [];

  for (let i = 1; i <= 8; i++) {
    const coordinates = `${i}${position.y}`;
    const collideWithPiece = getPieceByCoordinate(arrayOfChessPieces, coordinates);

    if (i < position.x && collideWithPiece) {
      result1 = [];
      if (!isSameColor(collideWithPiece.id, chessPieceId)) {
        result1.push(coordinates);
      }
    } else if (i > position.x && collideWithPiece && !result1.isPieceBlocked) {
      result1.isPieceBlocked = true;

      if (!isSameColor(collideWithPiece.id, chessPieceId)) {
        result1.push(coordinates);
      }
    } else if (!collideWithPiece && !result1.isPieceBlocked) {
      result1.push(coordinates);
    }
  }

  for (let i = 1; i <= 8; i++) {
    const coordinates = `${position.x}${numberToLetter[i]}`;
    const collideWithPiece = getPieceByCoordinate(arrayOfChessPieces, coordinates);

    if (i < letterToNumber[position.y] && collideWithPiece) {
      result2 = [];
      if (!isSameColor(collideWithPiece.id, chessPieceId)) {
        result2.push(coordinates);
      }
    } else if (i > letterToNumber[position.y] && collideWithPiece && !result2.isPieceBlocked) {
      result2.isPieceBlocked = true;
      if (!isSameColor(collideWithPiece.id, chessPieceId)) {
        result2.push(coordinates);
      }
    } else if (!collideWithPiece && !result2.isPieceBlocked) {
      result2.push(coordinates);
    }
  }

  return result1.concat(result2);
};

const getKnightAllowedMovements = (arrayOfChessPieces, chessPieceId) => {
  const { position } = getPieceById(arrayOfChessPieces, chessPieceId);
  const pieceOrdinate = letterToNumber[position.y];
  const pieceAbscissa = Number(position.x);
  const result = [];

  if (isBetween1and8Included(pieceOrdinate - 2)) {
    if (isBetween1and8Included(pieceAbscissa - 1)) {
      const leftCoordinates = `${pieceAbscissa - 1}${numberToLetter[pieceOrdinate - 2]}`;
      const leftCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, leftCoordinates);

      if (leftCollideWithPiece) {
        if (!isSameColor(leftCollideWithPiece.id, chessPieceId)) {
          result.push(leftCoordinates);
        }
      } else {
        result.push(leftCoordinates);
      }
    }

    if (isBetween1and8Included(pieceAbscissa + 1)) {
      const rightCoordinates = `${pieceAbscissa + 1}${numberToLetter[pieceOrdinate - 2]}`;
      const rightCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, rightCoordinates);

      if (rightCollideWithPiece) {
        if (!isSameColor(rightCollideWithPiece.id, chessPieceId)) {
          result.push(rightCoordinates);
        }
      } else {
        result.push(rightCoordinates);
      }
    }
  }

  if (isBetween1and8Included(pieceOrdinate - 1)) {
    if (isBetween1and8Included(pieceAbscissa - 2)) {
      const leftCoordinates = `${pieceAbscissa - 2}${numberToLetter[pieceOrdinate - 1]}`;
      const leftCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, leftCoordinates);

      if (leftCollideWithPiece) {
        if (!isSameColor(leftCollideWithPiece.id, chessPieceId)) {
          result.push(leftCoordinates);
        }
      } else {
        result.push(leftCoordinates);
      }
    }

    if (isBetween1and8Included(pieceAbscissa + 2)) {
      const rightCoordinates = `${pieceAbscissa + 2}${numberToLetter[pieceOrdinate - 1]}`;
      const rightCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, rightCoordinates);

      if (rightCollideWithPiece) {
        if (!isSameColor(rightCollideWithPiece.id, chessPieceId)) {
          result.push(rightCoordinates);
        }
      } else {
        result.push(rightCoordinates);
      }
    }
  }

  if (isBetween1and8Included(pieceOrdinate + 1)) {
    if (isBetween1and8Included(pieceAbscissa - 2)) {
      const leftCoordinates = `${pieceAbscissa - 2}${numberToLetter[pieceOrdinate + 1]}`;
      const leftCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, leftCoordinates);

      if (leftCollideWithPiece) {
        if (!isSameColor(leftCollideWithPiece.id, chessPieceId)) {
          result.push(leftCoordinates);
        }
      } else {
        result.push(leftCoordinates);
      }
    }
    if (isBetween1and8Included(pieceAbscissa + 2)) {
      const rightCoordinates = `${pieceAbscissa + 2}${numberToLetter[pieceOrdinate + 1]}`;
      const rightCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, rightCoordinates);

      if (rightCollideWithPiece) {
        if (!isSameColor(rightCollideWithPiece.id, chessPieceId)) {
          result.push(rightCoordinates);
        }
      } else {
        result.push(rightCoordinates);
      }
    }
  }

  if (isBetween1and8Included(pieceOrdinate + 2)) {
    if (isBetween1and8Included(pieceAbscissa - 1)) {
      const leftCoordinates = `${pieceAbscissa - 1}${numberToLetter[pieceOrdinate + 2]}`;
      const leftCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, leftCoordinates);

      if (leftCollideWithPiece) {
        if (!isSameColor(leftCollideWithPiece.id, chessPieceId)) {
          result.push(leftCoordinates);
        }
      } else {
        result.push(leftCoordinates);
      }
    }

    if (isBetween1and8Included(pieceAbscissa + 1)) {
      const rightCoordinates = `${pieceAbscissa + 1}${numberToLetter[pieceOrdinate + 2]}`;
      const rightCollideWithPiece = getPieceByCoordinate(arrayOfChessPieces, rightCoordinates);

      if (rightCollideWithPiece) {
        if (!isSameColor(rightCollideWithPiece.id, chessPieceId)) {
          result.push(rightCoordinates);
        }
      } else {
        result.push(rightCoordinates);
      }
    }
  }

  return result;
};

const getQueenAllowedMovement = (arrayOfChessPieces, chessPieceId) => {
  return [...getBishopAllowedMovements(arrayOfChessPieces, chessPieceId), ...getRookAllowedMovements(arrayOfChessPieces, chessPieceId)];
};

const getKingAllowedMovement = (arrayOfChessPieces, chessPieceId) => {
  const { position } = getPieceById(arrayOfChessPieces, chessPieceId);
  const pieceOrdinate = letterToNumber[position.y];
  const pieceAbscissa = Number(position.x);
  const result = [];

  for (let i = -1; i < 2; i++) {
    for (let ii = -1; ii < 2; ii++) {
      const destinationOrdinate = pieceOrdinate + ii;
      const destinationAbscissa = pieceAbscissa + i;
      if (isBetween1and8Included(destinationOrdinate) && isBetween1and8Included(destinationAbscissa) && (i || ii)) {
        const coordinates = `${destinationAbscissa}${numberToLetter[destinationOrdinate]}`;
        const pieceAtCoordinate = getPieceByCoordinate(arrayOfChessPieces, coordinates);
        if (!pieceAtCoordinate || !isSameColor(pieceAtCoordinate.id, chessPieceId)) {
          result.push(coordinates);
        }
      }
    }
  }

  return result;
};

const getPawnAllowedMovement = (arrayOfChessPieces, chessPieceId) => {
  const { position } = getPieceById(arrayOfChessPieces, chessPieceId);
  const currentPieceCoordinate = `${position.x}${position.y}`;
  const pieceOrdinate = letterToNumber[position.y];
  const pieceAbscissa = Number(position.x);
  const pawnColor = getColor(chessPieceId);
  const direction = pawnColor === 'white' ? -1 : 1;
  const result = [];

  if (!pawnColor) {
    return result;
  }

  const coordinates = `${pieceAbscissa + direction}${numberToLetter[pieceOrdinate]}`;
  if (!getPieceByCoordinate(arrayOfChessPieces, coordinates)) {
    result.push(coordinates);

    const coordinatesOfPawnCharge = `${pieceAbscissa + direction * 2}${numberToLetter[pieceOrdinate]}`;
    if (currentPieceCoordinate === chessPieceId && !getPieceByCoordinate(arrayOfChessPieces, coordinatesOfPawnCharge)) {
      result.push(coordinatesOfPawnCharge);
    }
  }

  const leftTargetableCoordinate =
    isBetween1and8Included(pieceOrdinate - 1) && `${pieceAbscissa + direction}${numberToLetter[pieceOrdinate - 1]}`;
  const leftTargetablePiece = leftTargetableCoordinate && getPieceByCoordinate(arrayOfChessPieces, leftTargetableCoordinate);
  if (leftTargetablePiece && !isSameColor(leftTargetablePiece.id, chessPieceId)) {
    result.push(leftTargetableCoordinate);
  }

  const rightTargetableCoordinate =
    isBetween1and8Included(pieceOrdinate + 1) && `${pieceAbscissa + direction}${numberToLetter[pieceOrdinate + 1]}`;
  const rightTargetablePiece = rightTargetableCoordinate && getPieceByCoordinate(arrayOfChessPieces, rightTargetableCoordinate);
  if (rightTargetablePiece && !isSameColor(rightTargetablePiece.id, chessPieceId)) {
    result.push(rightTargetableCoordinate);
  }

  return result;
};

const getAllowedMovementByPieceType = {
  bishop: getBishopAllowedMovements,
  king: getKingAllowedMovement,
  knight: getKnightAllowedMovements,
  pawn: getPawnAllowedMovement,
  queen: getQueenAllowedMovement,
  rook: getRookAllowedMovements,
};

const checkIfMovementIsAllowed = (arrayOfChessPieces, newPosition, chessPieceId) => {
  const chessPiece = getPieceById(arrayOfChessPieces, chessPieceId);

  if (!chessPiece) {
    console.warn(`no piece currently on the board with id ${chessPieceId}`);
    return;
  }

  const getAllowedMovementFunction = getAllowedMovementByPieceType[chessPiece.type];

  if (!getAllowedMovementFunction) {
    console.warn(`error with piece ${chessPieceId}, no function related to type ${chessPiece.type}`);
    return false;
  }

  return getAllowedMovementFunction(arrayOfChessPieces, chessPieceId).includes(newPosition);
};

const ALLOWED_PROMOTIONS = ['rook', 'knight', 'bishop', 'queen'];
const isPromotionAllowed = (chessPiece, shouldPromoteTo, newPosition) => {
  if (!shouldPromoteTo || chessPiece.type !== 'pawn' || !ALLOWED_PROMOTIONS.includes(shouldPromoteTo)) {
    return false;
  }

  if ((chessPiece.color === 'white' && newPosition[0] === '8') || (chessPiece.color === 'black' && newPosition[0] === '1')) {
    return true;
  }

  return false;
};

const movePiece = (arrayOfChessPieces, chessPieceId, newPosition, shouldPromoteTo) => {
  if (!checkIfMovementIsAllowed(arrayOfChessPieces, newPosition, chessPieceId)) {
    console.warn('movement not allowed');
    return arrayOfChessPieces;
  }

  return arrayOfChessPieces
    .filter((chessPiece) => `${chessPiece.position.x}${chessPiece.position.y}` !== newPosition)
    .map((chessPiece) => {
      if (chessPieceId !== chessPiece.id) {
        return chessPiece;
      }

      chessPiece.position.x = newPosition[0];
      chessPiece.position.y = newPosition[1];

      if (isPromotionAllowed(chessPiece, shouldPromoteTo, newPosition)) {
        chessPiece.type = shouldPromoteTo;
      }

      return chessPiece;
    });
};

module.exports = {
  checkIfMovementIsAllowed,
  generateBoard,
  getAllowedMovementByPieceType,
  getBishopAllowedMovements,
  getChessPieceNameFromId,
  getKingAllowedMovement,
  getKnightAllowedMovements,
  getOppositeColor,
  getPawnAllowedMovement,
  getPieceById,
  getQueenAllowedMovement,
  getRookAllowedMovements,
  isPromotionAllowed,
  letterToNumber,
  movePiece,
  newGameBoardInfos,
  numberToLetter,
  ALLOWED_PROMOTIONS,
};
