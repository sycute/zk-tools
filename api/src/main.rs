use psw_gift::apis::*;
use salvo::{
    cors::{AllowHeaders, AllowMethods, AllowOrigin, Cors},
    prelude::*,
};

#[shuttle_runtime::main]
async fn salvo() -> shuttle_salvo::ShuttleSalvo {
    let cors = Cors::new()
        .allow_origin(AllowOrigin::any())
        .allow_methods(AllowMethods::any())
        .allow_headers(AllowHeaders::any());
    let router = Router::new()
        .hoop(cors.into_handler())
        .push(Router::with_path("zkrpnew").get(create_zkrp))
        .push(Router::with_path("zkrpclaim").get(claim_zkrp));

    Ok(router.into())
}
