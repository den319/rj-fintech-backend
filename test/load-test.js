const axios = require("axios");

const URL = "http://localhost:8000/api/v1/wallets/pay";

const USER_ID = "019cb61c-50b6-76ba-8732-7df2aa330dca";
const WALLET_ID = "019cb61c-50b0-7569-b928-74296dd1209f";

async function run() {
  const requests = [];

  for (let i = 0; i < 50; i++) {
    requests.push(
      axios.post(URL, {
        userId: USER_ID,
        walletId: WALLET_ID,
        amount: 500,
        idempotencyKey: `stress-${Date.now()}-${i}`
      })
    );
  }

  const results = await Promise.allSettled(requests)
        // .then(data => console.log(data));

  let success = 0;
  let failed = 0;

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      if (r.value.status === 200) {
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }
  });

  console.log("Success:", success);
  console.log("Failed:", failed);
}

run();