use std::str::FromStr;

use sui_sdk::{rpc_types::SuiObjectDataOptions, types::base_types::ObjectID, SuiClientBuilder};

#[tokio::test]
async fn test_sui_flow() {
    let _ = demo().await;
}

async fn demo() -> Result<(), anyhow::Error> {
    let sui = SuiClientBuilder::default().build_testnet().await?;

    let data_opt = SuiObjectDataOptions {
        show_type: true,
        show_owner: true,
        show_previous_transaction: false,
        show_display: true,
        show_content: true,
        show_bcs: false,
        show_storage_rebate: false,
    };

    let obj_id = ObjectID::from_str("0x0000....0000")?;

    let object = sui
        .read_api()
        .get_object_with_options(obj_id, data_opt.clone())
        .await?;

    Ok(())
}
