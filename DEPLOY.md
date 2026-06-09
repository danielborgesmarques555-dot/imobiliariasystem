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
