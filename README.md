# Hedera Claiming page

## Getting Started

1. Install project dependencies using npm:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory of the project with the following environment variables:

   ```env
   VITE_HEDERA_NETWORK=testnet
   VITE_HEDERA_SMART_CONTRACT_ID=0.0.12345

   VITE_WALLET_CONFIG_NAME=My app
   VITE_WALLET_CONFIG_DESCRIPTION=My app description
   VITE_WALLET_CONFIG_ICON_URL=https://myappicon.example/
   VITE_WALLET_CONFIG_APP_URL=https://walletconfginurl.example/
   ```

## Available Scripts


Start project in dev mode
   ```bash
   npm run dev
   ```

Build project
   ```bash
   npm run build
   ```

Serve static files after build
   ```bash
   npm run preview
   ```

Run linter
   ```bash
   npm run lint
   ```

## Deployment with github pages

1. Fork repo 
2. On your forked repo go to `Settings` > `Pages`
3. Select Github actions

![Alt text](assets/image.png)

4. Go to `Actions` and select `Deploy static content to pages`

![Alt text](assets/image-1.png)

5. Run workflow with yor details

![Alt text](assets/image-2.png)


Alternatively you can set you environment variables in repo setting. 

![Alt text](assets/image-3.png)

Variables set in that way take priority over values provided in `Run workflow` form.