/**
 * Track the transfer from an account to another
 * @param {org.acme.mynetwork.Transfer} transfer - the transfer to be processed
 * @transaction
 * 今回はJavascriptのasync/awaitを使った↓
 * async function() {
 * 	await function();
 * }
 *
 * async/awaitについての記事が詳しい
 * https://qiita.com/soarflat/items/1a9613e023200bbebcb3
 */
async function sendTransaction(transfer) {

  var fee = transfer.amount * 0.0095;	// 先月メタップスが発表したQR決済の手数料と同じにしてみた

  if (transfer.amount + fee > transfer.from.balance) {
    // fromの残高が不足していたらトランザクションが実行できないようにする
    throw new Error('The Balance is not enought!');
  } else {
    // 送金
    transfer.from.balance -= (transfer.amount + fee);
    transfer.to.balance += transfer.amount;

    /**
     * Registryの更新
     */
    // ParticipantRegistryを取得
    const participantRegistry = await getParticipantRegistry('org.acme.mynetwork.Account');
    // 各アカウントの情報を更新
    await participantRegistry.update(transfer.from);
    await participantRegistry.update(transfer.to);
  }
}
