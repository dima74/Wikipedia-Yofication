## Переменные окружения
* MIXPANEL_TOKEN - project token in https://mixpanel.com/project/1932540/app/settings/#project/1932540

## fly.io
fly secrets set MIXPANEL_TOKEN=...
fly deploy

## Update script at wikipedia
В папке frontend:
```sh
export WIKIPEDIA_PASSWORD=...
export NODE_OPTIONS=--openssl-legacy-provider
yarn run update_script_at_wikipedia
```
