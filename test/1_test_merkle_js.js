const { assert } = require("chai");
const path = require("path");
const { buildEddsa } = require("circomlibjs");
const {
  createMerkleTree,
  generateMerkleProof,
  validateMerkleProof,
} = require("./utils/merkle.js");

let field, hash;

const depth = 3;
randomArray = (length, max) =>
  [...new Array(length)].map(() => Math.round(Math.random() * max));
const keys = randomArray(2 ** depth, 100);
const chosen_key = keys[Math.floor(Math.random() * keys.length)];
const siblings = keys.indexOf(chosen_key);

describe("Javascript functions test", async () => {
  before(async () => {
    field = (await buildEddsa()).babyJub.F;
    hash = (await buildEddsa()).poseidon;
  });

  it(`Create a level ${depth} Merkle tree, generate a Merkle proof and validate it`, async () => {
    const merkle_tree = createMerkleTree(field, hash, keys, depth);
    const merkle_root = merkle_tree[0];
    const merkle_proof = generateMerkleProof(merkle_tree, siblings, depth);
    assert(
      validateMerkleProof(
        field,
        hash,
        siblings,
        chosen_key,
        merkle_root,
        merkle_proof
      )
    );
  });
});
