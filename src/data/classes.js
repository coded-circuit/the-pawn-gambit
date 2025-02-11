import { Vector2, PieceType, PieceCooldown, assert } from "../global/utils";
import { nanoid } from "@reduxjs/toolkit";

export class PieceData {
  #pieceId = "";
  #position = new Vector2();
  #type = -1;
  #cooldown = 10;

  constructor(x, y, type) {
    this.#position.x = x;
    this.#position.y = y;
    this.#type = type;
    this.#cooldown = PieceCooldown[type];
    this.#pieceId = nanoid();

    assert(
      this.#type >= 0 && this.#type <= Object.keys(PieceType).length,
      "Invalid piece type!"
    );
  }

  getPosition() {
    return new Vector2(this.#position.x, this.#position.y);
  }

  getType() {
    return this.#type;
  }

  getPieceId() {
    return this.#pieceId;
  }

  setPosition(x, y) {
    this.#position.x = x;
    this.#position.y = y;
  }

  process() {
    if (this.#cooldown === 1) {
    } else if (this.#cooldown === 0) {
    } else {
    }
  }
}
