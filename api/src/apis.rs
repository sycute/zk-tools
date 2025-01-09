use ark_bn254::{Bn254, Config};
use ark_circom::CircomReduction;
use ark_ec::bn::Bn;
use ark_groth16::{Groth16, ProvingKey};
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};
use ark_snark::SNARK;
use salvo::prelude::*;
use tracing::info;

use crate::{
    data::{get_circom_builder, PK_STR},
    utils::str_to_u64,
};

type ConstraintF = ark_bn254::Fr;

type GrothBn = Groth16<Bn254>;

#[handler]
pub async fn claim_zkrp(req: &mut Request, res: &mut Response) {
    info!("Route: claim_zkrp");

    let given: String = req.query("g").unwrap();
    let expected = req.query::<String>("e").unwrap();
    // let given = "sam";
    // let expected = "01000000000000000fbd1d3ac37b96e52be719a10ff37d53ccfb7f21313e3dd47f5b3915ca173809";

    let mut builder = get_circom_builder::<ConstraintF>();
    builder.push_input("in", str_to_u64(&given));

    let circom = builder.build().unwrap();

    let expected_bytes = hex::decode(expected).unwrap();
    let expected_inputs =
        Vec::<ConstraintF>::deserialize_compressed(expected_bytes.as_slice()).unwrap();

    let pk_bytes = hex::decode(&PK_STR).unwrap();
    let pk = ProvingKey::<Bn<Config>>::deserialize_compressed(pk_bytes.as_slice()).unwrap();

    let mut rng = ark_std::rand::thread_rng();
    let proof = Groth16::<Bn254, CircomReduction>::prove(&pk, circom, &mut rng).unwrap();

    let pvk = GrothBn::process_vk(&pk.vk).unwrap();

    let verified = GrothBn::verify_with_processed_vk(&pvk, &expected_inputs, &proof).unwrap();
    if !verified {
        res.status_code(StatusCode::OK);
        res.render(Text::Plain("Not expected"));
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
    info!("Route: create_zkrp");
    // let expected = "sam";
    let raw_expected: String = req.query("e").unwrap();

    let mut builder = get_circom_builder::<ConstraintF>();
    builder.push_input("in", str_to_u64(&raw_expected));

    let circom = builder.build().unwrap();

    let expected_inputs = circom.get_public_inputs().unwrap();

    // Print public_input
    let mut expected_inputs_bytes = Vec::new();
    expected_inputs
        .serialize_compressed(&mut expected_inputs_bytes)
        .unwrap();
    let expected_input_str = hex::encode(&expected_inputs_bytes);

    res.render(Text::Plain(expected_input_str));
}

#[tokio::test]
async fn test_write_json_text() {
    use salvo::test::ResponseExt;
    use salvo::test::TestClient;

    let router = Router::new().push(Router::with_path("test").get(create_zkrp));
    let mut res = TestClient::get("http://127.0.0.1:5800/test?e=123")
        .send(router)
        .await;
    let reply = res.take_string().await.unwrap();
    println!("{reply}");
}
