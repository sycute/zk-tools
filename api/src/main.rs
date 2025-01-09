use psw_gift::apis::*;
use salvo::prelude::*;

#[shuttle_runtime::main]
async fn salvo() -> shuttle_salvo::ShuttleSalvo {
    let router = Router::new()
        .push(Router::with_path("zkrpnew").get(create_zkrp))
        .push(Router::with_path("zkrpclaim").get(claim_zkrp));

    Ok(router.into())
}
