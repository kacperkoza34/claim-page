import fs from "fs";
import { createCA, createCert } from "mkcert";
import { createServer } from "vite";
import { viteConfig, CERT_FILE_PATH, KEY_FILE_PATH } from "./config.js";

(async () => {
  if (!fs.existsSync("certs")) {
    fs.mkdirSync("certs");
  }

  if (!fs.existsSync(CERT_FILE_PATH) || !fs.existsSync(KEY_FILE_PATH)) {
    const ca = await createCA({
      organization: "local",
      countryCode: "local",
      state: "local",
      locality: "local",
      validity: 365,
    });

    const { key, cert } = await createCert({
      domains: ["localhost"],
      validity: 365,
      ca: { key: ca.key, cert: ca.cert },
    });

    fs.writeFileSync(CERT_FILE_PATH, cert);
    fs.writeFileSync(KEY_FILE_PATH, key);
  }

  const server = await createServer({
    ...viteConfig,
    server: {
      https: {
        cert: fs.readFileSync(CERT_FILE_PATH),
        key: fs.readFileSync(KEY_FILE_PATH),
      },
    },
  });
  await server.listen();

  server.printUrls();
})();
