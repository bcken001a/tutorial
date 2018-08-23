File models/sample.cto"

/**
 * My commodity trading network
 */
namespace org.acme.mynetwork
// アセットの定義
asset Commodity identified by tradingSymbol {         // 主キーはidentified byで定義する
    o String tradingSymbol                            // 基本型の定義：　(oを使う)
    o String description
    o String mainExchange
    o Double quantity
    --> Trader owner                                  // 独自に定義した型を使う場合（-->を使う）
}

// 参加者の定義
participant Trader identified by tradeId {
    o String tradeId
    o String firstName
    o String lastName
}

// トランザクションの定義
transaction Trade {
    --> Commodity commodity
    --> Trader newOwner
}

"Script File lib/sample.js"

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.acme.mynetwork.Trade} trade - the trade to be processed
 * @transaction
 */
function tradeCommodity(trade) {
    trade.commodity.owner = trade.newOwner;

    // getAssetRegistryでorg.acme.mynetwork.CommodityのRegistryを取得
    // 以下はこの処理で使われているjavascriptの構文
    // 今は、methodにgetAssetRegistryが入る
    // return method()
    //     .then((function ()) {
    //        return 処理;
    // });
    //
    //
    return getAssetRegistry('org.acme.mynetwork.Commodity')
        .then(function (assetRegistry) {                        // assetRegistry = getAssetRegistry('org.acme.mynetwork.Commodity')
            return assetRegistry.update(trade.commodity);       // assetRegistryの情報をupdateで更新
        });
}

"Access Control permissions.acl"

/**
 * Access control rules for mynetwork
 */
rule Default {
    description: "Allow all participants access to all resources"
    participant: "ANY"
    operation: ALL
    resource: "org.acme.mynetwork.*"
    action: ALLOW
}

rule SystemACL {
  description:  "System ACL to permit all access"
  participant: "org.hyperledger.composer.system.Participant"
  operation: ALL
  resource: "org.hyperledger.composer.system.**"
  action: ALLOW
}

// 以下はリクエストのパラメータ例

"+ Create New Participant"
○Jenny
{
  "$class": "org.acme.mynetwork.Trader",
  "tradeId": "TRADER1",
  "firstName": "Jenny",
  "lastName": "Jones"
}

○Amy
{
  "$class": "org.acme.mynetwork.Trader",
  "tradeId": "TRADER2",
  "firstName": "Amy",
  "lastName": "Williams"
}

"+ Create New Asset"
{
  "$class": "org.acme.mynetwork.Commodity",
  "tradingSymbol": "ABC",
  "description": "Test commodity",
  "mainExchange": "Euronext",
  "quantity": 72.297,
  "owner": "resource:org.acme.mynetwork.Trader#TRADER1"
}

"Submit Transaction"
{
  "$class": "org.acme.mynetwork.Trade",
  "commodity": "resource:org.acme.mynetwork.Commodity#ABC",
  "newOwner": "resource:org.acme.mynetwork.Trader#TRADER2"
}
