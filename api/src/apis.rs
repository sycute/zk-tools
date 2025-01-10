use ark_bn254::{Bn254, Config};
use ark_circom::CircomReduction;
use ark_ec::bn::Bn;
use ark_groth16::{Groth16, ProvingKey};
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use ark_snark::SNARK;
use salvo::prelude::*;

use crate::{
    data::{get_circom_builder, PK_STR},
    utils::str_to_u64,
};

/// Size of scalars in the BN254 construction.
pub const SCALAR_SIZE: usize = 32;

type ConstraintF = ark_bn254::Fr;

type GrothBn = Groth16<Bn254>;

#[handler]
pub async fn claim_zkrp(req: &mut Request, res: &mut Response) {
    let given: String = req.query("g").unwrap();
    let expected = req.query::<String>("e").unwrap();

    let mut builder = get_circom_builder::<ConstraintF>();
    builder.push_input("in", str_to_u64(&given));

    let circom = builder.build().unwrap();

    let expected_bytes = hex::decode(expected).unwrap();
    let mut expected_inputs = Vec::new();
    for chunk in expected_bytes.chunks(SCALAR_SIZE) {
        expected_inputs.push(ConstraintF::deserialize_compressed(chunk).unwrap());
    }

    let pk_bytes = hex::decode(&PK_STR).unwrap();
    let pk = ProvingKey::<Bn<Config>>::deserialize_compressed(pk_bytes.as_slice()).unwrap();

    let mut rng = ark_std::rand::thread_rng();
    let proof = Groth16::<Bn254, CircomReduction>::prove(&pk, circom, &mut rng).unwrap();

    let pvk = GrothBn::process_vk(&pk.vk).unwrap();

    let verified = GrothBn::verify_with_processed_vk(&pvk, &expected_inputs, &proof).unwrap();
    if !verified {
        res.status_code(StatusCode::BAD_REQUEST);
        res.render(Text::Plain("Wrong params"));
        return;
    };

    // Print proof
    let mut proof_bytes = Vec::new();
    proof.serialize_compressed(&mut proof_bytes).unwrap();

    let proof_str = hex::encode(&proof_bytes);

    res.status_code(StatusCode::OK);
    res.render(Text::Plain(proof_str));
}

#[handler]
pub async fn create_zkrp(req: &mut Request, res: &mut Response) {
    let raw_expected: String = req.query("e").unwrap();

    let mut builder = get_circom_builder::<ConstraintF>();
    builder.push_input("in", str_to_u64(&raw_expected));

    let circom = builder.build().unwrap();

    let expected_inputs = circom.get_public_inputs().unwrap();

    // Print public_input
    let mut public_inputs_serialized = Vec::new();
    expected_inputs.iter().for_each(|x| {
        x.serialize_compressed(&mut public_inputs_serialized)
            .unwrap();
    });

    let expected_input_str = hex::encode(&public_inputs_serialized);

    res.render(Text::Plain(expected_input_str));
}

#[tokio::test]
async fn test_write_json_text() {
    use salvo::test::ResponseExt;
    use salvo::test::TestClient;

    // let router = Router::new().push(Router::with_path("zkrpnew").get(create_zkrp));

    // let mut res = TestClient::get("http://127.0.0.1:5800/zkrpnew?e=sam")
    //     .send(router)
    //     .await;
    // let expected = res.take_string().await.unwrap();
    // println!("{expected}");

    let router = Router::new().push(Router::with_path("zkrpclaim").get(claim_zkrp));
    let mut res = TestClient::get("http://127.0.0.1:5800/zkrpclaim?g=sam&e=0fbd1d3ac37b96e52be719a10ff37d53ccfb7f21313e3dd47f5b3915ca173809")
        .send(router)
        .await;

    let proof = res.take_string().await.unwrap();
    println!("{proof}")
}

#[tokio::test]
async fn print_vk() {
    let pk_bytes = hex::decode(&PK_STR).unwrap();
    let pk = ProvingKey::<Bn254>::deserialize_compressed(pk_bytes.as_slice()).unwrap();

    let pvk = GrothBn::process_vk(&pk.vk).unwrap();

    let mut vk_gamma_abc_g1_bytes = Vec::new();
    let mut alpha_g1_beta_g2_bytes = Vec::new();
    let mut gamma_g2_neg_pc_bytes = Vec::new();
    let mut delta_g2_neg_pc_bytes = Vec::new();

    pvk.vk
        .gamma_abc_g1
        .serialize_compressed(&mut vk_gamma_abc_g1_bytes)
        .unwrap();
    pvk.alpha_g1_beta_g2
        .serialize_compressed(&mut alpha_g1_beta_g2_bytes)
        .unwrap();
    pvk.gamma_g2_neg_pc
        .serialize_compressed(&mut gamma_g2_neg_pc_bytes)
        .unwrap();
    pvk.delta_g2_neg_pc
        .serialize_compressed(&mut delta_g2_neg_pc_bytes)
        .unwrap();

    // sui 中对最后两个做了预处理，以节省空间
    // 真实的字节需要在 move 中测试得到
    // println!("{}", hex::encode(vk_gamma_abc_g1_bytes));
    // println!("{}", hex::encode(alpha_g1_beta_g2_bytes));
    // println!("{}", hex::encode(gamma_g2_neg_pc_bytes));
    // println!("{}", hex::encode(delta_g2_neg_pc_bytes));
}
