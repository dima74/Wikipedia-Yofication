## Переменные окружения
* MIXPANEL_TOKEN - project token in https://mixpanel.com/project/1932540/app/settings/#project/1932540

## Toolforge login
```sh
ssh diralik@login.toolforge.org
become yofication
```

## Toolforge first time setup
Выполнять в shell tool-аккаунта:
```sh
toolforge build start https://github.com/dima74/Wikipedia-Yofication.git --ref toolforge
toolforge build show

toolforge webservice buildservice start --mount=none --mem=1Gi
# для следующих релизов после нового build:
toolforge webservice buildservice restart
```

### Новый релиз после push нового коммита
На Toolforge запустить build из этой ветки:
```sh
toolforge build start https://github.com/dima74/Wikipedia-Yofication.git --ref toolforge
toolforge build show
toolforge build logs
```

Когда статус build станет `Succeeded`, перезапустить backend:
```sh
toolforge webservice buildservice restart
toolforge webservice buildservice logs -f
```

### Логи и диагностика
```sh
toolforge build logs
toolforge webservice buildservice logs -f

# Current memory
kubectl top pod
# Max memory
kubectl get pod POD_NAME -o jsonpath='{.spec.containers[*].resources.limits.memory}{"\n"}'
```

## Update script at wikipedia
В папке frontend:
```sh
export WIKIPEDIA_PASSWORD=...
export NODE_OPTIONS=--openssl-legacy-provider
yarn run update_script_at_wikipedia
```
