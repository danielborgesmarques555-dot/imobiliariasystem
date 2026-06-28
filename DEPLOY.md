# Deploy e dominio

Este projeto hoje e um sistema estatico: `index.html`, `styles.css`, `script.js` e `assets/`.
Ele pode subir em hospedagem estatica simples, VPS com Nginx, Vercel, Netlify, Cloudflare Pages ou GitHub Pages.

## Caminho recomendado para comecar

1. Criar repositorio no GitHub.
2. Subir este projeto para o repositorio.
3. Publicar em hospedagem estatica.
4. Apontar o dominio para a hospedagem.
5. Depois evoluir para backend, banco PostgreSQL e storage.

## O que precisa para colocar no ar

- Conta GitHub.
- Repositorio, por exemplo: `regis-imobiliaria`.
- Dominio, por exemplo: `regisimobiliaria.com.br`.
- Hospedagem:
  - simples: Vercel, Netlify, Cloudflare Pages ou GitHub Pages;
  - profissional: VPS Linux com Nginx/Caddy;
  - futuro serio: backend + banco + storage.
- SSL/HTTPS ativo.

## Publicacao estatica simples

Como nao ha build, a pasta raiz pode ser publicada diretamente.
Arquivo principal: `index.html`.

Comandos locais:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

URL local:

```txt
http://127.0.0.1:5173/
```

## Google Cloud Run

O projeto tambem esta preparado para Cloud Run usando Node.js.

Arquivos usados:

- `package.json`: define `npm start`.
- `dev-server.cjs`: servidor HTTP que respeita a porta `PORT` do Cloud Run.
- `Dockerfile`: imagem simples para publicar o site.
- `.dockerignore`: evita enviar arquivos locais, backups e segredos.

### 1. Instalar e autenticar Google Cloud CLI

Instale a CLI:

```txt
https://cloud.google.com/sdk/docs/install
```

Depois autentique:

```powershell
gcloud auth login
gcloud config set project SEU_PROJECT_ID
```

### 2. Habilitar APIs

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

### 3. Deploy direto do codigo

Execute na pasta do projeto:

```powershell
gcloud run deploy regis-imobiliaria --source . --region southamerica-east1 --allow-unauthenticated
```

Ao final, o Cloud Run mostrara uma URL HTTPS publica.

### 4. Deploy usando Dockerfile

Alternativa com build por container:

```powershell
gcloud builds submit --tag southamerica-east1-docker.pkg.dev/SEU_PROJECT_ID/regis/regis-imobiliaria
gcloud run deploy regis-imobiliaria --image southamerica-east1-docker.pkg.dev/SEU_PROJECT_ID/regis/regis-imobiliaria --region southamerica-east1 --allow-unauthenticated
```

### Observacao importante

Cloud Run deixa o sistema online, mas os dados do sistema ainda continuam no navegador enquanto o app estiver usando armazenamento local/IndexedDB. Para operacao com varios usuarios compartilhando os mesmos dados, o proximo passo e conectar um backend e banco em nuvem.

## Banco de dados em nuvem

O Cloud Run tambem pode servir a API do sistema:

- `GET /api/health`: verifica se o backend esta ativo.
- `GET /api/state`: carrega dados do Firestore.
- `POST /api/state`: salva dados no Firestore.

O banco usado e o Firestore em modo nativo.

Colecoes sincronizadas:

- `properties`
- `clients`
- `owners`
- `contracts`
- `team`
- `appointments`
- `invoices`
- `trash`
- `company`

Comandos usados para preparar o banco:

```powershell
gcloud services enable firestore.googleapis.com --project imobiliariasystem-500804
gcloud firestore databases create --database="(default)" --location=southamerica-east1 --type=firestore-native --project imobiliariasystem-500804
gcloud projects add-iam-policy-binding imobiliariasystem-500804 --member="serviceAccount:392338037538-compute@developer.gserviceaccount.com" --role="roles/datastore.user"
```

Observacao: os dados antigos que estavam em `127.0.0.1` continuam no armazenamento local daquela origem. Para levar esses dados para a nuvem, exporte/importar backup ou abra uma rotina de migracao a partir do navegador que possui os dados locais.

## Servidor VPS com Nginx

Exemplo de pasta no servidor:

```txt
/var/www/regis-imobiliaria
```

Enviar arquivos:

```bash
rsync -av --delete ./ usuario@SEU_SERVIDOR:/var/www/regis-imobiliaria/
```

Exemplo Nginx:

```nginx
server {
    listen 80;
    server_name seudominio.com.br www.seudominio.com.br;

    root /var/www/regis-imobiliaria;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|pdf)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

SSL com Certbot:

```bash
sudo certbot --nginx -d seudominio.com.br -d www.seudominio.com.br
```

## DNS do dominio

Para VPS:

```txt
A     @      IP_DO_SERVIDOR
A     www    IP_DO_SERVIDOR
```

Para Vercel/Netlify/Cloudflare Pages, usar os registros que a plataforma informar.

## Banco e nuvem

O sistema ja esta preparado para:

- IndexedDB local;
- endpoint de API futura;
- storage/nuvem para fotos e documentos;
- Google Maps API;
- WhatsApp Cloud API.

Para producao real, criar backend para:

- proteger tokens;
- autenticar usuarios;
- salvar em PostgreSQL;
- guardar arquivos em bucket;
- enviar mensagens WhatsApp via Cloud API;
- gerar logs e backups.

## Checklist de producao

- [ ] Dominio comprado.
- [ ] Hospedagem escolhida.
- [ ] GitHub conectado.
- [ ] HTTPS configurado.
- [ ] Backup definido.
- [ ] Backend criado para tokens e banco.
- [ ] Storage configurado para fotos/documentos.
- [ ] Google Maps API key configurada.
- [ ] WhatsApp Cloud API configurada.
