const path = require("path");
const { assert } = require("chai");
const { wasm: wasm_tester, wasm } = require("circom_tester");
const { buildEddsa } = require("circomlibjs");
const { createMerkleTree, generateMerkleProof } = require("./utils/merkle.js");

const depth = 3;
randomArray = (length) =>
  [...new Array(length)].map(() => BigInt(Math.random() * 10 ** 45));
const secret_keys = randomArray(2 ** depth);
const chosen_key = secret_keys[Math.floor(Math.random() * secret_keys.length)];
const chosen_key_index = secret_keys.indexOf(chosen_key);
console.log(chosen_key_index);

describe("Circom circuit test", async () => {
  let field, hash;
  let circuit;

  before(async () => {
    field = (await buildEddsa()).babyJub.F;
    hash = (await buildEddsa()).poseidon;
    circuit = await wasm_tester(path.resolve("zk/circuits/merkle.circom"));
  });

  it("Inclusion in Merkle Tree proof", async () => {
    const merkle_tree = createMerkleTree(field, hash, secret_keys, depth);
    const merkle_root = merkle_tree[0];
    const merkle_proof = generateMerkleProof(
      merkle_tree,
      chosen_key_index,
      depth
    );

    const input = {
      key: chosen_key_index,
      value: chosen_key,
      root: merkle_root,
      siblings: merkle_proof,
    };
    const witness = await circuit.calculateWitness(input);
    await circuit.assertOut(witness, {});
  });
});
