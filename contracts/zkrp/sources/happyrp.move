

module zkrp::happyrp;

use std::string::String;
use sui::balance::Balance;
use sui::coin;
use sui::coin::Coin;
use sui::dynamic_object_field as dof;
use sui::groth16;
use sui::groth16::PreparedVerifyingKey;
use sui::hex;
use sui::package;
use sui::random;
use sui::random::Random;
use sui::transfer::{share_object, public_transfer};
use sui::vec_map;
use sui::vec_map::VecMap;


// ======= ERRORS ======= //
const E_Wrong_Nums: u64 = 1;
const E_Not_Exists: u64 = 2;
const E_Already_Claimed: u64 = 3;
const E_Already_Used: u64 = 4;
const E_UnVerified: u64 = 5;

public struct HAPPYRP has drop{}

public struct RPRecord has key {
    id: UID,
    pvk: PreparedVerifyingKey,
}

public struct RP<phantom C> has key, store {
    id: UID,
    sender: address,
    nums: u64,
    balance: Balance<C>,
    proof_inputs: String,
    proofs: VecMap<String, bool>,
    claimers: vector<address>,
}

fun init(otw: HAPPYRP, ctx: &mut TxContext) {

    let sender = tx_context::sender(ctx);
    let publisher = package::claim(otw, ctx);
    public_transfer(publisher, sender);

    let vk_gamma_abc_g1_bytes= x"61de9dbe26857523b34a4b3aff5a1ec07f476697c4b35014b1b585acfc01a9835a0df67ef8632191164c67f274de355176281987dffb02fb824d9fc4787f7924";
    let alpha_g1_beta_g2_bytes = x"0d14dc30b678357d988b3eb0e8ada11bc7b2b5d2cf0c1fe27522cb2a819b7c044a601bd9302a94a80677a9f72ebeaada131e9bfba30621c8f038b547beb9962e182089742c1d388436771390c6af9937729c39e6414746ee5636c4741d1f220df45c80a7cded5ad653bc4f8b201c94054918dee160e1dc90cea027d4ec69e01a6df0f8d739d7911aa63b6b6923f10cdce763de1046fe0f91d590f5f510397611c57ac6daac2f9222d8cc3130e57f99dcd2edecb3e1d11b860c0d9d64a5dda30f42b8a8e513c9d5983486332c3ecd1236192b988666c15818838559bc27b6a50f49fee88fd43ac88dc3e75419bfd451374e25b8c4845b4bfcbd460ad48bb55016e4e1edf293696a43b76c8a5feffe6cfddb59cd7bc0246c1784061ed3eff2280a74e56fcabc5b93d84d72e10a0ad78079b02d06cc8c3ae435936ce2e85722d82b9480a46f039988a80cf4ca669c026100f8ce3fbc5298180dec08d2055d7a621ad3cc4fdd99242a86d7c80528d3b438c4669288c56b77abb8367528a31f01c511";
    let gamma_g2_neg_pc_bytes = x"edf692d95cbdde46ddda5ef7d422436779445c5e66006a42761e1f12efde0018c212f3aeb785e49712e7a9353349aaf1255dfb31b7bf60723a480d9293938e99";
    let delta_g2_neg_pc_bytes = x"7c1f4ede10b2d15fc293b236d807076dd40678439b4f37371d8586ce11d00019bb4a2eb16f113f01ae4ba0ec6064f76d33d2d62ec1fb47c08ac13925711aed82";

    share_object(RPRecord{
        id: object::new(ctx),
        pvk: groth16::pvk_from_bytes(vk_gamma_abc_g1_bytes, alpha_g1_beta_g2_bytes,gamma_g2_neg_pc_bytes,delta_g2_neg_pc_bytes),
    })
}

public fun create_rp<T>(record: &mut RPRecord, coin: Coin<T>, nums: u64, proof_inputs: String, ctx: &mut TxContext) {
    assert!(nums > 0, E_Wrong_Nums);
    assert!(coin.value() >= nums, E_Wrong_Nums);

    let obj_id = object::new(ctx);
    let key = object::uid_to_inner(&obj_id);
    let rp = RP{
        id: obj_id,
        sender: ctx.sender(),
        nums,
        proof_inputs,
        balance: coin.into_balance(),
        claimers: vector::empty(),
        proofs: vec_map::empty(),
    };

    dof::add(&mut record.id, key, rp);
}

entry fun claim<T>(record: &mut RPRecord, rp_key: ID, rdm: &Random, proof_points: String, ctx: &mut TxContext) {
    assert!(dof::exists_(&record.id, rp_key), E_Not_Exists);

    let sender = ctx.sender();
    let rp = dof::borrow_mut<ID, RP<T>>(&mut record.id, rp_key);

    assert!(!rp.claimers.contains(&sender), E_Already_Claimed);
    assert!(!rp.proofs.contains(&proof_points), E_Already_Used);
    assert!(g16_verify(&record.pvk, rp.proof_inputs, proof_points), E_UnVerified);

    let left_num = rp.nums - rp.claimers.length();

    if (left_num ==1 ) {
        let rp = dof::remove<ID, RP<T>>(&mut record.id, rp_key);
        let RP {id, balance, sender: _, claimers: _, proof_inputs:_, proofs:_, nums:_} = rp;

        public_transfer(coin::from_balance(balance, ctx), sender);

        object::delete(id);
    } else {
        let left_amt = rp.balance.value();

        let mut rng = random::new_generator(rdm, ctx);
        let claimed_amt = random::generate_u64_in_range(&mut rng, 0, left_amt * 2 / left_num);

        public_transfer(coin::from_balance(rp.balance.split(claimed_amt), ctx), sender);

        rp.claimers.push_back(sender);
        rp.proofs.insert(proof_points, true);
    }
}

fun g16_verify(pvk: &PreparedVerifyingKey, pub_inputs: String, proof_points: String): bool {

    let proof_p = groth16::proof_points_from_bytes(hex::decode(proof_points.into_bytes()));
    let public_inputs= groth16::public_proof_inputs_from_bytes(hex::decode(pub_inputs.into_bytes()));

    groth16::verify_groth16_proof(&groth16::bn254(), pvk, &public_inputs, &proof_p)
}
