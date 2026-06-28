const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const propertyKey = "regis-properties";
const clientKey = "regis-clients";
const ownerKey = "regis-owners";
const contractKey = "regis-contracts";
const trashKey = "regis-trash";
const companyKey = "regis-company";
const teamKey = "regis-team";
const appointmentKey = "regis-appointments";
const invoiceKey = "regis-invoices";
const authKey = "regis-authenticated";
const currentUserKey = "regis-current-user";
const localDatabaseName = "regis-imobiliaria-db";
const localDatabaseVersion = 1;
const collectionStores = {
  properties: propertyKey,
  clients: clientKey,
  owners: ownerKey,
  contracts: contractKey,
  team: teamKey,
  appointments: appointmentKey,
  invoices: invoiceKey,
  trash: trashKey,
  company: companyKey,
};

const permissionList = ["Cadastros", "Imoveis", "Clientes", "Contratos", "Faturas", "Agendamentos", "Relatorios", "Configuracoes"];

const accessDescriptions = {
  Administrador: {
    summary: "Acesso total ao sistema, usuarios, permissoes, configuracoes, backup e operacao.",
    defaultPermissions: [...permissionList],
  },
  Gerente: {
    summary: "Acompanha a operacao, cadastra e edita registros, ve relatorios e contratos, sem configuracoes criticas.",
    defaultPermissions: ["Cadastros", "Imoveis", "Clientes", "Contratos", "Faturas", "Agendamentos", "Relatorios"],
  },
  Operacional: {
    summary: "Uso do dia a dia para cadastros, imoveis, clientes, agendamentos e faturas, com restricao em contratos e configuracoes.",
    defaultPermissions: ["Cadastros", "Imoveis", "Clientes", "Faturas", "Agendamentos"],
  },
  "Somente visualizacao": {
    summary: "Apenas consulta aos modulos liberados, sem salvar, editar, excluir ou alterar status.",
    defaultPermissions: ["Imoveis", "Clientes", "Contratos", "Relatorios"],
  },
};

const themePresets = {
  regis: { name: "Regis original", blue: "#5652a7", blueDark: "#34316f", green: "#98c83d", greenDark: "#6e9f26", yellow: "#fff152" },
  executivo: { name: "Executivo", blue: "#355070", blueDark: "#1f3144", green: "#6d9f71", greenDark: "#3f6f45", yellow: "#f4d35e" },
  urbano: { name: "Urbano", blue: "#2f4858", blueDark: "#1f2f3a", green: "#00a896", greenDark: "#007f73", yellow: "#fcbf49" },
  premium: { name: "Premium", blue: "#4b3f72", blueDark: "#2f294f", green: "#c2a83e", greenDark: "#8d7625", yellow: "#f7e987" },
  claro: { name: "Claro profissional", blue: "#4062bb", blueDark: "#22356f", green: "#49a078", greenDark: "#2f7453", yellow: "#f2c94c" },
};

const contractPlaceholders = [
  ["empresa_nome", "Nome da empresa"],
  ["empresa_razao_social", "Razao social"],
  ["empresa_cnpj", "CNPJ"],
  ["empresa_creci", "CRECI"],
  ["empresa_endereco", "Endereco da empresa"],
  ["contrato_tipo", "Tipo de contrato"],
  ["data_emissao", "Data de emissao"],
  ["data_vencimento", "Data de vencimento"],
  ["prazo_meses", "Prazo em meses"],
  ["valor_mensal", "Valor mensal"],
  ["valor_caucao", "Valor em caucao"],
  ["valor_entrada", "Valor da entrada"],
  ["valor_total_venda", "Valor total da venda"],
  ["valor_avulso", "Valor avulso"],
  ["data_entrada", "Data de entrada"],
  ["data_saida", "Data de saida"],
  ["categoria_temporada", "Categoria da temporada"],
  ["imovel_titulo", "Imovel"],
  ["imovel_tipo", "Tipo do imovel"],
  ["imovel_endereco", "Endereco do imovel"],
  ["proprietario_nome", "Nome do proprietario"],
  ["proprietario_cpf", "CPF/CNPJ do proprietario"],
  ["proprietario_contato", "Contato do proprietario"],
  ["cliente_nome", "Nome do cliente"],
  ["cliente_cpf", "CPF/CNPJ do cliente"],
  ["cliente_contato", "Contato do cliente"],
  ["cliente_endereco", "Endereco do cliente"],
  ["fiador_nome", "Nome do fiador"],
  ["fiador_cpf", "CPF/CNPJ do fiador"],
  ["fiador_contato", "Contato do fiador"],
  ["fiador_endereco", "Endereco do fiador"],
  ["fiador_renda", "Renda do fiador"],
  ["data_rescisao", "Data de rescisao"],
  ["motivo_rescisao", "Motivo da rescisao"],
  ["observacoes", "Observacoes"],
];

function defaultRescissionTemplate() {
  return {
    title: "DISTRATO CONTRATUAL",
    body: `{{empresa_nome}}, {{empresa_razao_social}}, inscrita no CNPJ sob nÂº {{empresa_cnpj}}, CRECI {{empresa_creci}}, apresenta o presente distrato contratual.

PARTES ENVOLVIDAS
Proprietario/Vendedor: {{proprietario_nome}}, CPF/CNPJ {{proprietario_cpf}}, contato {{proprietario_contato}}.
Cliente: {{cliente_nome}}, CPF/CNPJ {{cliente_cpf}}, contato {{cliente_contato}}, endereco {{cliente_endereco}}.

CONTRATO ORIGINAL
O presente distrato refere-se ao contrato de {{contrato_tipo}} do imovel {{imovel_titulo}}, situado em {{imovel_endereco}}, emitido em {{data_emissao}}.

RESCISAO
As partes declaram, em comum acordo, a rescisao do contrato na data de {{data_rescisao}}.

MOTIVO
{{motivo_rescisao}}

QUITAÇÃO E RESPONSABILIDADES
As partes declaram ciencia das obrigacoes pendentes, valores, vistorias, documentos, entrega de chaves ou demais providencias necessarias, conforme ajustes firmados entre elas.

ASSINATURAS
As partes assinam eletronicamente o presente distrato contratual.`,
  };
}

function defaultContractTemplates() {
  return {
    locacao: {
      title: "CONTRATO PARTICULAR DE LOCACAO DE IMOVEL",
      body: `{{empresa_nome}}, {{empresa_razao_social}}, inscrita no CNPJ sob nº {{empresa_cnpj}}, CRECI {{empresa_creci}}, com endereco em {{empresa_endereco}}, apresenta a presente minuta contratual.

LOCADOR(A): {{proprietario_nome}}, CPF/CNPJ {{proprietario_cpf}}, contato {{proprietario_contato}}.

LOCATARIO(A): {{cliente_nome}}, CPF/CNPJ {{cliente_cpf}}, contato {{cliente_contato}}, endereco {{cliente_endereco}}.

CLAUSULA 01 - OBJETO
O presente contrato tem por objeto a locacao do imovel {{imovel_titulo}}, do tipo {{imovel_tipo}}, situado em {{imovel_endereco}}.

CLAUSULA 02 - PRAZO
O prazo da locacao sera de {{prazo_meses}} meses, contado da data de emissao {{data_emissao}}, com vencimento calculado para {{data_vencimento}}.

CLAUSULA 03 - VALOR
O aluguel mensal ajustado e de {{valor_mensal}}, com caucao no valor de {{valor_caucao}}, observadas as condicoes pactuadas entre as partes.

CLAUSULA 04 - FIADOR
{{fiador_nome}}, CPF/CNPJ {{fiador_cpf}}, contato {{fiador_contato}}, endereco {{fiador_endereco}}, renda declarada de {{fiador_renda}}.

CLAUSULA 05 - OBRIGACOES
O locatario declara receber o imovel para uso regular, comprometendo-se a zelar pela conservacao, pagar pontualmente os valores pactuados e observar a legislacao aplicavel.

CLAUSULA 06 - OBSERVACOES
{{observacoes}}

As partes assinam o presente instrumento em comum acordo.`,
    },
    compra: {
      title: "CONTRATO PARTICULAR DE COMPRA E VENDA DE IMOVEL",
      body: `{{empresa_nome}}, {{empresa_razao_social}}, inscrita no CNPJ sob nº {{empresa_cnpj}}, CRECI {{empresa_creci}}, com endereco em {{empresa_endereco}}, apresenta a presente minuta contratual.

VENDEDOR(A): {{proprietario_nome}}, CPF/CNPJ {{proprietario_cpf}}, contato {{proprietario_contato}}.

COMPRADOR(A): {{cliente_nome}}, CPF/CNPJ {{cliente_cpf}}, contato {{cliente_contato}}, endereco {{cliente_endereco}}.

CLAUSULA 01 - OBJETO
O presente contrato tem por objeto a compra e venda do imovel {{imovel_titulo}}, do tipo {{imovel_tipo}}, situado em {{imovel_endereco}}.

CLAUSULA 02 - VALORES
As partes ajustam o valor total de venda em {{valor_total_venda}}, com pagamento de entrada no valor de {{valor_entrada}}.

CLAUSULA 03 - DOCUMENTACAO E TRANSFERENCIA
As partes deverao apresentar documentos pessoais, certidoes e instrumentos necessarios para escritura, registro ou formalizacao da transferencia.

CLAUSULA 04 - OBSERVACOES
{{observacoes}}

As partes assinam o presente instrumento em comum acordo.`,
    },
    avulso: {
      title: "CONTRATO AVULSO DE TEMPORADA",
      body: `{{empresa_nome}}, {{empresa_razao_social}}, inscrita no CNPJ sob nÂº {{empresa_cnpj}}, CRECI {{empresa_creci}}, com endereco em {{empresa_endereco}}, apresenta a presente minuta contratual.

RESPONSAVEL PELO IMOVEL: {{proprietario_nome}}, CPF/CNPJ {{proprietario_cpf}}, contato {{proprietario_contato}}.

CLIENTE: {{cliente_nome}}, CPF/CNPJ {{cliente_cpf}}, contato {{cliente_contato}}, endereco {{cliente_endereco}}.

CLAUSULA 01 - OBJETO
O presente contrato tem por objeto a utilizacao avulsa por temporada do imovel {{imovel_titulo}}, do tipo {{imovel_tipo}}, situado em {{imovel_endereco}}.

CLAUSULA 02 - PERIODO
O periodo contratado inicia em {{data_entrada}} e termina em {{data_saida}}, na categoria {{categoria_temporada}}.

CLAUSULA 03 - VALOR
O valor ajustado para o periodo e de {{valor_avulso}}, observadas as condicoes pactuadas entre as partes.

CLAUSULA 04 - OBRIGACOES
O cliente declara receber o imovel para uso temporario, comprometendo-se a zelar pela conservacao, respeitar as regras combinadas e devolver o imovel ao final do periodo contratado.

CLAUSULA 05 - OBSERVACOES
{{observacoes}}

As partes assinam o presente instrumento em comum acordo.`,
    },
  };
}

const propertyTypes = {
  Residenciais: [
    "Casa",
    "Sobrado",
    "Apartamento",
    "Kitnet",
    "Studio",
    "Cobertura",
    "Flat",
    "Casa geminada",
    "Duplex",
    "Triplex",
    "Condominio residencial",
  ],
  Comerciais: ["Sala comercial", "Ponto comercial", "Galpao", "Barracao", "Predio comercial", "Escritorio"],
  "Terrenos e areas": ["Terreno", "Lote", "Area", "Gleba", "Terreno em condominio"],
  Rurais: ["Chacara", "Sitio", "Fazenda", "Rancho", "Haras"],
  "Temporada e lazer": ["Casa de praia", "Casa de campo", "Chale", "Cabana", "Pousada"],
};

function inferPropertyType(item) {
  if (propertyTypes[item.type]) return { type: item.type, subtype: item.subtype || propertyTypes[item.type][0] };
  const foundType = Object.keys(propertyTypes).find((type) => propertyTypes[type].includes(item.type));
  if (foundType) return { type: foundType, subtype: item.type };
  return { type: "Residenciais", subtype: item.subtype || "Casa" };
}

const defaultOwners = [
  {
    id: "owner-default-1",
    name: "Proprietario Regis",
    cpf: "000.000.000-00",
    contact1Name: "Proprietario Regis",
    contact1: "(13) 99999-0000",
    contact2Name: "Email",
    contact2: "proprietario@email.com",
    address: "Registro, SP",
    notes: "Proprietario cadastrado como exemplo.",
    photo: null,
    crop: { zoom: 1, x: 50, y: 50 },
    documents: [],
  },
  {
    id: "owner-default-2",
    name: "Maria Proprietaria",
    cpf: "111.111.111-11",
    contact1Name: "Maria",
    contact1: "(13) 98888-0000",
    contact2Name: "Email",
    contact2: "maria@email.com",
    address: "Registro, SP",
    notes: "Aceita visitas com agendamento.",
    photo: null,
    crop: { zoom: 1, x: 50, y: 50 },
    documents: [],
  },
];

const defaultProperties = [
  {
    title: "Casa ampla no Centro",
    ownerId: "owner-default-1",
    available: true,
    type: "Residenciais",
    subtype: "Casa",
    purpose: "Venda",
    price: 420000,
    grossValue: 390000,
    netValue: 420000,
    iptu: 1200,
    district: "Centro",
    city: "Registro",
    rooms: 3,
    area: 145,
    leisureArea: "Sim",
    pool: "Nao",
    garage: "Sim",
    garageSpaces: 2,
    notes: "Garagem coberta, quintal e documentacao encaminhada.",
  },
  {
    title: "Apartamento pronto para morar",
    ownerId: "owner-default-2",
    available: true,
    type: "Residenciais",
    subtype: "Apartamento",
    purpose: "Locacao",
    price: 2200,
    grossValue: 1900,
    netValue: 2200,
    iptu: 780,
    district: "Jardim Paulista",
    city: "Registro",
    rooms: 2,
    area: 72,
    leisureArea: "Nao",
    pool: "Nao",
    garage: "Sim",
    garageSpaces: 1,
    notes: "Condominio com boa localizacao e visita facil de agendar.",
  },
];

const defaultClients = [
  {
    name: "Ana Carvalho",
    cpf: "222.222.222-22",
    contact1Name: "Ana",
    contact1: "(13) 99911-2200",
    contact2Name: "Email",
    contact2: "ana@email.com",
    address: "Registro, SP",
    notes: "Busca casa com quintal e tres quartos.",
  },
  {
    name: "Roberto Lima",
    cpf: "333.333.333-33",
    contact1Name: "Roberto",
    contact1: "(13) 98822-4433",
    contact2Name: "Email",
    contact2: "roberto@email.com",
    address: "Registro, SP",
    notes: "Precisa de imovel comercial proximo ao centro.",
  },
];

const defaultTeam = [
  {
    id: "team-default-admin",
    name: "Administrador Regis",
    role: "Gestao",
    email: "admin@regisimobiliaria.com",
    phone: "(13) 99999-0000",
    accessLevel: "Administrador",
    status: "Ativo",
    permissions: [...permissionList],
    password: "regis6210",
    passwordSet: true,
    resetRequested: false,
    passwordResetAuthorized: false,
    notes: "Acesso completo ao sistema.",
  },
];

function ensureCompany(company = {}) {
  const defaults = {
    name: "Regis Imobiliaria",
    legalName: "",
    cnpj: "",
    creci: "6210",
    phone: "",
    email: "",
    address: "Registro, SP",
    logo: "",
    theme: "regis",
    colors: { ...themePresets.regis },
    publicHighlights: "",
    contractTemplates: defaultContractTemplates(),
    whatsapp: {
      sender: "",
      message:
        "Ola, {{cliente_nome}}. Sua fatura de {{categoria}} no valor de {{valor}} vence em {{vencimento}}. Imovel: {{imovel_titulo}}. Atenciosamente, {{empresa_nome}}.",
      cloudApiEnabled: "Nao",
      phoneNumberId: "",
      businessAccountId: "",
      accessToken: "",
      webhookVerifyToken: "",
    },
    integrations: {
      database: {
        mode: "indexeddb",
        endpoint: "",
        projectId: "",
        status: "Banco local ativo",
      },
      cloud: {
        provider: "Supabase Storage",
        endpoint: "",
        bucket: "regis-arquivos",
        publicBaseUrl: "",
        status: "Aguardando credenciais",
      },
      googleMaps: {
        enabled: "Nao",
        apiKey: "",
        autocomplete: "Sim",
        geocoding: "Sim",
        mapVisibility: "Aproximada",
        status: "Aguardando chave Google Maps",
      },
    },
  };
  return {
    ...defaults,
    ...company,
    colors: { ...defaults.colors, ...(company.colors || {}) },
    whatsapp: { ...defaults.whatsapp, ...(company.whatsapp || {}) },
    integrations: {
      database: { ...defaults.integrations.database, ...(company.integrations?.database || {}) },
      cloud: { ...defaults.integrations.cloud, ...(company.integrations?.cloud || {}) },
      googleMaps: { ...defaults.integrations.googleMaps, ...(company.integrations?.googleMaps || {}) },
    },
    contractTemplates: {
      locacao: { ...defaults.contractTemplates.locacao, ...(company.contractTemplates?.locacao || {}) },
      compra: { ...defaults.contractTemplates.compra, ...(company.contractTemplates?.compra || {}) },
      avulso: { ...defaults.contractTemplates.avulso, ...(company.contractTemplates?.avulso || {}) },
    },
  };
}

const state = {
  properties: ensureProperties(loadCollection(propertyKey, defaultProperties)),
  clients: ensureClients(loadCollection(clientKey, defaultClients)),
  owners: ensureOwners(loadCollection(ownerKey, defaultOwners)),
  contracts: ensureContracts(loadCollection(contractKey, [])),
  team: ensureTeam(loadCollection(teamKey, defaultTeam)),
  appointments: ensureAppointments(loadCollection(appointmentKey, [])),
  invoices: ensureInvoices(loadCollection(invoiceKey, [])),
  trash: ensureTrash(loadCollection(trashKey, [])),
  company: ensureCompany(loadCollection(companyKey, {
    name: "Regis Imobiliaria",
    legalName: "",
    cnpj: "",
    creci: "6210",
    phone: "",
    email: "",
    address: "Registro, SP",
    logo: "",
    theme: "regis",
    colors: { ...themePresets.regis },
  })),
  selectedPropertyPhotos: [],
  selectedPropertyDocs: [],
  selectedClientPhoto: null,
  selectedClientPhotos: [],
  selectedClientDocs: [],
  selectedOwnerDocs: [],
  selectedOwnerPhoto: null,
  selectedGuarantorDocs: [],
  selectedClientCrop: { zoom: 1, x: 50, y: 50 },
  selectedOwnerCrop: { zoom: 1, x: 50, y: 50 },
  pendingContractSignatures: {},
  activeSignaturePad: null,
  activeProfile: null,
  activeProfileTab: "summary",
  carouselIndex: 0,
  publicHeroIndex: 0,
  publicHeroTimer: null,
  cloudSyncReady: false,
  cloudSyncInFlight: false,
  cloudSaveTimer: null,
  cloudSyncStatus: "Inicializando banco em nuvem",
  authenticated: localStorage.getItem(authKey) === "true",
  currentUserId: localStorage.getItem(currentUserKey) || "",
  filters: {
    publicQuery: "",
    publicPurpose: "all",
    publicCity: "all",
    publicType: "all",
    publicMaxPrice: "",
    properties: "",
    propertyPurpose: "all",
    propertyAvailability: "all",
    propertyType: "all",
    propertyCity: "all",
    clients: "",
    clientContract: "all",
    clientDocument: "all",
    clientCity: "all",
    owners: "",
    ownerProperty: "all",
    ownerDocument: "all",
    ownerCity: "all",
    contractType: "all",
    contractStatus: "all",
    contractPeriod: "",
    appointmentType: "all",
    appointmentStatus: "all",
    appointmentPeriod: "",
    invoiceType: "all",
    invoiceStatus: "all",
    invoicePeriod: "",
  },
};

saveAll();

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ensureFile(file, fallbackLabel = "", maxStoredLength = 650000) {
  if (!file) return file;
  if (typeof file === "string") {
    if (file.length > maxStoredLength) {
      return { name: fallbackLabel || "Arquivo grande", label: fallbackLabel || "Arquivo grande", type: "", size: 0, data: "", oversized: true };
    }
    return { name: fallbackLabel || "Arquivo", label: fallbackLabel || "Arquivo", type: "", size: 0, data: file };
  }
  if (file.data && file.data.length > maxStoredLength) {
    return {
      ...file,
      label: file.label || fallbackLabel || file.name || "Arquivo grande",
      data: "",
      oversized: true,
    };
  }
  return { label: file.label || fallbackLabel || file.name || "Arquivo", ...file };
}

function ensureProperties(items) {
  return items.map((item) => ({
    id: item.id || createId("property"),
    ownerId: item.ownerId || "",
    available: item.available !== false,
    featured: Boolean(item.featured),
    ...inferPropertyType(item),
    googleLocation: item.googleLocation || [item.district, item.city].filter(Boolean).join(", "),
    googleMapsUrl: item.googleMapsUrl || "",
    googlePlaceId: item.googlePlaceId || "",
    formattedAddress: item.formattedAddress || item.googleLocation || "",
    latitude: item.latitude || item.lat || "",
    longitude: item.longitude || item.lng || "",
    city: item.city || "",
    district: item.district || "",
    iptu: item.iptu || "",
    grossValue: item.grossValue || item.ownerAskPrice || item.price || "",
    netValue: item.netValue || item.finalPrice || item.price || item.grossValue || "",
    price: item.netValue || item.finalPrice || item.price || item.grossValue || "",
    leisureArea: item.leisureArea || "Nao",
    pool: item.pool || "Nao",
    garage: item.garage || "Nao",
    garageSpaces: item.garageSpaces || "",
    photos: Array.isArray(item.photos) ? item.photos.map((file, index) => ensureFile(file, index === 0 ? "Principal" : `Foto ${index + 1}`)) : [],
    documents: Array.isArray(item.documents) ? item.documents.map((file) => ensureFile(file)) : [],
    ...item,
    ...inferPropertyType(item),
  }));
}

function ensureClients(items) {
  return items.map((item) => ({
    ...item,
    id: item.id || createId("client"),
    cpf: item.cpf || "",
    contact1Name: item.contact1Name || item.name || "",
    contact1: item.contact1 || item.phone || "",
    contact2Name: item.contact2Name || (item.email ? "Email" : ""),
    contact2: item.contact2 || item.email || "",
    address: item.address || "",
    photo: item.photo || null,
    photos: Array.isArray(item.photos)
      ? item.photos.map((file, index) => ensureFile(file, index === 0 ? "Principal" : `Foto ${index + 1}`))
      : item.photo
        ? [ensureFile(item.photo, "Principal")]
        : [],
    crop: item.crop || { zoom: 1, x: 50, y: 50 },
    documents: Array.isArray(item.documents) ? item.documents.map((file) => ensureFile(file)) : [],
  }));
}

function ensureOwners(items) {
  return items.map((item) => ({
    id: item.id || createId("owner"),
    name: item.name || item.ownerName || "",
    cpf: item.cpf || item.ownerCpf || "",
    contact1Name: item.contact1Name || item.name || item.ownerName || "",
    contact1: item.contact1 || item.phone || item.ownerPhone || "",
    contact2Name: item.contact2Name || (item.email ? "Email" : ""),
    contact2: item.contact2 || item.email || "",
    address: item.address || "",
    photo: item.photo || null,
    crop: item.crop || { zoom: 1, x: 50, y: 50 },
    notes: item.notes || "",
    documents: Array.isArray(item.documents) ? item.documents.map((file) => ensureFile(file)) : [],
  }));
}

function ensureContracts(items) {
  return items.map((item) => ({
    id: item.id || createId("contract"),
    propertyId: item.propertyId || "",
    clientId: item.clientId || "",
    type: item.type || "Locacao",
    payerRole: item.payerRole || (item.type === "Compra" ? "Comprador" : item.type === "Avulso" ? "Cliente" : "Inquilino"),
    amount: item.amount || item.monthlyValue || item.negotiatedValue || item.oneOffValue || "",
    monthlyValue: item.monthlyValue || (item.type === "Locacao" ? item.amount : ""),
    negotiatedValue: item.negotiatedValue || (item.type === "Compra" ? item.amount : ""),
    oneOffValue: item.oneOffValue || (item.type === "Avulso" ? item.amount : ""),
    seasonStart: item.seasonStart || "",
    seasonEnd: item.seasonEnd || "",
    seasonCategory: item.seasonCategory || (item.type === "Avulso" ? "Temporada" : ""),
    downPayment: item.downPayment || "",
    securityDeposit: item.securityDeposit || "",
    hasGuarantor: item.hasGuarantor || (item.guarantor?.name ? "Sim" : "Nao"),
    guarantor: item.guarantor
      ? {
          ...item.guarantor,
          documents: Array.isArray(item.guarantor.documents) ? item.guarantor.documents.map((file) => ensureFile(file)) : [],
        }
      : null,
    termMonths: item.termMonths || "",
    paymentMode: item.paymentMode || (Number(item.installments || 1) > 1 ? "Parcelado" : "A vista"),
    installments: item.installments || "1",
    dueDate: item.dueDate || "",
    inactive: Boolean(item.inactive),
    inactiveReason: item.inactiveReason || "",
    previousContractId: item.previousContractId || "",
    renewedBy: item.renewedBy || "",
    template: item.template || null,
    signed: Boolean(item.signed),
    signedAt: item.signedAt || "",
    signatures: Array.isArray(item.signatures) ? item.signatures : [],
    signedDocument: item.signedDocument ? ensureFile(item.signedDocument, "Contrato assinado", 2500000) : null,
    rescinded: Boolean(item.rescinded),
    rescindedAt: item.rescindedAt || "",
    rescissionReason: item.rescissionReason || "",
    rescissionTemplate: item.rescissionTemplate || null,
    rescissionSignatures: Array.isArray(item.rescissionSignatures) ? item.rescissionSignatures : [],
    issuedAt: item.issuedAt || item.createdAt || new Date().toISOString(),
    status: ["Aberta", "Paga", "Agendada"].includes(item.status) ? "Ativo" : item.status || "Ativo",
    notes: item.notes || "",
    createdAt: item.createdAt || new Date().toISOString(),
  }));
}

function ensureTeam(items) {
  return items.map((item) => ({
    id: item.id || createId("team"),
    name: item.name || "",
    role: item.role || "Atendimento",
    email: item.email || "",
    phone: item.phone || "",
    accessLevel: item.accessLevel || "Operacional",
    status: item.status || "Ativo",
    permissions: Array.isArray(item.permissions)
      ? item.accessLevel === "Administrador"
        ? [...new Set([...permissionList, ...item.permissions])]
        : item.permissions
      : accessDescriptions[item.accessLevel || "Operacional"]?.defaultPermissions || [],
    password: item.password || "",
    passwordSet: Boolean(item.passwordSet || item.password),
    resetRequested: Boolean(item.resetRequested),
    passwordResetAuthorized: Boolean(item.passwordResetAuthorized),
    notes: item.notes || "",
  }));
}

function ensureAppointments(items) {
  return items.map((item) => ({
    id: item.id || createId("appointment"),
    type: item.type || "Visita do cliente",
    propertyId: item.propertyId || "",
    clientId: item.clientId || "",
    responsible: item.responsible || "",
    date: item.date || "",
    time: item.time || "",
    status: item.status || "Agendado",
    notes: item.notes || "",
    createdAt: item.createdAt || new Date().toISOString(),
  }));
}

function ensureInvoices(items) {
  return items.map((item) => ({
    id: item.id || createId("invoice"),
    category: item.category || "Locacao",
    contractId: item.contractId || "",
    clientId: item.clientId || "",
    propertyId: item.propertyId || "",
    amount: item.amount || "",
    dueDate: item.dueDate || "",
    status: item.status || "Aberta",
    paidAt: item.paidAt || "",
    description: item.description || "",
    reference: item.reference || "",
    contractEndReference: item.contractEndReference || "",
    recurring: item.recurring || (item.category === "Locacao" ? "Mensal" : ""),
    bookletId: item.bookletId || (["Locacao", "Compra"].includes(item.category) ? item.id : ""),
    installmentNumber: Number(item.installmentNumber || 1),
    installmentTotal: Number(item.installmentTotal || 1),
    releaseStatus: item.releaseStatus || "Disponivel",
    whatsappTo: item.whatsappTo || "",
    whatsappReminderDays: item.whatsappReminderDays || (item.category === "Locacao" ? 3 : ""),
    whatsappSender: item.whatsappSender || "",
    whatsappMessage: item.whatsappMessage || "",
    installment: item.installment || "",
    chargeType: item.chargeType || "",
    saleTotal: item.saleTotal || "",
    downPayment: item.downPayment || "",
    interestRate: item.interestRate || "",
    financedTotal: item.financedTotal || "",
    createdAt: item.createdAt || new Date().toISOString(),
  }));
}

function ensureTrash(items) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return items.filter((entry) => new Date(entry.deletedAt).getTime() >= cutoff);
}

function loadCollection(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function saveCollection(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function persistLocalState() {
  saveCollection(propertyKey, state.properties);
  saveCollection(clientKey, state.clients);
  saveCollection(ownerKey, state.owners);
  saveCollection(contractKey, state.contracts);
  saveCollection(teamKey, state.team);
  saveCollection(appointmentKey, state.appointments);
  saveCollection(invoiceKey, state.invoices);
  saveCollection(trashKey, state.trash);
  saveCollection(companyKey, state.company);
}

function openLocalDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB indisponivel"));
      return;
    }
    const request = indexedDB.open(localDatabaseName, localDatabaseVersion);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("collections")) db.createObjectStore("collections", { keyPath: "name" });
      if (!db.objectStoreNames.contains("files")) db.createObjectStore("files", { keyPath: "id" });
      if (!db.objectStoreNames.contains("syncQueue")) db.createObjectStore("syncQueue", { keyPath: "id" });
      if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta", { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function mirrorToLocalDatabase() {
  try {
    const db = await openLocalDatabase();
    const transaction = db.transaction(["collections", "meta"], "readwrite");
    const collections = transaction.objectStore("collections");
    Object.entries(collectionStores).forEach(([name]) => {
      collections.put({ name, data: state[name], updatedAt: new Date().toISOString() });
    });
    transaction.objectStore("meta").put({
      key: "sync-status",
      mode: state.company.integrations?.database?.mode || "indexeddb",
      updatedAt: new Date().toISOString(),
      cloudReady: Boolean(state.company.integrations?.cloud?.endpoint),
    });
    transaction.oncomplete = () => db.close();
  } catch (error) {
    console.warn("Banco local nao sincronizado", error);
  }
}

function saveAll() {
  try {
    persistLocalState();
    mirrorToLocalDatabase();
    scheduleCloudSave();
    return true;
  } catch (error) {
    showToast("Armazenamento cheio. Use fotos menores ou remova arquivos grandes.");
    console.error(error);
    return false;
  }
}

function cloudPayload() {
  return {
    properties: state.properties,
    clients: state.clients,
    owners: state.owners,
    contracts: state.contracts,
    team: state.team,
    appointments: state.appointments,
    invoices: state.invoices,
    trash: state.trash,
    company: state.company,
  };
}

function applyCloudState(data = {}) {
  if (Array.isArray(data.properties)) state.properties = ensureProperties(data.properties);
  if (Array.isArray(data.clients)) state.clients = ensureClients(data.clients);
  if (Array.isArray(data.owners)) state.owners = ensureOwners(data.owners);
  if (Array.isArray(data.contracts)) state.contracts = ensureContracts(data.contracts);
  if (Array.isArray(data.team)) state.team = ensureTeam(data.team);
  if (Array.isArray(data.appointments)) state.appointments = ensureAppointments(data.appointments);
  if (Array.isArray(data.invoices)) state.invoices = ensureInvoices(data.invoices);
  if (Array.isArray(data.trash)) state.trash = ensureTrash(data.trash);
  if (data.company) state.company = ensureCompany(data.company);
}

function scheduleCloudSave(delay = 900) {
  if (!state.cloudSyncReady) return;
  window.clearTimeout(state.cloudSaveTimer);
  state.cloudSaveTimer = window.setTimeout(syncCloudState, delay);
}

async function syncCloudState() {
  if (!state.cloudSyncReady || state.cloudSyncInFlight) return;
  state.cloudSyncInFlight = true;
  try {
    const response = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cloudPayload()),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.cloudSyncStatus = "Sincronizado com banco em nuvem";
  } catch (error) {
    console.warn("Sincronizacao em nuvem falhou", error);
    state.cloudSyncStatus = "Falha ao sincronizar banco em nuvem";
  } finally {
    state.cloudSyncInFlight = false;
  }
}

async function initCloudSync() {
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload.empty) {
      applyCloudState(payload.data);
      persistLocalState();
      mirrorToLocalDatabase();
      render();
      state.cloudSyncStatus = "Dados carregados do banco em nuvem";
    }
    state.cloudSyncReady = true;
    if (payload.empty) scheduleCloudSave(50);
  } catch (error) {
    console.warn("Banco em nuvem indisponivel", error);
    state.cloudSyncReady = false;
    state.cloudSyncStatus = "Usando armazenamento local";
  }
}

function companyColors() {
  const preset = themePresets[state.company.theme] || themePresets.regis;
  return { ...preset, ...(state.company.colors || {}) };
}

function applyCompanyBranding() {
  const colors = companyColors();
  const root = document.documentElement;
  root.style.setProperty("--blue", colors.blue);
  root.style.setProperty("--blue-dark", colors.blueDark);
  root.style.setProperty("--green", colors.green);
  root.style.setProperty("--green-dark", colors.greenDark);
  root.style.setProperty("--yellow", colors.yellow);

  const brand = document.querySelector(".brand");
  if (brand) {
    brand.innerHTML = state.company.logo
      ? `<img src="${state.company.logo}" alt="${escapeHtml(state.company.name || "Regis Imobiliaria")}">`
      : '<span class="brand-empty">Sem logo</span>';
  }

  const title = document.querySelector(".topbar h1");
  if (title) title.textContent = state.company.name || "Regis Imobiliaria";
}

function normalize(value) {
  return String(value ?? "").toLowerCase().trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function collectForm(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (data[key]) {
      data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
      return;
    }
    data[key] = value;
  });
  return data;
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const image = new Image();
      image.addEventListener("load", () => {
        const maxSize = 1100;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve({
          name: file.name,
          label: file.name,
          type: "image/jpeg",
          size: file.size,
          data: canvas.toDataURL("image/jpeg", 0.72),
        });
      });
      image.addEventListener("error", reject);
      image.src = reader.result;
    });
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

function readFile(file) {
  if (file.type.startsWith("image/")) {
    return readImageFile(file);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      resolve({
        name: file.name,
        label: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: reader.result,
      }),
    );
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });
}

async function readFiles(input, limit, imageOnly = false) {
  const files = Array.from(input.files || [])
    .filter((file) => !imageOnly || file.type.startsWith("image/"))
    .slice(0, limit);

  if ((input.files || []).length > limit) {
    showToast(`Foram usados apenas os ${limit} primeiros arquivos.`);
  }

  return Promise.all(files.map(readFile));
}

async function readSignedContractDocument(input) {
  const files = await readFiles(input, 1);
  const file = files[0] || null;
  if (!file) return null;
  if ((file.data || "").length > 2500000) {
    showToast("Contrato assinado muito grande. Use um arquivo de ate 2 MB.");
    return null;
  }
  return file;
}

function getPhotoSrc(fileOrString) {
  if (!fileOrString) return "";
  return typeof fileOrString === "string" ? fileOrString : fileOrString.data;
}

function cropStyle(crop = { zoom: 1, x: 50, y: 50 }) {
  return `object-position:${crop.x}% ${crop.y}%; transform:scale(${crop.zoom});`;
}

function updateFileLabels(containerSelector, files) {
  document.querySelectorAll(`${containerSelector} [data-file-label]`).forEach((input) => {
    const index = Number(input.dataset.fileLabel);
    if (files[index]) {
      files[index].label = input.value || files[index].name;
    }
  });
}

function renderImagePreview(selector, files) {
  const preview = document.querySelector(selector);
  preview.innerHTML = "";
  preview.classList.toggle("has-photos", files.length > 0);

  files.forEach((file, index) => {
    const image = document.createElement("img");
    image.src = getPhotoSrc(file);
    image.alt = `Previa da foto ${index + 1}`;
    const label = document.createElement("label");
    label.className = "file-label-row";
    label.innerHTML = `
      <span>${index === 0 ? "Principal" : `Foto ${index + 1}`}</span>
      <input type="text" value="${escapeHtml(file.label || file.name)}" data-file-label="${index}" placeholder="Quarto, cozinha, sala">
    `;
    const wrap = document.createElement("div");
    wrap.className = "preview-item";
    wrap.append(image, label);
    preview.append(wrap);
  });
}

function renderClientPhotoPreview() {
  const preview = document.querySelector("#client-photo-preview");
  const controls = document.querySelector("#client-crop-controls");
  preview.innerHTML = "";
  preview.classList.toggle("has-photos", state.selectedClientPhotos.length > 0);
  controls.hidden = state.selectedClientPhotos.length === 0;

  if (!state.selectedClientPhotos.length) return;

  state.selectedClientPhotos.forEach((photo, index) => {
    const wrap = document.createElement("div");
    wrap.className = "preview-item";
    wrap.innerHTML = `
      <div class="profile-photo-crop">
        <img src="${getPhotoSrc(photo)}" alt="Previa da foto do cliente" style="${index === 0 ? cropStyle(state.selectedClientCrop) : ""}">
      </div>
      <label class="file-label-row">
        <span>${index === 0 ? "Principal" : `Foto ${index + 1}`}</span>
        <input type="text" value="${escapeHtml(photo.label || photo.name)}" data-file-label="${index}" placeholder="Perfil, documento, visita">
      </label>
    `;
    preview.append(wrap);
  });
}

function renderOwnerPhotoPreview() {
  const preview = document.querySelector("#owner-photo-preview");
  const controls = document.querySelector("#owner-crop-controls");
  preview.innerHTML = "";
  preview.classList.toggle("has-photos", Boolean(state.selectedOwnerPhoto));
  controls.hidden = !state.selectedOwnerPhoto;

  if (!state.selectedOwnerPhoto) return;

  const wrap = document.createElement("div");
  wrap.className = "profile-photo-crop";
  wrap.innerHTML = `<img src="${getPhotoSrc(state.selectedOwnerPhoto)}" alt="Previa da foto do proprietario" style="${cropStyle(state.selectedOwnerCrop)}">`;
  preview.append(wrap);
}

function renderFilePreview(selector, files) {
  const preview = document.querySelector(selector);
  preview.innerHTML = "";
  preview.classList.toggle("has-files", files.length > 0);

  files.forEach((file, index) => {
    const item = document.createElement("label");
    item.className = "file-label-row";
    item.innerHTML = `
      <span>${escapeHtml(file.name)}</span>
      <input type="text" value="${escapeHtml(file.label || file.name)}" data-file-label="${index}" placeholder="Nome do documento">
    `;
    preview.append(item);
  });
}

function findProperty(id) {
  return state.properties.find((property) => property.id === id);
}

function findClient(id) {
  return state.clients.find((client) => client.id === id);
}

function findOwner(id) {
  return state.owners.find((owner) => owner.id === id);
}

function findContract(id) {
  return state.contracts.find((contract) => contract.id === id);
}

function propertyGrossValue(property) {
  return Number(property?.grossValue || property?.ownerAskPrice || property?.price || 0);
}

function propertyNetValue(property) {
  return Number(property?.netValue || property?.finalPrice || property?.price || property?.grossValue || 0);
}

function propertyProfitValue(property) {
  return Math.max(0, propertyNetValue(property) - propertyGrossValue(property));
}

function propertyProfitPercent(property) {
  const gross = propertyGrossValue(property);
  return gross > 0 ? (propertyProfitValue(property) / gross) * 100 : 0;
}

function findTeamMember(id) {
  return state.team.find((member) => member.id === id);
}

function activeUser() {
  return findTeamMember(state.currentUserId) || state.team.find((member) => normalize(member.email) === "admin@regisimobiliaria.com") || null;
}

function isAdmin(user = activeUser()) {
  return user?.accessLevel === "Administrador";
}

function isReadOnly(user = activeUser()) {
  return user?.accessLevel === "Somente visualizacao";
}

function userPermissions(user = activeUser()) {
  if (!user) return [];
  if (isAdmin(user)) return [...permissionList];
  return Array.isArray(user.permissions) ? user.permissions : [];
}

function hasPermission(permission, user = activeUser()) {
  if (!state.authenticated) return false;
  if (isAdmin(user)) return true;
  return userPermissions(user).includes(permission);
}

function viewPermission(viewName) {
  const map = {
    painel: "Relatorios",
    cadastro: "Cadastros",
    imoveis: "Imoveis",
    clientes: "Clientes",
    proprietarios: "Cadastros",
    contratos: "Contratos",
    agendamentos: "Agendamentos",
    faturas: "Faturas",
    equipe: "Configuracoes",
    configuracao: "Configuracoes",
  };
  return map[viewName] || "";
}

function canOpenView(viewName) {
  const permission = viewPermission(viewName);
  return permission ? hasPermission(permission) : state.authenticated;
}

function firstAvailableView() {
  return Array.from(document.querySelectorAll("[data-view-link]")).find((link) => !link.hidden)?.dataset.viewLink || "site-publico";
}

function canWrite(permission) {
  return hasPermission(permission) && !isReadOnly();
}

function canManageUsers() {
  return isAdmin();
}

function canUseSettingsTool(tool) {
  if (!hasPermission("Configuracoes")) return false;
  if (isAdmin()) return true;
  return !["users", "trash", "backup", "appearance", "security"].includes(tool);
}

function canEditEntity(type) {
  if (isReadOnly()) return false;
  if (["property", "owner"].includes(type)) return canWrite("Cadastros") || canWrite("Imoveis");
  if (type === "client") return canWrite("Clientes") || canWrite("Cadastros");
  if (type === "contract") return hasPermission("Contratos") && ["Administrador", "Gerente"].includes(activeUser()?.accessLevel);
  if (type === "appointment") return canWrite("Agendamentos");
  if (type === "invoice") return canWrite("Faturas");
  return isAdmin();
}

function canDeleteEntity(type) {
  if (isReadOnly()) return false;
  if (isAdmin()) return true;
  if (activeUser()?.accessLevel === "Gerente") return !["team", "company-logo"].includes(type);
  return false;
}

function requirePermission(permission, action = "realizar esta acao") {
  if (canWrite(permission)) return true;
  showToast(`Seu usuario nao tem permissao para ${action}.`);
  return false;
}

function requireEntityEdit(type) {
  if (canEditEntity(type)) return true;
  showToast("Seu usuario nao tem permissao para editar este registro.");
  return false;
}

function propertyLocation(property) {
  return property?.formattedAddress || property?.googleLocation || [property?.district, property?.city].filter(Boolean).join(", ");
}

function googleMapsLink(location) {
  if (!location) return "";
  if (/^https?:\/\//i.test(location)) return location;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

function propertyGoogleMapsLink(property) {
  if (property?.googleMapsUrl) return property.googleMapsUrl;
  if (property?.latitude && property?.longitude) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.latitude},${property.longitude}`)}`;
  return googleMapsLink(propertyLocation(property));
}

function googleMapsEmbed(location) {
  if (!location) return "";
  const query = /^https?:\/\//i.test(location) ? location : location;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function propertyGoogleMapsEmbed(property) {
  if (property?.latitude && property?.longitude) return googleMapsEmbed(`${property.latitude},${property.longitude}`);
  return googleMapsEmbed(propertyLocation(property));
}

function loadGoogleMapsIfConfigured() {
  const maps = state.company.integrations?.googleMaps;
  if (!maps?.apiKey || maps.enabled !== "Sim" || window.google?.maps) return;
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(maps.apiKey)}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.dataset.googleMapsLoader = "true";
  script.addEventListener("load", () => showToast("Google Maps carregado. Autocomplete pronto para conexao."));
  script.addEventListener("error", () => showToast("Nao foi possivel carregar Google Maps. Verifique a chave."));
  document.head.append(script);
}

function entityPhoto(entity) {
  return entity?.photos?.[0] || entity?.photo || null;
}

function propertyOwner(property) {
  return findOwner(property.ownerId) || {
    name: property.ownerName || "Nao informado",
    cpf: property.ownerCpf || "Nao informado",
    contact1Name: "Telefone",
    contact1: property.ownerPhone || "Nao informado",
    contact2Name: "",
    contact2: "",
    address: "",
    photo: null,
    crop: { zoom: 1, x: 50, y: 50 },
    notes: "",
    documents: [],
  };
}

function propertyContracts(propertyId) {
  return state.contracts.filter((contract) => contract.propertyId === propertyId);
}

function clientContracts(clientId) {
  return state.contracts.filter((contract) => contract.clientId === clientId);
}

function ownerProperties(ownerId) {
  return state.properties.filter((property) => property.ownerId === ownerId);
}

function findEntityByType(type, id) {
  if (type === "property") return findProperty(id);
  if (type === "owner") return findOwner(id);
  if (type === "contract") return findContract(id);
  if (type === "team") return state.team.find((member) => member.id === id);
  if (type === "appointment") return state.appointments.find((appointment) => appointment.id === id);
  if (type === "invoice") return state.invoices.find((invoice) => invoice.id === id);
  return findClient(id);
}

function documentEntity(type, explicitId = "") {
  if (explicitId) return findEntityByType(type, explicitId);
  return activeEntity();
}

function entityLabel(type) {
  const labels = {
    property: "imovel",
    owner: "proprietario",
    contract: "contrato",
    client: "cliente",
    photo: "foto",
    document: "documento",
    "company-logo": "logo da empresa",
    team: "membro da equipe",
    appointment: "agendamento",
    invoice: "fatura",
  };
  return labels[type] || "registro";
}

function addToTrash(type, item) {
  state.trash.unshift({
    id: createId("trash"),
    type,
    item,
    deletedAt: new Date().toISOString(),
  });
}

function moveToTrash(type, id) {
  const collections = {
    property: state.properties,
    client: state.clients,
    owner: state.owners,
    contract: state.contracts,
    team: state.team,
    appointment: state.appointments,
    invoice: state.invoices,
  };
  const collection = collections[type];
  const index = collection.findIndex((item) => item.id === id);
  if (index < 0) return false;

  const [item] = collection.splice(index, 1);
  addToTrash(type, item);
  saveAll();
  render();
  return true;
}

function restoreFromTrash(trashId) {
  const index = state.trash.findIndex((entry) => entry.id === trashId);
  if (index < 0) return false;
  const [entry] = state.trash.splice(index, 1);
  if (entry.type === "property") state.properties.unshift(entry.item);
  if (entry.type === "client") state.clients.unshift(entry.item);
  if (entry.type === "owner") state.owners.unshift(entry.item);
  if (entry.type === "contract") state.contracts.unshift(entry.item);
  if (entry.type === "team") state.team.unshift(entry.item);
  if (entry.type === "appointment") state.appointments.unshift(entry.item);
  if (entry.type === "invoice") state.invoices.unshift(entry.item);
  if (entry.type === "photo") {
    const entity = findEntityByType(entry.item.parentType, entry.item.parentId);
    if (entity) {
      entity.photos = [...(entity.photos || []), entry.item.photo];
      if (entry.item.parentType === "client") entity.photo = entity.photos[0] || entity.photo || null;
    }
  }
  if (entry.type === "document") {
    const entity = findEntityByType(entry.item.parentType, entry.item.parentId);
    if (entity) {
      entity.documents = [...(entity.documents || []), entry.item.document];
    }
  }
  if (entry.type === "company-logo") {
    state.company.logo = entry.item.logo || "";
    applyCompanyBranding();
  }
  saveAll();
  render();
  return true;
}

function emptyTrash() {
  state.trash = [];
  saveAll();
  render();
}

function updateMetrics() {
  const total = state.properties.length;
  const sum = state.properties.reduce((acc, property) => acc + propertyNetValue(property), 0);
  const average = total ? sum / total : 0;

  if (document.querySelector("#metric-properties")) document.querySelector("#metric-properties").textContent = total;
  if (document.querySelector("#metric-clients")) document.querySelector("#metric-clients").textContent = state.clients.length;
  if (document.querySelector("#metric-average")) document.querySelector("#metric-average").textContent = formatter.format(average);
}

function renderDashboardReports() {
  const grid = document.querySelector("#dashboard-report-grid");
  if (!grid) return;

  const availableProperties = state.properties.filter((property) => property.available !== false);
  const unavailableProperties = state.properties.filter((property) => property.available === false);
  const saleProperties = state.properties.filter((property) => property.purpose === "Venda");
  const rentProperties = state.properties.filter((property) => property.purpose === "Locacao");
  const propertiesWithOwner = state.properties.filter((property) => property.ownerId && findOwner(property.ownerId));
  const grossPortfolio = state.properties.reduce((sum, property) => sum + propertyGrossValue(property), 0);
  const netPortfolio = state.properties.reduce((sum, property) => sum + propertyNetValue(property), 0);
  const profitPortfolio = state.properties.reduce((sum, property) => sum + propertyProfitValue(property), 0);
  const monthlyRentProfit = rentProperties.reduce((sum, property) => sum + propertyProfitValue(property), 0);
  const profitPercent = grossPortfolio > 0 ? (profitPortfolio / grossPortfolio) * 100 : 0;

  const clientsWithCpf = state.clients.filter((client) => client.cpf);
  const clientsWithAddress = state.clients.filter((client) => client.address);
  const clientsWithDocuments = state.clients.filter((client) => (client.documents || []).length);

  const ownersWithProperties = state.owners.filter((owner) => ownerProperties(owner.id).length);
  const ownersWithDocuments = state.owners.filter((owner) => (owner.documents || []).length);
  const ownersWithoutProperties = state.owners.filter((owner) => !ownerProperties(owner.id).length);

  const activeContracts = state.contracts.filter((contract) => contractComputedStatus(contract) !== "Inativo");
  const inactiveContracts = state.contracts.filter((contract) => contractComputedStatus(contract) === "Inativo");
  const signedContracts = state.contracts.filter((contract) => contract.signed);
  const rescindedContracts = state.contracts.filter((contract) => contract.rescinded);
  const rentContracts = state.contracts.filter((contract) => contract.type === "Locacao");
  const saleContracts = state.contracts.filter((contract) => contract.type === "Compra");
  const oneOffContracts = state.contracts.filter((contract) => contract.type === "Avulso");

  const reportCards = [
    {
      title: "Imoveis",
      total: state.properties.length,
      detail: `${availableProperties.length} disponiveis`,
      rows: [
        ["Indisponiveis", unavailableProperties.length],
        ["Venda", saleProperties.length],
        ["Locacao", rentProperties.length],
        ["Com proprietario", propertiesWithOwner.length],
        ["Valor bruto", formatter.format(grossPortfolio)],
        ["Valor liquido", formatter.format(netPortfolio)],
        ["Lucro previsto", `${formatter.format(profitPortfolio)} (${profitPercent.toFixed(1)}%)`],
        ["Lucro mensal locacao", formatter.format(monthlyRentProfit)],
      ],
    },
    {
      title: "Clientes",
      total: state.clients.length,
      detail: `${clientsWithCpf.length} com CPF`,
      rows: [
        ["Com endereco", clientsWithAddress.length],
        ["Com documentos", clientsWithDocuments.length],
        ["Sem documentos", state.clients.length - clientsWithDocuments.length],
      ],
    },
    {
      title: "Proprietarios",
      total: state.owners.length,
      detail: `${ownersWithProperties.length} com imovel`,
      rows: [
        ["Sem imovel", ownersWithoutProperties.length],
        ["Com documentos", ownersWithDocuments.length],
        ["Imoveis vinculados", propertiesWithOwner.length],
      ],
    },
    {
      title: "Contratos",
      total: state.contracts.length,
      detail: `${activeContracts.length} ativos`,
      rows: [
        ["Inativos", inactiveContracts.length],
        ["Assinados", signedContracts.length],
        ["Rescindidos", rescindedContracts.length],
        ["Locacao", rentContracts.length],
        ["Venda", saleContracts.length],
        ["Avulso", oneOffContracts.length],
      ],
    },
  ];

  grid.innerHTML = reportCards
    .map(
      (card) => `
        <article class="dashboard-report-card">
          <div>
            <span>${card.title}</span>
            <strong>${card.total}</strong>
            <small>${card.detail}</small>
          </div>
          <div class="dashboard-report-lines">
            ${card.rows.map(([label, value]) => `<p><span>${label}</span><b>${value}</b></p>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function locationFilterValue(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const parts = text.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 2] : parts[0];
}

function updateFilterSelect(selector, options, currentValue) {
  const select = document.querySelector(selector);
  if (!select) return;
  const firstOption = select.querySelector("option")?.outerHTML || '<option value="all">Todos</option>';
  const uniqueOptions = [...new Set(options.filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  select.innerHTML = `${firstOption}${uniqueOptions.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}`;
  select.value = uniqueOptions.includes(currentValue) ? currentValue : "all";
  state.filters[select.dataset.filter] = select.value;
}

function renderListFilterOptions() {
  updateFilterSelect(
    '[data-filter="propertyType"]',
    state.properties.map((property) => property.type),
    state.filters.propertyType,
  );
  updateFilterSelect(
    '[data-filter="propertyCity"]',
    state.properties.map((property) => property.city || locationFilterValue(propertyLocation(property))),
    state.filters.propertyCity,
  );
  updateFilterSelect(
    '[data-filter="clientCity"]',
    state.clients.map((client) => locationFilterValue(client.address)),
    state.filters.clientCity,
  );
  updateFilterSelect(
    '[data-filter="ownerCity"]',
    state.owners.map((owner) => locationFilterValue(owner.address)),
    state.filters.ownerCity,
  );
}

function renderProperties() {
  const list = document.querySelector("#property-list");
  const query = normalize(state.filters.properties);
  const purpose = state.filters.propertyPurpose;
  const availability = state.filters.propertyAvailability;
  const type = state.filters.propertyType;
  const city = state.filters.propertyCity;
  const items = state.properties.filter((property) => {
    const searchMatch = normalize(`${property.title} ${property.type} ${property.subtype} ${property.purpose} ${propertyLocation(property)} ${propertyOwner(property).name}`).includes(query);
    const purposeMatch = purpose === "all" || property.purpose === purpose;
    const availabilityMatch =
      availability === "all" ||
      (availability === "available" && property.available) ||
      (availability === "unavailable" && !property.available);
    const typeMatch = type === "all" || property.type === type;
    const cityMatch = city === "all" || normalize(property.city || propertyLocation(property)).includes(normalize(city));
    return searchMatch && purposeMatch && availabilityMatch && typeMatch && cityMatch;
  });

  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Nenhum imovel encontrado.</div>';
    return;
  }

  items.forEach((property) => {
    const article = document.createElement("article");
    const photos = Array.isArray(property.photos) ? property.photos : [];
    const firstPhoto = getPhotoSrc(photos[0]);
    const title = escapeHtml(property.title);
    const type = escapeHtml(property.type);
    const subtype = escapeHtml(property.subtype || "");
    const purpose = escapeHtml(property.purpose);
    const area = escapeHtml(property.area || 0);
    const location = escapeHtml(propertyLocation(property) || "Localizacao nao informada");
    const rooms = escapeHtml(property.rooms || 0);
    const notes = escapeHtml(property.notes || "Sem observacoes.");

    article.className = "property-card clickable-card";
    article.tabIndex = 0;
    article.dataset.profileType = "property";
    article.dataset.profileId = property.id;
    article.innerHTML = `
      ${
        firstPhoto
          ? `<div class="card-photo">
              <img src="${firstPhoto}" alt="Foto de ${title}">
              <span class="photo-count">${escapeHtml(photos[0].label || "Principal")}</span>
            </div>`
          : '<div class="card-band"></div>'
      }
      <div class="card-body">
        <div class="card-meta">
          <span class="pill">${type}</span>
          <span class="pill">${subtype}</span>
          <span class="pill purpose-pill">${purpose}</span>
          <span class="pill ${property.available ? "available-pill" : "unavailable-pill"}">${property.available ? "Disponivel" : "Indisponivel"}</span>
          <span class="pill">${area} m2</span>
        </div>
        <h3>${title}</h3>
        <div class="price">${formatter.format(propertyNetValue(property))}</div>
        <p class="card-text">${location}${hasPositiveNumber(property.rooms) ? ` &middot; ${rooms} quartos` : ""}</p>
        <p class="card-text">${notes}</p>
      </div>
    `;
    list.append(article);
  });
}

function renderContractOptions() {
  const form = document.querySelector("#contract-form");
  if (!form) return;

  const propertySelect = form.querySelector("[name='propertyId']");
  const clientSelect = form.querySelector("[name='clientId']");

  propertySelect.innerHTML = state.properties
    .map((property) => `<option value="${property.id}">${escapeHtml(property.title)} - ${property.available ? "Disponivel" : "Indisponivel"}</option>`)
    .join("");
  clientSelect.innerHTML = state.clients
    .map((client) => `<option value="${client.id}">${escapeHtml(client.name)} - ${escapeHtml(client.cpf)}</option>`)
    .join("");
  syncContractValueFromProperty(false);
}

function renderContractList() {
  const list = document.querySelector("#contract-list");
  if (!list) return;

  updateContractFilterButtons();
  const items = state.contracts.filter((contract) => {
    const typeMatch = state.filters.contractType === "all" || contract.type === state.filters.contractType;
    const status = contractComputedStatus(contract);
    const statusMatch =
      state.filters.contractStatus === "all"
        ? status !== "Inativo"
        : status === state.filters.contractStatus;
    const periodMatch = sameMonth(contract.issuedAt || contract.createdAt, state.filters.contractPeriod);
    return typeMatch && statusMatch && periodMatch;
  });

  list.innerHTML = items.length
    ? items.map(renderContractItem).join("")
    : '<p class="empty-state">Nenhum contrato emitido.</p>';
}

function updateContractFilterButtons() {
  document.querySelectorAll("[data-contract-type-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.contractTypeFilter === state.filters.contractType);
  });
  document.querySelectorAll("[data-contract-status-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.contractStatusFilter === state.filters.contractStatus);
  });
  document.querySelectorAll("[data-contract-period-filter]").forEach((input) => {
    input.value = state.filters.contractPeriod;
  });
}

function contractComputedStatus(contract) {
  if (contract.rescinded) return "Inativo";
  if (contract.inactive) return "Inativo";
  const dueDate = contractDueDate(contract);
  if (!dueDate) return contract.status || "Ativo";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T12:00:00`);
  const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Inativo";
  if (diffDays <= 7) return "Vence em 7 dias";
  return contract.status || "Ativo";
}

function contractAmount(contract) {
  if (contract.type === "Compra") return Number(contract.negotiatedValue || contract.downPayment || contract.amount || 0);
  if (contract.type === "Avulso") return Number(contract.oneOffValue || contract.amount || 0);
  return Number(contract.monthlyValue || contract.amount || 0);
}

function contractDaysToDue(contract) {
  const dueDate = contractDueDate(contract);
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T12:00:00`);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

function contractDueDate(contract) {
  if (contract.type === "Avulso") return contract.seasonEnd || contract.dueDate || "";
  if (contract.type !== "Locacao") return "";
  if (contract.dueDate) return contract.dueDate;
  const issued = new Date(contract.issuedAt || contract.createdAt || new Date().toISOString());
  if (Number.isNaN(issued.getTime())) return "";
  issued.setMonth(issued.getMonth() + Number(contract.termMonths || 0));
  return issued.toISOString().slice(0, 10);
}

function contractSignatureParties(contract) {
  const property = findProperty(contract.propertyId);
  const owner = property ? propertyOwner(property) : null;
  const client = findClient(contract.clientId);
  const parties = [
    { role: contract.type === "Locacao" ? "Locador(a)" : contract.type === "Avulso" ? "Responsavel pelo imovel" : "Vendedor(a)", name: owner?.name || "Proprietario", key: "owner" },
    { role: contract.type === "Locacao" ? "Locatario(a)" : contract.type === "Avulso" ? "Cliente" : "Comprador(a)", name: client?.name || "Cliente", key: "client" },
  ];
  if (contract.type === "Locacao" && contract.hasGuarantor === "Sim" && contract.guarantor?.name) {
    parties.push({ role: "Fiador(a)", name: contract.guarantor.name, key: "guarantor" });
  }
  parties.push({ role: "Imobiliaria", name: state.company.name || "Imobiliaria", key: "company" });
  return parties;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
}

function monthValue(value) {
  if (!value) return "";
  return String(value).slice(0, 7);
}

function sameMonth(value, period) {
  return !period || monthValue(value) === period;
}

function padDatePart(value) {
  return String(value).padStart(2, "0");
}

function formatIsoDate(date) {
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`;
}

function addMonthsToDate(value, months) {
  if (!value) return "";
  const base = new Date(`${value}T12:00:00`);
  if (Number.isNaN(base.getTime())) return "";
  const targetMonth = base.getMonth() + Number(months || 0);
  const targetYear = base.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  return formatIsoDate(new Date(targetYear, normalizedMonth, Math.min(base.getDate(), lastDay), 12));
}

function addMonthsToMonth(value, months) {
  if (!value) return "";
  const [year, month] = String(value).split("-").map(Number);
  if (!year || !month) return "";
  const date = new Date(year, month - 1 + Number(months || 0), 1, 12);
  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}`;
}

function daysUntilDate(value) {
  if (!value) return null;
  const today = new Date(new Date().toISOString().slice(0, 10));
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date - today) / (1000 * 60 * 60 * 24));
}

function renderInvoiceSummary() {
  const summary = document.querySelector("#invoice-summary");
  if (!summary) return;

  const active = state.contracts.filter((contract) => contractComputedStatus(contract) !== "Inativo");
  const expiring = state.contracts.filter((contract) => {
    const days = contractDaysToDue(contract);
    return days !== null && days >= 0 && days <= 7;
  });
  const expired = state.contracts.filter((contract) => contractComputedStatus(contract) === "Inativo");
  const totalValue = state.contracts.reduce((sum, contract) => sum + contractAmount(contract), 0);

  summary.innerHTML = `
    <article class="invoice-metric">
      <span>Valor em contratos</span>
      <strong>${formatter.format(totalValue)}</strong>
    </article>
    <article class="invoice-metric">
      <span>Contratos ativos</span>
      <strong>${active.length}</strong>
    </article>
    <article class="invoice-metric danger">
      <span>Lembretes 7 dias</span>
      <strong>${expiring.length}</strong>
    </article>
    <article class="invoice-metric">
      <span>Inativos</span>
      <strong>${expired.length}</strong>
    </article>
  `;
}

function renderContractReminders() {
  const reminders = document.querySelector("#contract-reminders");
  if (!reminders) return;

  const expiring = state.contracts.filter((contract) => {
    const days = contractDaysToDue(contract);
    return days !== null && days >= 0 && days <= 7;
  });

  reminders.innerHTML = expiring.length
    ? expiring
        .map((contract) => {
          const property = findProperty(contract.propertyId);
          const client = findClient(contract.clientId);
          const days = contractDaysToDue(contract);
          return `
            <article class="contract-reminder">
              <strong>${escapeHtml(contract.type)} vence ${days === 0 ? "hoje" : `em ${days} dia${days > 1 ? "s" : ""}`}</strong>
              <span>${escapeHtml(property?.title || "Imovel removido")} · ${escapeHtml(client?.name || "Cliente removido")} · ${escapeHtml(contract.dueDate)}</span>
            </article>
          `;
        })
        .join("")
    : "";
}

function renderClients() {
  const list = document.querySelector("#client-list");
  const query = normalize(state.filters.clients);
  const contractFilter = state.filters.clientContract;
  const documentFilter = state.filters.clientDocument;
  const city = state.filters.clientCity;
  const items = state.clients.filter((client) => {
    const contracts = clientContracts(client.id).length;
    const documents = Array.isArray(client.documents) ? client.documents.length : 0;
    const searchMatch = normalize(`${client.name} ${client.cpf} ${client.contact1} ${client.contact2} ${client.address}`).includes(query);
    const contractMatch = contractFilter === "all" || (contractFilter === "with" && contracts > 0) || (contractFilter === "without" && contracts === 0);
    const documentMatch = documentFilter === "all" || (documentFilter === "with" && documents > 0) || (documentFilter === "without" && documents === 0);
    const cityMatch = city === "all" || normalize(client.address).includes(normalize(city));
    return searchMatch && contractMatch && documentMatch && cityMatch;
  });

  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Nenhum cliente encontrado.</div>';
    return;
  }

  items.forEach((client) => {
    const initial = normalize(client.name).charAt(0).toUpperCase() || "C";
    const photo = getPhotoSrc(entityPhoto(client));
    const name = escapeHtml(client.name);
    const contact1 = escapeHtml(client.contact1 || "");
    const contact2 = escapeHtml(client.contact2 || "");
    const notes = escapeHtml(client.notes || "Sem perfil cadastrado.");
    const contracts = clientContracts(client.id).length;
    const article = document.createElement("article");

    article.className = "client-card clickable-card";
    article.tabIndex = 0;
    article.dataset.profileType = "client";
    article.dataset.profileId = client.id;
    article.innerHTML = `
      <div class="client-top">
        <div>
          <h3>${name}</h3>
          <div class="client-meta">
            <span class="pill">${escapeHtml(client.cpf || "CPF nao informado")}</span>
            ${contracts ? `<span class="pill">${contracts} contrato${contracts > 1 ? "s" : ""}</span>` : ""}
          </div>
        </div>
        <span class="avatar" aria-hidden="true">
          ${photo ? `<img src="${photo}" alt="" style="${cropStyle(client.crop)}">` : initial}
        </span>
      </div>
      <p>${escapeHtml(client.contact1Name || "Contato 1")}: ${contact1}${contact2 ? ` &middot; ${escapeHtml(client.contact2Name || "Contato 2")}: ${contact2}` : ""}</p>
      ${client.address ? `<p>${escapeHtml(client.address)}</p>` : ""}
      <p>${notes}</p>
    `;
    list.append(article);
  });
}

function renderOwners() {
  const list = document.querySelector("#owner-list");
  if (!list) return;

  const query = normalize(state.filters.owners);
  const propertyFilter = state.filters.ownerProperty;
  const documentFilter = state.filters.ownerDocument;
  const city = state.filters.ownerCity;
  const items = state.owners.filter((owner) => {
    const properties = ownerProperties(owner.id).length;
    const documents = Array.isArray(owner.documents) ? owner.documents.length : 0;
    const searchMatch = normalize(`${owner.name} ${owner.cpf} ${owner.contact1} ${owner.contact2} ${owner.address}`).includes(query);
    const propertyMatch = propertyFilter === "all" || (propertyFilter === "with" && properties > 0) || (propertyFilter === "without" && properties === 0);
    const documentMatch = documentFilter === "all" || (documentFilter === "with" && documents > 0) || (documentFilter === "without" && documents === 0);
    const cityMatch = city === "all" || normalize(owner.address).includes(normalize(city));
    return searchMatch && propertyMatch && documentMatch && cityMatch;
  });

  list.innerHTML = "";

  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Nenhum proprietario encontrado.</div>';
    return;
  }

  items.forEach((owner) => {
    const initial = normalize(owner.name).charAt(0).toUpperCase() || "P";
    const photo = getPhotoSrc(owner.photo);
    const properties = ownerProperties(owner.id).length;
    const article = document.createElement("article");

    article.className = "client-card clickable-card";
    article.tabIndex = 0;
    article.dataset.profileType = "owner";
    article.dataset.profileId = owner.id;
    article.innerHTML = `
      <div class="client-top">
        <div>
          <h3>${escapeHtml(owner.name)}</h3>
          <div class="client-meta">
            <span class="pill">${escapeHtml(owner.cpf || "CPF nao informado")}</span>
            ${properties ? `<span class="pill">${properties} imovel${properties > 1 ? "is" : ""}</span>` : ""}
          </div>
        </div>
        <span class="avatar" aria-hidden="true">
          ${photo ? `<img src="${photo}" alt="" style="${cropStyle(owner.crop)}">` : initial}
        </span>
      </div>
      <p>${escapeHtml(owner.contact1Name || "Contato 1")}: ${escapeHtml(owner.contact1 || "")}${owner.contact2 ? ` &middot; ${escapeHtml(owner.contact2Name || "Contato 2")}: ${escapeHtml(owner.contact2)}` : ""}</p>
      ${owner.address ? `<p>${escapeHtml(owner.address)}</p>` : ""}
      <p>${escapeHtml(owner.notes || "Sem observacoes.")}</p>
    `;
    list.append(article);
  });
}

function renderOwnerOptions() {
  const ownerSelect = document.querySelector("#property-form [name='ownerId']");
  if (!ownerSelect) return;

  ownerSelect.innerHTML = state.owners.length
    ? state.owners.map((owner) => `<option value="${owner.id}">${escapeHtml(owner.name)} - ${escapeHtml(owner.cpf)}</option>`).join("")
    : '<option value="">Cadastre um proprietario primeiro</option>';
}

function resetTeamForm() {
  const form = document.querySelector("#settings-team-form") || document.querySelector("#team-form");
  if (!form) return;
  form.reset();
  form.elements.teamId.value = "";
  const title = document.querySelector("#settings-team-form-title") || document.querySelector("#team-form-title");
  if (title) title.textContent = "Novo usuario";
  const cancel = form.querySelector("[data-team-cancel]");
  if (cancel) cancel.hidden = true;
}

function fillTeamForm(member) {
  const form = document.querySelector("#settings-team-form") || document.querySelector("#team-form");
  if (!form || !member) return;
  form.elements.teamId.value = member.id;
  form.elements.name.value = member.name || "";
  form.elements.role.value = member.role || "Atendimento";
  form.elements.email.value = member.email || "";
  form.elements.phone.value = member.phone || "";
  form.elements.accessLevel.value = member.accessLevel || "Operacional";
  form.elements.status.value = member.status || "Ativo";
  form.elements.notes.value = member.notes || "";
  form.querySelectorAll('[name="permissions"]').forEach((checkbox) => {
    checkbox.checked = (member.permissions || []).includes(checkbox.value);
  });
  const title = document.querySelector("#settings-team-form-title") || document.querySelector("#team-form-title");
  if (title) title.textContent = "Editar usuario";
  const cancel = form.querySelector("[data-team-cancel]");
  if (cancel) cancel.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderTeam() {
  const list = document.querySelector("#settings-team-list") || document.querySelector("#team-list");
  if (!list) return;

  list.innerHTML = "";
  if (!state.team.length) {
    list.innerHTML = '<div class="empty-state">Nenhum membro cadastrado.</div>';
    return;
  }

  state.team.forEach((member) => {
    const permissions = member.permissions?.length ? member.permissions.join(", ") : "Sem permissoes liberadas";
    const passwordStatus = member.passwordSet ? "Senha definida" : "Primeiro acesso pendente";
    const article = document.createElement("article");
    article.className = "team-card";
    article.innerHTML = `
      <div class="team-card-top">
        <span class="avatar" aria-hidden="true">${escapeHtml(normalize(member.name).charAt(0).toUpperCase() || "E")}</span>
        <div>
          <h3>${escapeHtml(member.name)}</h3>
          <div class="client-meta">
            <span class="pill">${escapeHtml(member.role)}</span>
            <span class="pill">${escapeHtml(member.accessLevel)}</span>
            <span class="pill ${member.status === "Ativo" ? "available-pill" : "unavailable-pill"}">${escapeHtml(member.status)}</span>
          </div>
        </div>
      </div>
      <p>${escapeHtml(member.email || "Email nao informado")}${member.phone ? ` &middot; ${escapeHtml(member.phone)}` : ""}</p>
      <p><strong>Permissoes:</strong> ${escapeHtml(permissions)}</p>
      <p><strong>Senha:</strong> ${escapeHtml(passwordStatus)}</p>
      ${member.notes ? `<p>${escapeHtml(member.notes)}</p>` : ""}
      <div class="team-actions">
        ${canManageUsers() ? `<button class="secondary-button" type="button" data-edit-team="${member.id}">Editar acesso</button>` : ""}
        ${canManageUsers() ? `<button class="danger-button" type="button" data-delete-team="${member.id}">Remover acesso</button>` : ""}
      </div>
    `;
    list.append(article);
  });
}

function renderOperationalOptions() {
  const propertyOptions = [
    '<option value="">Selecione</option>',
    ...state.properties.map((property) => `<option value="${property.id}">${escapeHtml(property.title)} - ${escapeHtml(propertyLocation(property) || "")}</option>`),
  ].join("");
  const clientOptions = [
    '<option value="">Nao vincular cliente</option>',
    ...state.clients.map((client) => `<option value="${client.id}">${escapeHtml(client.name)} - ${escapeHtml(client.cpf || "")}</option>`),
  ].join("");
  const invoiceClientOptions = [
    '<option value="">Selecione</option>',
    ...state.clients.map((client) => `<option value="${client.id}">${escapeHtml(client.name)} - ${escapeHtml(client.cpf || "")}</option>`),
  ].join("");
  const contractOptions = [
    '<option value="">Sem contrato vinculado</option>',
    ...state.contracts.map((contract) => {
      const property = findProperty(contract.propertyId);
      const client = findClient(contract.clientId);
      return `<option value="${contract.id}">${escapeHtml(contract.type)} - ${escapeHtml(property?.title || "Imovel")} - ${escapeHtml(client?.name || "Cliente")}</option>`;
    }),
  ].join("");
  const leaseContractOptions = [
    '<option value="">Sem contrato vinculado</option>',
    ...state.contracts
      .filter((contract) => contract.type === "Locacao")
      .map((contract) => {
        const property = findProperty(contract.propertyId);
        const client = findClient(contract.clientId);
        return `<option value="${contract.id}">${escapeHtml(property?.title || "Imovel")} - ${escapeHtml(client?.name || "Cliente")}</option>`;
      }),
  ].join("");
  const saleContractOptions = [
    '<option value="">Sem contrato vinculado</option>',
    ...state.contracts
      .filter((contract) => contract.type === "Compra")
      .map((contract) => {
        const property = findProperty(contract.propertyId);
        const client = findClient(contract.clientId);
        return `<option value="${contract.id}">${escapeHtml(property?.title || "Imovel")} - ${escapeHtml(client?.name || "Cliente")}</option>`;
      }),
  ].join("");

  document.querySelectorAll("#appointment-form [name='propertyId'], [data-invoice-form] [name='propertyId']").forEach((select) => {
    select.innerHTML = propertyOptions;
  });
  const appointmentClient = document.querySelector("#appointment-form [name='clientId']");
  if (appointmentClient) appointmentClient.innerHTML = clientOptions;
  document.querySelectorAll("[data-invoice-form] [name='clientId']").forEach((select) => {
    select.innerHTML = invoiceClientOptions;
  });
  document.querySelectorAll("[data-invoice-form='Locacao'] [name='contractId']").forEach((select) => {
    select.innerHTML = leaseContractOptions;
  });
  document.querySelectorAll("[data-invoice-form='Compra'] [name='contractId']").forEach((select) => {
    select.innerHTML = saleContractOptions;
  });
  document.querySelectorAll("[data-invoice-form='Avulsa'] [name='contractId']").forEach((select) => {
    select.innerHTML = contractOptions;
  });
}

function appointmentTimestamp(appointment) {
  return `${appointment.date || "9999-12-31"}T${appointment.time || "23:59"}`;
}

function appointmentComputedStatus(appointment) {
  if (appointment.status === "Concluido") return "Concluido";
  if (appointment.status === "Cancelado") return "Cancelado";
  if (!appointment.date) return "Ativo";

  const today = new Date(new Date().toISOString().slice(0, 10));
  const appointmentDate = new Date(appointment.date);
  const diffDays = Math.ceil((appointmentDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Pendente";
  if (diffDays <= 3) return "Quase vencendo";
  return "Ativo";
}

function renderAppointments() {
  const list = document.querySelector("#appointment-list");
  if (!list) return;
  const items = state.appointments
    .filter((appointment) => {
      const typeMatch = state.filters.appointmentType === "all" || appointment.type === state.filters.appointmentType;
      const status = appointmentComputedStatus(appointment);
      const statusMatch =
        state.filters.appointmentStatus === "all"
          ? status === "Ativo" || status === "Quase vencendo"
          : status === state.filters.appointmentStatus;
      const periodMatch = sameMonth(appointment.date, state.filters.appointmentPeriod);
      return typeMatch && statusMatch && periodMatch;
    })
    .sort((a, b) => appointmentTimestamp(a).localeCompare(appointmentTimestamp(b)));

  document.querySelectorAll("[data-appointment-type-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.appointmentTypeFilter === state.filters.appointmentType);
  });
  document.querySelectorAll("[data-appointment-status-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.appointmentStatusFilter === state.filters.appointmentStatus);
  });
  document.querySelectorAll("[data-appointment-period-filter]").forEach((input) => {
    input.value = state.filters.appointmentPeriod;
  });

  list.innerHTML = "";
  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Nenhum agendamento cadastrado.</div>';
    return;
  }

  items.forEach((appointment) => {
    const property = findProperty(appointment.propertyId);
    const client = findClient(appointment.clientId);
    const status = appointmentComputedStatus(appointment);
    const statusClass = normalize(status).replaceAll(" ", "-");
    const article = document.createElement("article");
    article.className = `operation-item clickable-card ${statusClass}`;
    article.tabIndex = 0;
    article.dataset.profileType = "appointment";
    article.dataset.profileId = appointment.id;
    article.innerHTML = `
      <div>
        <div class="invoice-title-line">
          <strong>${escapeHtml(appointment.type)}</strong>
          <span class="invoice-status ${statusClass}">${escapeHtml(status)}</span>
        </div>
        <p>${escapeHtml(formatDate(appointment.date) || appointment.date)} ${escapeHtml(appointment.time || "")} &middot; ${escapeHtml(property?.title || "Imovel nao informado")}</p>
        <p>${client ? `Cliente: ${escapeHtml(client.name)} &middot; ` : ""}Responsavel: ${escapeHtml(appointment.responsible || "Nao informado")}</p>
        ${appointment.notes ? `<p>${escapeHtml(appointment.notes)}</p>` : ""}
      </div>
    `;
    list.append(article);
  });
}

function invoiceComputedStatus(invoice) {
  if (invoice.releaseStatus === "Aguardando") return "Aguardando";
  if (invoice.status === "Paga" || invoice.status === "Inativa") return "Inativa";
  const days = daysUntilDate(invoice.dueDate);
  if (days !== null && days < 0) return "Pendente";
  if (days !== null && days <= 3) return "Quase vencendo";
  return "Ativa";
}

function invoiceIsAvailable(invoice) {
  return invoiceComputedStatus(invoice) !== "Aguardando";
}

function invoiceBookletItems(invoice) {
  if (!invoice?.bookletId) return [];
  return state.invoices
    .filter((item) => item.bookletId === invoice.bookletId)
    .sort((a, b) => Number(a.installmentNumber || 1) - Number(b.installmentNumber || 1));
}

function invoiceInstallmentDisplay(invoice) {
  if (invoice.installment === "Entrada") return "entrada";
  if (invoice.category === "Compra" && invoice.installment) return `parcela ${invoice.installment}`;
  return `parcela ${Number(invoice.installmentNumber || 1)} de ${Number(invoice.installmentTotal || 1)}`;
}

function releaseNextBookletInvoice(invoice) {
  const booklet = invoiceBookletItems(invoice);
  const index = booklet.findIndex((item) => item.id === invoice.id);
  const next = booklet[index + 1];
  if (!next || next.releaseStatus !== "Aguardando") return false;
  next.releaseStatus = "Disponivel";
  if (next.status === "Aguardando") next.status = "Aberta";
  return true;
}

function invoiceReminderText(invoice) {
  if (invoice.category !== "Locacao") return "";
  const days = daysUntilDate(invoice.dueDate);
  if (days === null || days > 3 || days < 0 || invoiceComputedStatus(invoice) === "Inativa") return "";
  return `WhatsApp programado: ${escapeHtml(invoice.whatsappTo || "numero nao informado")} - ${days === 0 ? "vence hoje" : `faltam ${days} dia${days > 1 ? "s" : ""}`}`;
}

function renderInvoices() {
  const list = document.querySelector("#invoice-list");
  const summary = document.querySelector("#invoice-page-summary");
  if (!list) return;
  const listedInvoices = state.invoices.filter(invoiceIsAvailable);
  const open = listedInvoices.filter((invoice) => invoiceComputedStatus(invoice) !== "Inativa");
  const paid = state.invoices.filter((invoice) => invoiceComputedStatus(invoice) === "Inativa");
  const overdue = listedInvoices.filter((invoice) => invoiceComputedStatus(invoice) === "Pendente");
  const openValue = open.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  if (summary) {
    summary.innerHTML = `
      <article class="invoice-metric"><span>Ativas</span><strong>${open.length}</strong></article>
      <article class="invoice-metric"><span>Inativas</span><strong>${paid.length}</strong></article>
      <article class="invoice-metric danger"><span>Pendentes</span><strong>${overdue.length}</strong></article>
      <article class="invoice-metric"><span>Valor em aberto</span><strong>${formatter.format(openValue)}</strong></article>
    `;
  }

  list.innerHTML = "";
  const items = listedInvoices.filter((invoice) => {
    const typeMatch = state.filters.invoiceType === "all" || invoice.category === state.filters.invoiceType;
    const status = invoiceComputedStatus(invoice);
    const statusMatch = state.filters.invoiceStatus === "all" ? status !== "Inativa" : status === state.filters.invoiceStatus;
    const periodMatch = sameMonth(invoice.reference || invoice.dueDate || invoice.createdAt, state.filters.invoicePeriod);
    return typeMatch && statusMatch && periodMatch;
  });
  document.querySelectorAll("[data-invoice-type-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.invoiceTypeFilter === state.filters.invoiceType);
  });
  document.querySelectorAll("[data-invoice-status-filter]").forEach((button) => {
    button.classList.toggle("active", button.dataset.invoiceStatusFilter === state.filters.invoiceStatus);
  });
  document.querySelectorAll("[data-invoice-period-filter]").forEach((input) => {
    input.value = state.filters.invoicePeriod;
  });

  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Nenhuma fatura emitida.</div>';
    return;
  }

  items.forEach((invoice) => {
    const client = findClient(invoice.clientId);
    const property = findProperty(invoice.propertyId);
    const status = invoiceComputedStatus(invoice);
    const article = document.createElement("article");
    article.className = `operation-item clickable-card ${normalize(status)}`;
    article.tabIndex = 0;
    article.dataset.profileType = "invoice";
    article.dataset.profileId = invoice.id;
    article.innerHTML = `
      <button class="contract-card-download" type="button" data-download-invoice="${invoice.id}" title="Baixar fatura" aria-label="Baixar fatura">↓</button>
      <div>
        <div class="invoice-title-line">
          <strong>Fatura de ${escapeHtml(invoice.category)}</strong>
          <span class="invoice-status ${normalize(status)}">${escapeHtml(status)}</span>
        </div>
        <p>${formatter.format(Number(invoice.amount || 0))} &middot; vencimento ${escapeHtml(formatDate(invoice.dueDate) || invoice.dueDate)}</p>
        <p>${escapeHtml(client?.name || "Cliente removido")}${property ? ` &middot; ${escapeHtml(property.title)}` : ""}</p>
        ${invoice.installmentTotal > 1 ? `<p>Carne: ${invoiceInstallmentDisplay(invoice)}</p>` : ""}
        ${invoice.reference ? `<p>Referencia: ${escapeHtml(invoice.reference)}${invoice.contractEndReference ? ` &middot; ultimo mes: ${escapeHtml(invoice.contractEndReference)}` : ""}</p>` : ""}
        ${invoiceReminderText(invoice) ? `<p>${invoiceReminderText(invoice)}</p>` : ""}
        ${invoice.description ? `<p>${escapeHtml(invoice.description)}</p>` : ""}
      </div>
      <div class="operation-actions">
        ${invoiceBookletItems(invoice).length > 1 ? `<button class="secondary-button" type="button" data-download-invoice-booklet="${invoice.id}">Baixar carne</button>` : ""}
        <button class="secondary-button" type="button" data-download-invoice="${invoice.id}">Baixar fatura</button>
        <button class="secondary-button" type="button" data-pay-invoice="${invoice.id}" ${status === "Inativa" ? "disabled" : ""}>${status === "Inativa" ? "Finalizada" : "Registrar pagamento"}</button>
      </div>
    `;
    list.append(article);
  });
}

function renderPropertySubtypeOptions(selectedSubtype = "") {
  const typeSelect = document.querySelector("#property-form [name='type']");
  const subtypeSelect = document.querySelector("#property-form [name='subtype']");
  if (!typeSelect || !subtypeSelect) return;

  const options = propertyTypes[typeSelect.value] || [];
  subtypeSelect.innerHTML = options
    .map((subtype) => `<option value="${subtype}" ${subtype === selectedSubtype ? "selected" : ""}>${subtype}</option>`)
    .join("");
}

function publicProperties() {
  const query = normalize(state.filters.publicQuery);
  const purpose = state.filters.publicPurpose;
  const city = state.filters.publicCity;
  const type = state.filters.publicType;
  const maxPrice = Number(state.filters.publicMaxPrice || 0);

  return state.properties.filter((property) => {
    if (property.available === false) return false;
    const text = normalize(`${property.title} ${property.type} ${property.subtype} ${property.purpose} ${propertyLocation(property)} ${property.notes}`);
    const queryMatch = !query || text.includes(query);
    const purposeMatch = purpose === "all" || property.purpose === purpose;
    const cityMatch = city === "all" || normalize(property.city || propertyLocation(property)).includes(normalize(city));
    const typeMatch = type === "all" || property.type === type;
    const priceMatch = !maxPrice || propertyNetValue(property) <= maxPrice;
    return queryMatch && purposeMatch && cityMatch && typeMatch && priceMatch;
  });
}

function publicContactHref(property = null) {
  const phone = String(state.company.phone || state.company.whatsapp?.sender || "").replace(/\D/g, "");
  const text = property
    ? `Ola, tenho interesse no imovel ${property.title}.`
    : `Ola, quero atendimento da ${state.company.name || "imobiliaria"}.`;
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : `mailto:${state.company.email || ""}?subject=${encodeURIComponent("Interesse em imovel")}&body=${encodeURIComponent(text)}`;
}

function renderPublicContactPage() {
  const info = document.querySelector("#site-contact-info");
  if (info) {
    const rows = [
      ["Telefone", state.company.phone],
      ["Email", state.company.email],
      ["Endereco", state.company.address],
      ["CRECI", state.company.creci],
      ["Razao social", state.company.legalName],
      ["CNPJ", state.company.cnpj],
    ].filter(([, value]) => value);
    info.innerHTML = rows.length
      ? rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join("")
      : '<p>Configure telefone, email e endereco em Configuracoes > Perfil da empresa.</p>';
  }

  const list = document.querySelector("#site-realtor-list");
  if (list) {
    const members = state.team.filter((member) => member.status !== "Inativo" && ["Corretor", "Gestao", "Atendimento"].includes(member.role));
    list.innerHTML = members.length
      ? members
          .map(
            (member) => `
              <article class="site-realtor-item">
                <span class="avatar" aria-hidden="true">${escapeHtml(normalize(member.name).charAt(0).toUpperCase() || "C")}</span>
                <div>
                  <strong>${escapeHtml(member.name)}</strong>
                  <p>${escapeHtml(member.role || "Equipe")}${member.phone ? ` · ${escapeHtml(member.phone)}` : ""}</p>
                  ${member.email ? `<a href="mailto:${escapeHtml(member.email)}">${escapeHtml(member.email)}</a>` : ""}
                </div>
              </article>
            `,
          )
          .join("")
      : '<p>Cadastre corretores em Configuracoes > Usuarios para exibir a equipe no site.</p>';
  }
}

function renderPublicBranding() {
  document.querySelectorAll("[data-public-company-name]").forEach((item) => {
    item.textContent = state.company.name || "Regis Imobiliaria";
  });
  document.querySelectorAll("[data-public-creci]").forEach((item) => {
    item.textContent = state.company.creci ? `CRECI ${state.company.creci}` : "Imobiliaria";
  });
  const heroTitle = document.querySelector("[data-public-hero-title]");
  if (heroTitle) heroTitle.textContent = state.company.name || "Regis Imobiliaria";
  const logo = document.querySelector("[data-public-logo]");
  if (logo) {
    logo.innerHTML = state.company.logo ? `<img src="${state.company.logo}" alt="${escapeHtml(state.company.name || "Logo")}">` : "RI";
  }
  const whatsapp = document.querySelector("[data-public-whatsapp]");
  if (whatsapp) whatsapp.href = publicContactHref();
  const email = document.querySelector("[data-public-email]");
  if (email) email.href = `mailto:${state.company.email || ""}`;
  renderPublicContactPage();
}

function setPublicPage(page = "home") {
  const allowed = ["home", "imoveis", "contato"];
  const activePage = allowed.includes(page) ? page : "home";
  document.querySelectorAll("[data-public-page]").forEach((section) => {
    section.classList.toggle("active", section.dataset.publicPage === activePage);
  });
  document.querySelectorAll("[data-public-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.publicPageLink === activePage);
  });
}

function publicPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  if (["home", "imoveis", "contato"].includes(hash)) return hash;
  if (hash === "site-imoveis") return "imoveis";
  if (hash === "site-contato") return "contato";
  return "home";
}

function renderPublicTypeOptions() {
  const select = document.querySelector("[data-public-filter='type']");
  if (!select) return;
  const selected = state.filters.publicType;
  const types = [...new Set(state.properties.filter((property) => property.available !== false).map((property) => property.type).filter(Boolean))];
  select.innerHTML = `<option value="all">Todos</option>${types.map((type) => `<option value="${escapeHtml(type)}" ${type === selected ? "selected" : ""}>${escapeHtml(type)}</option>`).join("")}`;
}

function renderPublicCityOptions() {
  const select = document.querySelector("[data-public-filter='city']");
  if (!select) return;
  const selected = state.filters.publicCity;
  const cities = [...new Set(state.properties.filter((property) => property.available !== false).map((property) => property.city).filter(Boolean))].sort();
  select.innerHTML = `<option value="all">Todas</option>${cities.map((city) => `<option value="${escapeHtml(city)}" ${city === selected ? "selected" : ""}>${escapeHtml(city)}</option>`).join("")}`;
}

function renderPublicHero(items) {
  const media = document.querySelector("#site-hero-media");
  if (!media) return;
  const featured = items[0] || state.properties.find((property) => property.available !== false);
  if (!featured) {
    media.innerHTML = '<div class="site-empty-featured">Cadastre um imovel disponivel para ele aparecer na vitrine.</div>';
    return;
  }
  const src = getPhotoSrc(featured.photos?.[0]);
  media.innerHTML = `
    <article class="site-featured-card">
      ${src ? `<img src="${src}" alt="Foto de ${escapeHtml(featured.title)}">` : ""}
      <div>
        <span class="pill purpose-pill">${escapeHtml(featured.purpose)}</span>
        <h2>${escapeHtml(featured.title)}</h2>
        <p>${escapeHtml(propertyLocation(featured) || "Localizacao sob consulta")} · ${formatter.format(propertyNetValue(featured))}</p>
      </div>
    </article>
  `;
}

function renderPublicProperties() {
  renderPublicBranding();
  renderPublicTypeOptions();
  renderPublicCityOptions();
  const list = document.querySelector("#site-property-list");
  const count = document.querySelector("#site-property-count");
  if (!list) return;
  const items = publicProperties();
  renderPublicHero(items);
  if (count) count.textContent = `${items.length} ${items.length === 1 ? "imovel" : "imoveis"}`;
  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Nenhum imovel disponivel com esses filtros.</div>';
    return;
  }
  list.innerHTML = items
    .map((property) => {
      const src = getPhotoSrc(property.photos?.[0]);
      const location = propertyLocation(property) || "Localizacao sob consulta";
      const details = [
        property.subtype || property.type,
        hasPositiveNumber(property.rooms) ? `${property.rooms} quartos` : "",
        hasPositiveNumber(property.area) ? `${property.area} m2` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      return `
        <article class="site-property-card">
          <div class="site-card-photo">
            ${src ? `<img src="${src}" alt="Foto de ${escapeHtml(property.title)}">` : ""}
          </div>
          <div class="site-card-body">
            <div class="card-meta">
              <span class="pill">${escapeHtml(property.purpose)}</span>
              <span class="pill available-pill">Disponivel</span>
            </div>
            <h3>${escapeHtml(property.title)}</h3>
            <div class="price">${formatter.format(propertyNetValue(property))}</div>
            <p>${escapeHtml(location)}</p>
            ${details ? `<p>${escapeHtml(details)}</p>` : ""}
            <div class="site-card-actions">
              <a class="submit-button" href="${escapeHtml(publicContactHref(property))}" target="_blank" rel="noopener">Tenho interesse</a>
              <a class="secondary-button" href="${escapeHtml(propertyGoogleMapsLink(property))}" target="_blank" rel="noopener">Mapa</a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function stopPublicHeroCarousel() {
  if (state.publicHeroTimer) {
    clearInterval(state.publicHeroTimer);
    state.publicHeroTimer = null;
  }
}

function startPublicHeroCarousel(total) {
  stopPublicHeroCarousel();
  if (total < 2) return;
  state.publicHeroTimer = setInterval(() => {
    state.publicHeroIndex = (state.publicHeroIndex + 1) % total;
    renderPublicHeroV2();
  }, 5200);
}

function renderPublicHeroV2(items = state.properties) {
  const media = document.querySelector("#site-hero-media");
  if (!media) return;
  const featuredItems = items.filter((property) => property.available !== false && property.featured);
  if (state.publicHeroIndex >= featuredItems.length) state.publicHeroIndex = 0;
  const featured = featuredItems[state.publicHeroIndex];
  if (!featured) {
    media.innerHTML = '<div class="site-empty-featured">Marque um imovel disponivel com estrela para ele aparecer no carrossel da Home.</div>';
    stopPublicHeroCarousel();
    return;
  }
  const src = getPhotoSrc(featured.photos?.[0]);
  const location = propertyLocation(featured) || "Localizacao sob consulta";
  media.innerHTML = `
    <div class="site-featured-carousel" aria-label="Imoveis em destaque">
      <article class="site-featured-card" data-public-property="${featured.id}">
        ${src ? `<img src="${src}" alt="Foto de ${escapeHtml(featured.title)}">` : ""}
        <div>
          <span class="pill purpose-pill">${escapeHtml(featured.purpose)}</span>
          <h2>${escapeHtml(featured.title)}</h2>
          <p>${escapeHtml(location)} &middot; ${formatter.format(propertyNetValue(featured))}</p>
          <button class="site-ghost-button" type="button">Ver detalhes</button>
        </div>
      </article>
      ${
        featuredItems.length > 1
          ? `<div class="site-featured-controls">
              <button type="button" data-public-featured="prev" aria-label="Imovel anterior">&lt;</button>
              <button type="button" data-public-featured="next" aria-label="Proximo imovel">&gt;</button>
            </div>
            <div class="site-featured-dots">
              ${featuredItems.map((_, index) => `<button type="button" class="${index === state.publicHeroIndex ? "active" : ""}" data-public-featured-dot="${index}" aria-label="Destaque ${index + 1}"></button>`).join("")}
            </div>`
          : ""
      }
    </div>
  `;
  startPublicHeroCarousel(featuredItems.length);
}
function renderPublicProperties() {
  renderPublicBranding();
  renderPublicTypeOptions();
  renderPublicCityOptions();
  const list = document.querySelector("#site-property-list");
  const count = document.querySelector("#site-property-count");
  if (!list) return;
  const items = publicProperties();
  renderPublicHeroV2();
  setPublicPage(publicPageFromHash());
  if (count) count.textContent = `${items.length} ${items.length === 1 ? "imovel" : "imoveis"}`;
  if (!items.length) {
    list.innerHTML = '<div class="empty-state">Nenhum imovel disponivel com esses filtros.</div>';
    return;
  }
  list.innerHTML = items
    .map((property) => {
      const src = getPhotoSrc(property.photos?.[0]);
      const location = propertyLocation(property) || "Localizacao sob consulta";
      const details = [
        property.subtype || property.type,
        hasPositiveNumber(property.rooms) ? `${property.rooms} quartos` : "",
        hasPositiveNumber(property.area) ? `${property.area} m2` : "",
      ]
        .filter(Boolean)
        .join(" · ");
      return `
        <article class="site-property-card" data-public-property="${property.id}" tabindex="0" role="button" aria-label="Ver detalhes de ${escapeHtml(property.title)}">
          <div class="site-card-photo">
            ${src ? `<img src="${src}" alt="Foto de ${escapeHtml(property.title)}">` : ""}
            <span>${escapeHtml(property.purpose)}</span>
          </div>
          <div class="site-card-body">
            <div class="card-meta">
              <span class="pill">${escapeHtml(property.purpose)}</span>
              <span class="pill available-pill">Disponivel</span>
            </div>
            <h3>${escapeHtml(property.title)}</h3>
            <div class="price">${formatter.format(propertyNetValue(property))}</div>
            <p>${escapeHtml(location)}</p>
            ${details ? `<p>${escapeHtml(details)}</p>` : ""}
            <div class="site-card-actions">
              <a class="submit-button" href="${escapeHtml(publicContactHref(property))}" target="_blank" rel="noopener">Tenho interesse</a>
              <button class="secondary-button" type="button" data-public-property="${property.id}">Detalhes</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPublicPropertyDetail(propertyId) {
  const property = findProperty(propertyId);
  if (!property || property.available === false) return;
  const modal = document.querySelector("#public-property-modal");
  const content = document.querySelector("#public-property-content");
  const title = document.querySelector("#public-property-title");
  if (!modal || !content) return;
  const photos = Array.isArray(property.photos) ? property.photos : [];
  const mainPhoto = getPhotoSrc(photos[0]);
  const map = propertyGoogleMapsEmbed(property);
  const details = [
    ["Finalidade", property.purpose],
    ["Tipo", [property.type, property.subtype].filter(Boolean).join(" / ")],
    ["Valor", formatter.format(propertyNetValue(property))],
    ["Area", hasPositiveNumber(property.area) ? `${property.area} m2` : ""],
    ["Quartos", hasPositiveNumber(property.rooms) ? property.rooms : ""],
    ["Garagem", property.garage],
    ["IPTU", property.iptu ? formatter.format(Number(property.iptu || 0)) : ""],
  ].filter(([, value]) => value);
  if (title) title.textContent = property.title;
  content.innerHTML = `
    <div class="public-detail-layout">
      <section class="public-detail-gallery">
        <div class="public-detail-main-photo">${mainPhoto ? `<img src="${mainPhoto}" alt="Foto de ${escapeHtml(property.title)}">` : "<span>Sem foto principal</span>"}</div>
        <div class="public-detail-thumbs">
          ${photos
            .slice(0, 6)
            .map((photo) => {
              const src = getPhotoSrc(photo);
              return src ? `<img src="${src}" alt="${escapeHtml(photo.label || property.title)}">` : "";
            })
            .join("")}
        </div>
      </section>
      <aside class="public-detail-info">
        <span class="pill purpose-pill">${escapeHtml(property.purpose || "Imovel")}</span>
        <h3>${escapeHtml(formatter.format(propertyNetValue(property)))}</h3>
        <p>${escapeHtml(propertyLocation(property) || "Localizacao sob consulta")}</p>
        <div class="public-detail-grid">
          ${details.map(([label, value]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("")}
        </div>
        ${property.notes ? `<p>${escapeHtml(property.notes)}</p>` : ""}
        <div class="site-card-actions">
          <a class="submit-button" href="${escapeHtml(publicContactHref(property))}" target="_blank" rel="noopener">Tenho interesse</a>
          <a class="secondary-button" href="${escapeHtml(propertyGoogleMapsLink(property))}" target="_blank" rel="noopener">Abrir mapa</a>
        </div>
      </aside>
      <section class="public-detail-map">
        ${map ? `<iframe src="${escapeHtml(map)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>` : `<a class="secondary-button" href="${escapeHtml(propertyGoogleMapsLink(property))}" target="_blank" rel="noopener">Ver localizacao no mapa</a>`}
      </section>
    </div>
  `;
  modal.hidden = false;
}

function setAppMode(authenticated = state.authenticated) {
  if (authenticated && !activeUser()) {
    authenticated = false;
  }
  state.authenticated = authenticated;
  document.body.classList.toggle("internal-mode", authenticated);
  document.body.classList.toggle("public-mode", !authenticated);
  if (authenticated) {
    localStorage.setItem(authKey, "true");
    if (state.currentUserId) localStorage.setItem(currentUserKey, state.currentUserId);
  } else {
    localStorage.removeItem(authKey);
    localStorage.removeItem(currentUserKey);
    state.currentUserId = "";
  }
}

function openLogin() {
  document.querySelector("#login-modal").hidden = false;
}

function closeLogin() {
  document.querySelector("#login-modal").hidden = true;
}

function isValidLogin(email, password) {
  const normalizedEmail = normalize(email);
  const user = state.team.find((member) => member.status === "Ativo" && normalize(member.email) === normalizedEmail);
  if (!user) return false;
  if (!user.passwordSet) {
    user.password = password;
    user.passwordSet = true;
    user.passwordResetAuthorized = false;
    user.resetRequested = false;
    state.currentUserId = user.id;
    saveAll();
    return true;
  }
  if (user.password !== password) return false;
  state.currentUserId = user.id;
  return true;
}

function applyAccessControls() {
  if (!state.authenticated) return;
  document.querySelectorAll("[data-view-link]").forEach((link) => {
    link.hidden = !canOpenView(link.dataset.viewLink);
  });

  const activeView = document.querySelector(".view.active")?.dataset.view;
  if (activeView && !canOpenView(activeView)) {
    setView(firstAvailableView());
  }

  document.querySelector("[data-scroll-target]")?.toggleAttribute("hidden", !canWrite("Cadastros"));
  const formAccess = {
    owner: canWrite("Cadastros"),
    property: canWrite("Cadastros"),
    client: canWrite("Clientes") || canWrite("Cadastros"),
  };
  document.querySelectorAll("[data-form-tab]").forEach((button) => {
    button.hidden = !formAccess[button.dataset.formTab];
  });
  document.querySelectorAll("[data-form]").forEach((form) => {
    form.hidden = !formAccess[form.dataset.form];
  });
  const activeForm = document.querySelector("[data-form].active");
  if (activeForm?.hidden) {
    const fallbackForm = Object.entries(formAccess).find(([, allowed]) => allowed)?.[0];
    if (fallbackForm) setForm(fallbackForm);
  }
  document.querySelectorAll("[data-settings-tool]").forEach((button) => {
    button.hidden = !canUseSettingsTool(button.dataset.settingsTool);
  });
}

function render() {
  setAppMode();
  applyCompanyBranding();
  loadGoogleMapsIfConfigured();
  renderPublicProperties();
  updateMetrics();
  renderDashboardReports();
  renderProperties();
  renderClients();
  renderOwners();
  renderTeam();
  renderOperationalOptions();
  renderListFilterOptions();
  renderAppointments();
  renderInvoices();
  renderOwnerOptions();
  renderPropertySubtypeOptions(document.querySelector("#property-form [name='subtype']")?.value || "");
  renderContractOptions();
  renderContractList();
  updateContractTypeFields();
  applyAccessControls();
}

function setView(viewName) {
  if (state.authenticated && !canOpenView(viewName)) {
    showToast("Seu usuario nao tem permissao para acessar este modulo.");
    const fallback = Array.from(document.querySelectorAll("[data-view-link]")).find((link) => !link.hidden)?.dataset.viewLink || "painel";
    viewName = fallback === viewName ? "painel" : fallback;
  }
  document.querySelectorAll("[data-view]").forEach((view) => {
    view.classList.toggle("active", view.dataset.view === viewName);
  });
  document.querySelectorAll("[data-view-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.viewLink === viewName);
  });
}

function setForm(formName) {
  document.querySelectorAll("[data-form]").forEach((form) => {
    form.classList.toggle("active", form.dataset.form === formName);
  });
  document.querySelectorAll("[data-form-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.formTab === formName);
  });
}

function openProfile(type, id) {
  state.activeProfile = { type, id };
  state.activeProfileTab = "summary";
  state.carouselIndex = 0;
  document.querySelector("#profile-modal").hidden = false;
  renderProfile();
}

function closeProfile() {
  document.querySelector("#profile-modal").hidden = true;
  state.activeProfile = null;
}

function activeEntity() {
  if (!state.activeProfile) return null;
  if (state.activeProfile.type === "property") return findProperty(state.activeProfile.id);
  if (state.activeProfile.type === "owner") return findOwner(state.activeProfile.id);
  if (state.activeProfile.type === "contract") return findContract(state.activeProfile.id);
  if (state.activeProfile.type === "appointment") return state.appointments.find((appointment) => appointment.id === state.activeProfile.id);
  if (state.activeProfile.type === "invoice") return state.invoices.find((invoice) => invoice.id === state.activeProfile.id);
  return findClient(state.activeProfile.id);
}

function renderProfile(mode = "view") {
  if (!state.activeProfile) return;

  const { type } = state.activeProfile;
  const entity = activeEntity();
  if (!entity) return;

  document.querySelector("#profile-kind").textContent =
    type === "property" ? "Imovel" : type === "owner" ? "Proprietario" : type === "contract" ? "Contrato" : type === "appointment" ? "Agendamento" : type === "invoice" ? "Fatura" : "Cliente";
  document.querySelector("#profile-title").textContent =
    type === "property" ? entity.title : type === "contract" ? `Contrato de ${entity.type}` : type === "appointment" ? entity.type : type === "invoice" ? `Fatura de ${entity.category}` : entity.name;

  const content = document.querySelector("#profile-content");
  content.innerHTML = mode === "edit" ? renderEditProfile(type, entity) : renderViewProfile(type, entity);
}

function renderProfileTabs(type) {
  return `
    <div class="profile-tabs two-tabs">
      <button class="segment ${state.activeProfileTab === "summary" ? "active" : ""}" type="button" data-profile-tab="summary">Resumo</button>
      <button class="segment ${state.activeProfileTab === "documents" ? "active" : ""}" type="button" data-profile-tab="documents">Documentos</button>
    </div>
  `;
}

function renderViewProfile(type, entity) {
  if (type === "contract") return renderContractProfile(entity);
  if (type === "appointment") return renderAppointmentProfile(entity);
  if (type === "invoice") return renderInvoiceProfile(entity);
  const documents = Array.isArray(entity.documents) ? entity.documents : [];
  return `
    ${renderProfileTabs(type)}
    ${state.activeProfileTab === "summary" ? renderSummaryTab(type, entity) : ""}
    ${state.activeProfileTab === "documents" ? renderDocumentsTab(type, entity, documents) : ""}
  `;
}

function renderAppointmentProfile(appointment) {
  const property = findProperty(appointment.propertyId);
  const client = findClient(appointment.clientId);
  const status = appointmentComputedStatus(appointment);
  const statusClass = normalize(status).replaceAll(" ", "-");
  return `
    <div class="detail-list">
      <p><span class="invoice-status ${statusClass}">${escapeHtml(status)}</span></p>
      <p><strong>Tipo:</strong> ${escapeHtml(appointment.type)}</p>
      <p><strong>Status:</strong> ${escapeHtml(status)}</p>
      <p><strong>Data:</strong> ${escapeHtml(formatDate(appointment.date) || appointment.date || "Nao informado")}</p>
      <p><strong>Horario:</strong> ${escapeHtml(appointment.time || "Nao informado")}</p>
      <p><strong>Imovel:</strong> ${escapeHtml(property?.title || "Imovel nao informado")}</p>
      <p><strong>Cliente:</strong> ${escapeHtml(client?.name || "Nao vinculado")}</p>
      <p><strong>Responsavel:</strong> ${escapeHtml(appointment.responsible || "Nao informado")}</p>
      <p><strong>Observacoes:</strong> ${escapeHtml(appointment.notes || "Sem observacoes.")}</p>
    </div>
    <div class="profile-actions">
      ${
        status === "Concluido" || !canEditEntity("appointment")
          ? ""
          : `
            <button class="submit-button" type="button" data-complete-appointment="${appointment.id}">Marcar como concluido</button>
            <button class="secondary-button" type="button" data-edit-profile>Editar</button>
          `
      }
      ${canDeleteEntity("appointment") ? '<button class="danger-button" type="button" data-delete-entity="appointment">Excluir agendamento</button>' : ""}
    </div>
  `;
}

function renderInvoiceProfile(invoice) {
  const client = findClient(invoice.clientId);
  const property = findProperty(invoice.propertyId);
  const contract = findContract(invoice.contractId);
  const status = invoiceComputedStatus(invoice);
  const statusClass = normalize(status).replaceAll(" ", "-");
  return `
    <div class="detail-list">
      <p><span class="invoice-status ${statusClass}">${escapeHtml(status)}</span></p>
      <p><strong>Categoria:</strong> ${escapeHtml(invoice.category)}</p>
      <p><strong>Cliente:</strong> ${escapeHtml(client?.name || "Cliente removido")}</p>
      <p><strong>CPF/CNPJ:</strong> ${escapeHtml(client?.cpf || "Nao informado")}</p>
      <p><strong>Imovel:</strong> ${escapeHtml(property?.title || "Nao vinculado")}</p>
      <p><strong>Contrato:</strong> ${escapeHtml(contract ? `Contrato de ${contract.type}` : "Nao vinculado")}</p>
      <p><strong>Valor:</strong> ${formatter.format(Number(invoice.amount || 0))}</p>
      <p><strong>Vencimento:</strong> ${escapeHtml(formatDate(invoice.dueDate) || invoice.dueDate || "Nao informado")}</p>
      ${invoice.installmentTotal > 1 ? `<p><strong>Parcela:</strong> ${escapeHtml(invoiceInstallmentDisplay(invoice))}</p>` : ""}
      ${invoice.saleTotal ? `<p><strong>Valor total do imovel:</strong> ${formatter.format(Number(invoice.saleTotal || 0))}</p>` : ""}
      ${invoice.downPayment ? `<p><strong>Entrada:</strong> ${formatter.format(Number(invoice.downPayment || 0))}</p>` : ""}
      ${invoice.interestRate ? `<p><strong>Juros:</strong> ${escapeHtml(invoice.interestRate)}%</p>` : ""}
      ${invoice.reference ? `<p><strong>Mes de referencia:</strong> ${escapeHtml(invoice.reference)}</p>` : ""}
      ${invoice.contractEndReference ? `<p><strong>Ultimo mes do contrato:</strong> ${escapeHtml(invoice.contractEndReference)}</p>` : ""}
      ${invoice.whatsappTo ? `<p><strong>WhatsApp:</strong> ${escapeHtml(invoice.whatsappTo)}</p>` : ""}
      ${invoice.whatsappMessage ? `<p><strong>Mensagem:</strong> ${escapeHtml(invoice.whatsappMessage)}</p>` : ""}
      <p><strong>Descricao:</strong> ${escapeHtml(invoice.description || "Sem descricao.")}</p>
    </div>
    ${renderInvoiceBooklet(invoice)}
    <div class="profile-actions">
      <button class="submit-button" type="button" data-download-invoice="${invoice.id}">Baixar fatura individual</button>
      ${invoiceBookletItems(invoice).length > 1 ? `<button class="secondary-button" type="button" data-download-invoice-booklet="${invoice.id}">Baixar carne completo</button>` : ""}
      ${canEditEntity("invoice") ? `<button class="secondary-button" type="button" data-pay-invoice="${invoice.id}" ${status === "Inativa" || status === "Aguardando" ? "disabled" : ""}>${status === "Inativa" ? "Finalizada" : status === "Aguardando" ? "Aguardando liberacao" : "Registrar pagamento"}</button>` : ""}
      ${canDeleteEntity("invoice") ? '<button class="danger-button" type="button" data-delete-entity="invoice">Excluir fatura</button>' : ""}
    </div>
  `;
}

function renderInvoiceBooklet(invoice) {
  const booklet = invoiceBookletItems(invoice);
  if (!["Locacao", "Compra"].includes(invoice.category) || booklet.length <= 1) return "";
  return `
    <section class="invoice-booklet">
      <div class="invoice-title-line">
        <strong>Carne de ${invoice.category === "Compra" ? "venda" : "locacao"}</strong>
        <span>${booklet.length} parcelas</span>
        <button class="secondary-button" type="button" data-download-invoice-booklet="${invoice.id}">Baixar carne completo</button>
      </div>
      <div class="invoice-booklet-list">
        ${booklet
          .map((item) => {
            const status = invoiceComputedStatus(item);
            const isCurrent = item.id === invoice.id;
            return `
              <article class="booklet-row ${isCurrent ? "current" : ""}" data-profile-type="invoice" data-profile-id="${item.id}">
                <div>
                  <strong>${escapeHtml(invoiceInstallmentDisplay(item).replace(/^./, (letter) => letter.toUpperCase()))}</strong>
                  <small>${escapeHtml(item.reference || "")} &middot; vence ${escapeHtml(formatDate(item.dueDate) || item.dueDate || "sem data")}</small>
                </div>
                <span class="invoice-status ${normalize(status)}">${escapeHtml(status)}</span>
                <button class="contract-card-download" type="button" data-download-invoice="${item.id}" title="Baixar fatura" aria-label="Baixar fatura">↓</button>
              </article>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderContractProfile(contract) {
  const property = findProperty(contract.propertyId);
  const client = findClient(contract.clientId);
  const owner = property ? propertyOwner(property) : null;
  const status = contractComputedStatus(contract);
  const days = contractDaysToDue(contract);
  const dueDate = contractDueDate(contract);
  const guarantor = contract.guarantor || {};
  const guarantorDocs = Array.isArray(guarantor.documents) ? guarantor.documents : [];
  const canRenew = !contract.signed && !contract.rescinded && contract.type === "Locacao" && contractComputedStatus(contract) !== "Inativo" && days !== null && days >= 7;

  return `
    <div class="profile-grid contract-profile-grid">
      ${renderContractPdfPreview(contract)}
      <div class="detail-list">
        <p><strong>Imovel:</strong> ${escapeHtml(property?.title || "Imovel removido")}</p>
        <p><strong>Cliente:</strong> ${escapeHtml(client?.name || "Cliente removido")}</p>
        <p><strong>Proprietario:</strong> ${escapeHtml(owner?.name || "Nao informado")}</p>
        <p><strong>Data de emissao:</strong> ${escapeHtml(formatDate(contract.issuedAt || contract.createdAt) || "Nao informado")}</p>
        <p><strong>Status individual:</strong> ${escapeHtml(contract.rescinded ? "Rescindido" : status)}</p>
        <p><strong>Assinatura:</strong> ${contract.signed ? `Contrato assinado em ${escapeHtml(formatDate(contract.signedAt))}` : "Pendente"}</p>
        ${contract.rescinded ? `<p><strong>Rescisao:</strong> ${escapeHtml(formatDate(contract.rescindedAt))} - ${escapeHtml(contract.rescissionReason || "Sem motivo informado")}</p>` : ""}
        ${
          contract.type === "Locacao"
            ? `
              <p><strong>Prazo:</strong> ${escapeHtml(contract.termMonths || "nao informado")} meses</p>
              <p><strong>Valor mensal:</strong> ${formatter.format(Number(contract.monthlyValue || contract.amount || 0))}</p>
              ${Number(contract.securityDeposit || 0) > 0 ? `<p><strong>Caucao:</strong> ${formatter.format(Number(contract.securityDeposit || 0))}</p>` : ""}
              <p><strong>Vencimento calculado:</strong> ${escapeHtml(dueDate || "Nao informado")}${days !== null && days >= 0 ? ` - ${days === 0 ? "vence hoje" : `faltam ${days} dia${days > 1 ? "s" : ""}`}` : ""}</p>
            `
            : contract.type === "Avulso"
              ? `
                <p><strong>Categoria:</strong> ${escapeHtml(contract.seasonCategory || "Temporada")}</p>
                <p><strong>Valor avulso:</strong> ${formatter.format(Number(contract.oneOffValue || contract.amount || 0))}</p>
                <p><strong>Entrada:</strong> ${escapeHtml(formatDate(contract.seasonStart) || contract.seasonStart || "Nao informado")}</p>
                <p><strong>Saida:</strong> ${escapeHtml(formatDate(contract.seasonEnd) || contract.seasonEnd || "Nao informado")}</p>
              `
            : `
              <p><strong>Valor total:</strong> ${formatter.format(Number(contract.negotiatedValue || contract.amount || 0))}</p>
              <p><strong>Valor da entrada:</strong> ${formatter.format(Number(contract.downPayment || 0))}</p>
            `
        }
        <p><strong>Observacoes:</strong> ${escapeHtml(contract.notes || "Sem observacoes.")}</p>
      </div>
    </div>
    ${
      contract.type === "Locacao" && contract.hasGuarantor === "Sim"
        ? `
          <section class="documents-panel">
            <h3>Fiador</h3>
            <div class="detail-list">
              <p><strong>Nome:</strong> ${escapeHtml(guarantor.name || "Nao informado")}</p>
              <p><strong>CPF:</strong> ${escapeHtml(guarantor.cpf || "Nao informado")}</p>
              <p><strong>${escapeHtml(guarantor.contact1Name || "Contato 1")}:</strong> ${escapeHtml(guarantor.contact1 || "Nao informado")}</p>
              ${guarantor.contact2 ? `<p><strong>${escapeHtml(guarantor.contact2Name || "Contato 2")}:</strong> ${escapeHtml(guarantor.contact2)}</p>` : ""}
              <p><strong>Renda mensal:</strong> ${formatter.format(Number(guarantor.income || 0))}</p>
              ${guarantor.address ? `<p><strong>Endereco:</strong> ${escapeHtml(guarantor.address)}</p>` : ""}
              ${guarantor.notes ? `<p><strong>Observacoes:</strong> ${escapeHtml(guarantor.notes)}</p>` : ""}
            </div>
            <h3>Documentos do fiador</h3>
            ${renderReadOnlyDocumentList(guarantorDocs)}
          </section>
        `
        : ""
    }
    <div class="modal-actions">
      ${canEditEntity("contract") ? `<button class="${contract.signed ? "secondary-button" : "submit-button"}" type="button" ${contract.signed ? "disabled" : `data-sign-contract="${contract.id}"`}>${contract.signed ? "Contrato assinado" : "Assinar contrato"}</button>` : ""}
      ${canEditEntity("contract") && canRenew ? `<button class="secondary-button" type="button" data-renew-contract="${contract.id}">Renovar contrato</button>` : ""}
      ${canDeleteEntity("contract") && !contract.rescinded ? (contract.signed ? `<button class="danger-button" type="button" data-rescind-contract="${contract.id}">Rescindir contrato</button>` : `<button class="danger-button" type="button" data-delete-entity="contract">Excluir contrato</button>`) : ""}
    </div>
  `;
}

function renderContractPdfPreview(contract) {
  const data = contractTextBlocks(contract);
  const previewParagraphs = data.paragraphs.slice(0, 4);
  return `
    <div class="contract-pdf-preview" role="button" tabindex="0" data-open-contract-document="${contract.id}" aria-label="Abrir visualizacao do contrato">
      <button class="pdf-download-icon" type="button" data-download-contract="${contract.id}" title="Baixar contrato" aria-label="Baixar contrato">↓</button>
      <div class="pdf-preview-header">
        ${state.company.logo ? `<img src="${state.company.logo}" alt="">` : ""}
        <div>
          <strong>${escapeHtml(state.company.name || "Regis Imobiliaria")}</strong>
          <small>${escapeHtml([state.company.legalName, state.company.cnpj ? `CNPJ ${state.company.cnpj}` : "", state.company.creci ? `CRECI ${state.company.creci}` : ""].filter(Boolean).join(" | "))}</small>
        </div>
      </div>
      <h3>${escapeHtml(data.title)}</h3>
      ${contract.signedDocument?.data ? `<p><strong>Contrato assinado anexado:</strong> ${escapeHtml(contract.signedDocument.label || contract.signedDocument.name || "arquivo assinado")}</p>` : ""}
      ${previewParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      ${renderContractSignaturePreview(contract)}
    </div>
  `;
}

function renderContractSignaturePreview(contract) {
  const signatures = Array.isArray(contract.signatures) ? contract.signatures.filter((signature) => signature.signature) : [];
  if (!signatures.length) return "";
  return `
    <section class="contract-signature-preview">
      ${signatures
        .map(
          (signature) => `
            <article>
              <img src="${escapeHtml(signature.signature)}" alt="Assinatura de ${escapeHtml(signature.name)}">
              <span>${escapeHtml(signature.name)}</span>
              <small>${escapeHtml(signature.role)}</small>
            </article>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderContractDocumentViewer(contractId) {
  const contract = findContract(contractId);
  if (!contract) return;
  document.querySelector("#profile-kind").textContent = "Contrato";
  document.querySelector("#profile-title").textContent = "Visualizacao do contrato";
  document.querySelector("#profile-content").innerHTML = `
    <section class="contract-document-viewer">
      <div class="contract-viewer-actions">
        ${contract.signed ? "" : `<button class="secondary-button" type="button" data-contract-model-editor="${contract.id}">Editar</button>`}
        <button class="submit-button" type="button" data-download-contract="${contract.id}">Baixar contrato</button>
        <button class="secondary-button" type="button" data-back-contract-profile="${contract.id}">Voltar</button>
      </div>
      ${renderContractPdfPreview(contract).replace('class="contract-pdf-preview"', 'class="contract-pdf-preview full-document-preview"').replace(/<button class="pdf-download-icon"[\s\S]*?<\/button>/, "")}
    </section>
  `;
}

function renderContractModelEditor(contractId) {
  const contract = findContract(contractId);
  if (!contract) return;
  const defaultTemplates = state.company.contractTemplates || defaultContractTemplates();
  const templateKey = contractTemplateKey(contract);
  const baseTemplate = contract.template || defaultTemplates[templateKey];
  const modelName = contract.type === "Locacao" ? "locacao" : contract.type === "Avulso" ? "avulso" : "venda";
  document.querySelector("#profile-kind").textContent = "Editar";
  document.querySelector("#profile-title").textContent = `Modelo de ${modelName}`;
  document.querySelector("#profile-content").innerHTML = `
    <form class="settings-panel contract-template-editor" data-contract-model-form="${contract.id}">
      <p>Este modelo sera aplicado somente a este contrato. Outros contratos continuam com seus proprios textos.</p>
      <div class="template-toolbar">
        <button class="secondary-button" type="button" data-template-insert="CLAUSULA 00 - TITULO DA CLAUSULA\nTexto da clausula." onclick="insertTemplateText(this.dataset.templateInsert)">Clausula</button>
        <button class="secondary-button" type="button" data-template-insert="\n\n________________________________________\n{{proprietario_nome}}\n\n________________________________________\n{{cliente_nome}}\n\n________________________________________\n{{empresa_nome}}" onclick="insertTemplateText(this.dataset.templateInsert)">Assinaturas</button>
        <button class="secondary-button" type="button" data-template-insert="\n\n" onclick="insertTemplateText(this.dataset.templateInsert)">Quebra</button>
      </div>
      <div class="placeholder-grid">
        ${contractPlaceholders
          .map(([key, label]) => `<button class="placeholder-chip" type="button" data-template-insert="{{${key}}}" onclick="insertTemplateText(this.dataset.templateInsert)">${escapeHtml(label)}</button>`)
          .join("")}
      </div>
      <section class="template-box">
        <h3>Modelo deste contrato de ${escapeHtml(modelName)}</h3>
        <label>Titulo principal<input name="title" value="${escapeHtml(baseTemplate.title)}" /></label>
        <label class="full">Texto do contrato<textarea name="body" rows="18" data-template-body="contract">${escapeHtml(baseTemplate.body)}</textarea></label>
      </section>
      <div class="modal-actions">
        <button class="submit-button" type="submit">Salvar modelo deste contrato</button>
        <button class="secondary-button" type="button" data-open-contract-document="${contract.id}">Cancelar</button>
      </div>
    </form>
  `;
}

function renderContractSignatureForm(contractId) {
  const contract = findContract(contractId);
  if (!contract || contract.signed || contract.rescinded) return;
  state.activeProfile = { type: "contract", id: contract.id };
  document.querySelector("#profile-modal").hidden = false;
  document.querySelector("#profile-kind").textContent = "Assinatura";
  document.querySelector("#profile-title").textContent = "Assinar contrato";
  document.querySelector("#profile-content").innerHTML = `
    <form class="settings-panel signature-form" data-sign-contract-form="${contract.id}">
      <p>Anexe o contrato ja assinado para finalizar este contrato no sistema. O arquivo enviado ficara disponivel para download no perfil do contrato.</p>
      <div class="section-title full">
        <p class="eyebrow">Upload</p>
        <h3>Contrato assinado</h3>
      </div>
      <label class="upload-tile full">
        <input name="signedDocument" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" data-signed-document-upload required />
        <span class="upload-icon">+</span>
        <strong>Adicionar contrato assinado</strong>
        <small>Envie PDF, DOC, DOCX, JPG ou PNG de ate 2 MB.</small>
      </label>
      <div class="file-preview signed-document-preview full" id="signed-document-preview"></div>
      <div class="modal-actions">
        <button class="submit-button" type="submit">Salvar contrato assinado</button>
        <button class="secondary-button" type="button" data-back-contract-profile="${contract.id}">Cancelar</button>
      </div>
    </form>
  `;
}

function renderRescindContractForm(contractId) {
  const contract = findContract(contractId);
  if (!contract || !contract.signed || contract.rescinded) return;
  const parties = contractSignatureParties(contract);
  document.querySelector("#profile-kind").textContent = "Distrato";
  document.querySelector("#profile-title").textContent = "Rescindir contrato";
  document.querySelector("#profile-content").innerHTML = `
    <form class="settings-panel signature-form" data-rescind-contract-form="${contract.id}">
      <p>Preencha o motivo e as assinaturas eletronicas dos envolvidos. A rescisao mantem o contrato salvo, mas deixa seu status como inativo.</p>
      <label class="full">Motivo da rescisao<textarea name="rescissionReason" rows="4" required>${escapeHtml(contract.rescissionReason || "")}</textarea></label>
      <div class="contract-viewer-actions">
        <button class="secondary-button" type="button" data-rescission-model-editor="${contract.id}">Editar modelo do distrato</button>
        <button class="secondary-button" type="button" data-download-rescission-draft="${contract.id}">Baixar distrato</button>
      </div>
      <div class="signature-grid">
        ${parties
          .map(
            (party, index) => `
              <label>
                ${escapeHtml(party.role)} - ${escapeHtml(party.name)}
                <input name="signature_${index}" required placeholder="Digite a assinatura eletronica do distrato">
              </label>
              <input type="hidden" name="role_${index}" value="${escapeHtml(party.role)}">
              <input type="hidden" name="name_${index}" value="${escapeHtml(party.name)}">
              <input type="hidden" name="key_${index}" value="${escapeHtml(party.key)}">
            `,
          )
          .join("")}
      </div>
      <input type="hidden" name="signatureCount" value="${parties.length}">
      <div class="modal-actions">
        <button class="danger-button" type="submit">Salvar rescisao</button>
        <button class="secondary-button" type="button" data-back-contract-profile="${contract.id}">Cancelar</button>
      </div>
    </form>
  `;
}

function renderRescissionModelEditor(contractId) {
  const contract = findContract(contractId);
  if (!contract || contract.rescinded) return;
  const template = contract.rescissionTemplate || defaultRescissionTemplate();
  document.querySelector("#profile-kind").textContent = "Distrato";
  document.querySelector("#profile-title").textContent = "Editar modelo do distrato";
  document.querySelector("#profile-content").innerHTML = `
    <form class="settings-panel contract-template-editor" data-rescission-model-form="${contract.id}">
      <p>Este modelo de distrato sera aplicado somente a este contrato.</p>
      <div class="template-toolbar">
        <button class="secondary-button" type="button" data-template-insert="CLAUSULA 00 - TITULO DA CLAUSULA\nTexto da clausula." onclick="insertTemplateText(this.dataset.templateInsert)">Clausula</button>
        <button class="secondary-button" type="button" data-template-insert="\n\n________________________________________\n{{proprietario_nome}}\n\n________________________________________\n{{cliente_nome}}\n\n________________________________________\n{{empresa_nome}}" onclick="insertTemplateText(this.dataset.templateInsert)">Assinaturas</button>
        <button class="secondary-button" type="button" data-template-insert="\n\n" onclick="insertTemplateText(this.dataset.templateInsert)">Quebra</button>
      </div>
      <div class="placeholder-grid">
        ${contractPlaceholders
          .map(([key, label]) => `<button class="placeholder-chip" type="button" data-template-insert="{{${key}}}" onclick="insertTemplateText(this.dataset.templateInsert)">${escapeHtml(label)}</button>`)
          .join("")}
      </div>
      <section class="template-box">
        <h3>Modelo de distrato contratual</h3>
        <label>Titulo principal<input name="title" value="${escapeHtml(template.title)}" /></label>
        <label class="full">Texto do distrato<textarea name="body" rows="18" data-template-body="rescission">${escapeHtml(template.body)}</textarea></label>
      </section>
      <div class="modal-actions">
        <button class="submit-button" type="submit">Salvar modelo do distrato</button>
        <button class="secondary-button" type="button" data-rescind-contract="${contract.id}">Voltar</button>
      </div>
    </form>
  `;
}

function renderReadOnlyDocumentList(documents) {
  return `
    <div class="document-list">
      ${
        documents.length
          ? documents
              .map(
                (doc) => `
                  <article class="document-edit-item ${doc.data ? "" : "muted-document"}">
                    <div>
                      <strong>${escapeHtml(doc.label || doc.name)}</strong>
                      <small>${doc.oversized ? "Arquivo grande removido" : `${Math.max(1, Math.round((doc.size || 0) / 1024))} KB`}</small>
                    </div>
                    ${doc.data ? `<a class="secondary-button" href="${doc.data}" target="_blank" rel="noopener">Abrir</a>` : ""}
                  </article>
                `,
              )
              .join("")
          : '<p class="empty-inline">Nenhum documento cadastrado.</p>'
      }
    </div>
  `;
}

function renderSummaryTab(type, entity) {
  const isProperty = type === "property";
  const isOwner = type === "owner";
  const owner = isProperty ? propertyOwner(entity) : null;
  const propertyDetails = isProperty ? renderPropertyDetails(entity, owner) : "";
  return `
    <div class="profile-grid">
      ${isProperty ? renderPropertyCarousel(entity) : renderClientProfilePhoto(entity)}
      <div class="detail-list">
        ${
          isProperty
            ? `
              ${
                owner.photo
                  ? `<div class="owner-summary"><span class="avatar"><img src="${getPhotoSrc(owner.photo)}" alt="" style="${cropStyle(owner.crop)}"></span><strong>${escapeHtml(owner.name || "Proprietario")}</strong></div>`
                  : ""
              }
              <div class="status-line">
                <p class="featured-purpose"><strong>Finalidade:</strong> ${escapeHtml(entity.purpose)}</p>
                <label class="switch-field ${canEditEntity("property") ? "" : "is-disabled"}">
                  <input type="checkbox" ${entity.available ? "checked" : ""} ${canEditEntity("property") ? "" : "disabled"} data-availability-toggle>
                  <span></span>
                  ${entity.available ? "Disponivel" : "Indisponivel"}
                </label>
                <button class="featured-toggle ${entity.featured ? "active" : ""}" type="button" ${canEditEntity("property") ? "" : "disabled"} data-featured-toggle aria-pressed="${entity.featured ? "true" : "false"}" title="Marcar imovel como destaque">
                  <span aria-hidden="true">${entity.featured ? "★" : "☆"}</span>
                  Destaque na Home
                </button>
              </div>
              ${propertyDetails}
              ${renderPropertyMap(entity)}
            `
            : `
              <p><strong>CPF:</strong> ${escapeHtml(entity.cpf || "Nao informado")}</p>
              <p><strong>${escapeHtml(entity.contact1Name || "Contato 1")}:</strong> ${escapeHtml(entity.contact1 || "Nao informado")}</p>
              ${entity.contact2 ? `<p><strong>${escapeHtml(entity.contact2Name || "Contato 2")}:</strong> ${escapeHtml(entity.contact2)}</p>` : ""}
              ${entity.address ? `<p><strong>Endereco:</strong> ${escapeHtml(entity.address)}</p>` : ""}
              ${isOwner ? `<p><strong>Imoveis:</strong> ${ownerProperties(entity.id).length}</p>` : ""}
            `
        }
        <p><strong>Observacoes:</strong> ${escapeHtml(entity.notes || "Sem observacoes.")}</p>
      </div>
    </div>
    <div class="modal-actions">
      ${canEditEntity(type) ? '<button class="submit-button" type="button" data-edit-profile>Editar perfil</button>' : ""}
      ${canDeleteEntity(type) ? `<button class="danger-button" type="button" data-delete-entity="${type}">Excluir ${isProperty ? "imovel" : isOwner ? "proprietario" : "cliente"}</button>` : ""}
    </div>
  `;
}

function hasPositiveNumber(value) {
  return Number(value || 0) > 0;
}

function renderPropertyDetails(entity, owner) {
  const details = [
    `<p><strong>Proprietario:</strong> ${escapeHtml(owner.name || "Nao informado")}</p>`,
    `<p><strong>CPF do proprietario:</strong> ${escapeHtml(owner.cpf || "Nao informado")}</p>`,
    `<p><strong>${escapeHtml(owner.contact1Name || "Contato 1")}:</strong> ${escapeHtml(owner.contact1 || "Nao informado")}</p>`,
    owner.contact2 ? `<p><strong>${escapeHtml(owner.contact2Name || "Contato 2")}:</strong> ${escapeHtml(owner.contact2)}</p>` : "",
    owner.address ? `<p><strong>Endereco do proprietario:</strong> ${escapeHtml(owner.address)}</p>` : "",
    entity.type ? `<p><strong>Tipo:</strong> ${escapeHtml(entity.type)}</p>` : "",
    entity.subtype ? `<p><strong>Especificacao:</strong> ${escapeHtml(entity.subtype)}</p>` : "",
    hasPositiveNumber(propertyNetValue(entity)) ? `<p><strong>Valor liquido:</strong> ${formatter.format(propertyNetValue(entity))}</p>` : "",
    hasPositiveNumber(propertyGrossValue(entity)) ? `<p><strong>Valor bruto:</strong> ${formatter.format(propertyGrossValue(entity))}</p>` : "",
    propertyProfitValue(entity) ? `<p><strong>Lucro previsto:</strong> ${formatter.format(propertyProfitValue(entity))} (${propertyProfitPercent(entity).toFixed(1)}%)</p>` : "",
    hasPositiveNumber(entity.iptu) ? `<p><strong>IPTU:</strong> ${formatter.format(Number(entity.iptu || 0))}</p>` : "",
    propertyLocation(entity) ? `<p><strong>Localizacao:</strong> ${escapeHtml(propertyLocation(entity))}</p>` : "",
    hasPositiveNumber(entity.rooms) ? `<p><strong>Quartos:</strong> ${escapeHtml(entity.rooms)}</p>` : "",
    hasPositiveNumber(entity.area) ? `<p><strong>Area:</strong> ${escapeHtml(entity.area)} m2</p>` : "",
    entity.leisureArea === "Sim" ? "<p><strong>Area de lazer:</strong> Sim</p>" : "",
    entity.pool === "Sim" ? "<p><strong>Piscina:</strong> Sim</p>" : "",
    entity.garage === "Sim" && hasPositiveNumber(entity.garageSpaces)
      ? `<p><strong>Garagem:</strong> ${escapeHtml(entity.garageSpaces)} vaga(s)</p>`
      : "",
  ];

  return details.filter(Boolean).join("");
}

function renderPropertyMap(property) {
  const location = propertyLocation(property);
  if (!location) return "";
  return `
    <div class="property-map-preview">
      <iframe title="Localizacao do imovel no Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${escapeHtml(propertyGoogleMapsEmbed(property))}"></iframe>
      <a class="secondary-button" href="${escapeHtml(propertyGoogleMapsLink(property))}" target="_blank" rel="noopener">Abrir no Google Maps</a>
    </div>
  `;
}

function renderPropertyCarousel(property) {
  const photos = property.photos || [];
  const safeIndex = Math.min(state.carouselIndex, Math.max(photos.length - 1, 0));
  const photo = photos[safeIndex];
  const src = getPhotoSrc(photo);

  return `
    <div class="profile-carousel">
      ${
        src
          ? `<img src="${src}" alt="${escapeHtml(photo.label || "Foto do imovel")}">
             <span class="photo-count">${escapeHtml(photo.label || (safeIndex === 0 ? "Principal" : `Foto ${safeIndex + 1}`))}</span>`
          : '<div class="empty-cover">Sem foto</div>'
      }
      ${
        photos.length > 1
          ? `<div class="carousel-controls">
              <button type="button" data-carousel="prev" aria-label="Foto anterior">&lt;</button>
              <button type="button" data-carousel="next" aria-label="Proxima foto">&gt;</button>
            </div>
            <div class="carousel-dots">${photos.map((_, index) => `<button type="button" class="${index === safeIndex ? "active" : ""}" data-carousel-dot="${index}" aria-label="Foto ${index + 1}"></button>`).join("")}</div>`
          : ""
      }
    </div>
  `;
}

function renderPropertyPhotoEditor(property) {
  return renderPhotoManager("property", property, "Fotos do imovel");
}

function renderClientPhotoEditor(client) {
  return renderPhotoManager("client", client, "Fotos do cliente");
}

function renderPhotoManager(type, entity, title) {
  const photos = Array.isArray(entity.photos) ? entity.photos : [];
  return `
    <section class="photo-manager full" aria-label="${title}">
      <div class="photo-manager-head">
        <div>
          <strong>${title}</strong>
          <small>Arraste para reorganizar. A primeira foto vira capa.</small>
        </div>
        ${
          canEditEntity(type)
            ? `<label class="mini-upload">
                Adicionar fotos
                <input type="file" accept="image/*" multiple data-edit-photo-upload="${type}" />
              </label>`
            : ""
        }
      </div>
      <div class="photo-manager-strip" data-photo-sort-list>
        ${
          photos.length
            ? photos
                .map(
                  (photo, index) => `
                    <article class="photo-edit-card" draggable="true" data-photo-index="${index}">
                      <div class="photo-edit-thumb">
                        <img src="${getPhotoSrc(photo)}" alt="${escapeHtml(photo.label || `Foto ${index + 1}`)}">
                        <span>${index === 0 ? "Principal" : `Foto ${index + 1}`}</span>
                      </div>
                      ${
                        canEditEntity(type)
                          ? `<input type="text" value="${escapeHtml(photo.label || photo.name || `Foto ${index + 1}`)}" data-edit-photo-label="${index}" placeholder="Quarto, cozinha, sala">`
                          : `<strong>${escapeHtml(photo.label || photo.name || `Foto ${index + 1}`)}</strong>`
                      }
                      <div class="photo-card-actions">
                        ${canEditEntity(type) ? `<button class="secondary-button" type="button" data-remove-photo="${index}">Excluir</button>` : ""}
                      </div>
                    </article>
                  `,
                )
                .join("")
            : '<p class="empty-inline">Nenhuma foto cadastrada.</p>'
        }
      </div>
    </section>
  `;
}

function renderClientProfilePhoto(client) {
  const photo = getPhotoSrc(entityPhoto(client));
  const initial = escapeHtml((client.name || "C").charAt(0));

  return `
    <div class="profile-cover profile-photo-crop large">
      ${photo ? `<img src="${photo}" alt="" style="${cropStyle(client.crop)}">` : `<div class="empty-cover">${initial}</div>`}
    </div>
  `;
}

function renderDocumentsTab(type, entity, documents) {
  const owner = type === "property" ? propertyOwner(entity) : null;
  const documentTitle = type === "property" ? "Documentos do imovel" : type === "owner" ? "Documentos do proprietario" : "Documentos do cliente";
  return `
    <div class="documents-panel">
      ${
        canEditEntity(type)
          ? `<label class="mini-upload">
              Adicionar documentos
              <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple data-document-upload />
            </label>`
          : ""
      }
      <h3>${documentTitle}</h3>
      ${renderDocumentList(documents, type)}
      ${
        type === "property"
          ? `<h3>Documentos do proprietario</h3>${renderDocumentList(owner.documents || [], "owner", owner.id)}`
          : ""
      }
    </div>
  `;
}

function renderDocumentList(documents, type, entityId = "") {
  return `
    <div class="document-list">
      ${
        documents.length
          ? documents
              .map(
                (doc, index) => `
                  <article class="document-edit-item ${doc.data ? "" : "muted-document"}">
                    <div>
                      ${
                        canEditEntity(type)
                          ? `<input type="text" value="${escapeHtml(doc.label || doc.name)}" data-document-label="${index}" data-document-type="${type}" data-document-entity="${entityId}">`
                          : `<strong>${escapeHtml(doc.label || doc.name)}</strong>`
                      }
                      <small>${doc.oversized ? "Arquivo grande removido" : `${Math.max(1, Math.round((doc.size || 0) / 1024))} KB`}</small>
                    </div>
                    <div class="document-actions">
                      ${doc.data ? `<a class="secondary-button" href="${doc.data}" target="_blank" rel="noopener">Abrir</a>` : ""}
                      ${canEditEntity(type) ? `<button class="danger-button" type="button" data-remove-document="${index}" data-document-type="${type}" data-document-entity="${entityId}">Excluir</button>` : ""}
                    </div>
                  </article>
                `,
              )
              .join("")
          : '<p class="empty-inline">Nenhum documento cadastrado.</p>'
      }
    </div>
  `;
}

function renderContractItem(contract) {
  const client = findClient(contract.clientId);
  const property = findProperty(contract.propertyId);
  const status = contractComputedStatus(contract);
  const amount = contractAmount(contract);
  const statusClass = normalize(status).replaceAll(" ", "-");
  return `
    <article class="contract-item clickable-card ${statusClass}" tabindex="0" data-profile-type="contract" data-profile-id="${contract.id}">
      <button class="contract-card-download" type="button" data-download-contract="${contract.id}" title="Baixar contrato" aria-label="Baixar contrato">↓</button>
      <div>
        <div class="invoice-title-line">
          <strong>Contrato de ${escapeHtml(contractTypeLabel(contract))}</strong>
          <span class="invoice-status ${statusClass}">${escapeHtml(contract.rescinded ? "Rescindido" : status)}</span>
        </div>
        <p>${escapeHtml(property?.title || "Imovel removido")} &middot; ${escapeHtml(client?.name || "Cliente removido")} &middot; ${formatter.format(amount)}</p>
        <p>${contract.rescinded ? "Contrato rescindido" : "Resumo do contrato"}</p>
      </div>
      <div class="contract-card-actions">
        ${canEditEntity("contract") ? `<button class="${contract.signed ? "secondary-button" : "submit-button"}" type="button" ${contract.signed ? "disabled" : `data-sign-contract="${contract.id}"`}>${contract.signed ? "Contrato assinado" : "Assinar contrato"}</button>` : ""}
      </div>
    </article>
  `;
}

const settingsTools = {
  company: {
    title: "Perfil da empresa",
    description: "Dados principais usados em documentos, contratos e atendimento.",
  },
  trash: {
    title: "Lixeira",
    description: "Itens excluidos ficam disponiveis por 30 dias ou ate esvaziar manualmente.",
  },
  users: { title: "Usuarios", description: "Controle simples da equipe e niveis de acesso." },
  whatsapp: { title: "WhatsApp", description: "Configure atendimento, mensagem padrao e dados para conexao com WhatsApp Cloud API." },
  notifications: { title: "Notificacoes", description: "Alertas de vencimento, tarefas e retorno comercial." },
  backup: { title: "Backup", description: "Exportacao local completa dos dados salvos no navegador." },
  appearance: { title: "Aparencia", description: "Identidade visual baseada na marca Regis Imobiliaria." },
  reports: { title: "Relatorios", description: "Indicadores basicos da carteira e dos contratos." },
  help: { title: "Ajuda", description: "Resumo operacional do sistema." },
};

function openSettingsTool(tool) {
  if (!canUseSettingsTool(tool)) {
    showToast("Seu usuario nao tem permissao para esta configuracao.");
    return;
  }
  const config = settingsTools[tool] || settingsTools.help;
  state.activeProfile = null;
  document.querySelector("#profile-modal").hidden = false;
  document.querySelector("#profile-kind").textContent = "Configuracao";
  document.querySelector("#profile-title").textContent = config.title;
  document.querySelector("#profile-content").innerHTML = renderSettingsTool(tool, config);
  if (tool === "users") renderTeam();
}

function renderSettingsTool(tool, config) {
  if (tool === "company") return renderCompanySettings();
  if (tool === "appearance") return renderAppearanceSettings();
  if (tool === "trash") return renderTrashSettings();
  if (tool === "users") return renderUsersSettings();
  if (tool === "whatsapp") return renderWhatsAppSettings();
  if (tool === "backup") return renderBackupSettings(config);
  if (tool === "reports") return renderReportsSettings(config);
  if (tool === "help") return renderHelpSettings();

  return `
    <section class="settings-panel">
      <p>${escapeHtml(config.description)}</p>
      <div class="settings-options">
        <label>Ativar modulo<select><option>Ativo</option><option>Pausado</option></select></label>
        <label>Responsavel<input value="Equipe Regis" /></label>
        <label class="full">Observacoes<textarea rows="4">Modulo preparado para configuracao futura.</textarea></label>
      </div>
      <div class="modal-actions">
        <button class="submit-button" type="button" data-save-settings>Salvar configuracao</button>
      </div>
    </section>
  `;
}

function renderIntegrationsSettings() {
  const integrations = state.company.integrations || ensureCompany().integrations;
  const maps = integrations.googleMaps || {};
  const cloud = integrations.cloud || {};
  const database = integrations.database || {};
  const whatsapp = state.company.whatsapp || {};
  return `
    <form class="settings-panel integration-panel" data-integrations-form>
      <section class="integration-card">
        <div>
          <p class="eyebrow">Banco de dados</p>
          <h3>Base local e API futura</h3>
          <p>Os dados estao espelhados em IndexedDB local. Para nuvem, informe o endpoint da API quando o backend estiver criado.</p>
        </div>
        <label>Modo<select name="databaseMode">
          <option value="indexeddb" ${database.mode === "indexeddb" ? "selected" : ""}>IndexedDB local</option>
          <option value="api" ${database.mode === "api" ? "selected" : ""}>API/backend externo</option>
        </select></label>
        <label>Endpoint da API<input name="databaseEndpoint" value="${escapeHtml(database.endpoint || "")}" placeholder="https://api.suaimobiliaria.com" /></label>
        <label>Projeto/ambiente<input name="databaseProjectId" value="${escapeHtml(database.projectId || "")}" placeholder="producao-regis" /></label>
        <p class="empty-inline full">Status: ${escapeHtml(database.status || "Banco local ativo")}</p>
      </section>

      <section class="integration-card">
        <div>
          <p class="eyebrow">Nuvem e arquivos</p>
          <h3>Fotos, documentos e contratos</h3>
          <p>Este bloco prepara Supabase, S3, Cloudflare R2 ou outro storage. O banco guarda o link, e os arquivos ficam no bucket.</p>
        </div>
        <label>Provedor<input name="cloudProvider" value="${escapeHtml(cloud.provider || "")}" placeholder="Supabase Storage, S3, R2" /></label>
        <label>Endpoint storage<input name="cloudEndpoint" value="${escapeHtml(cloud.endpoint || "")}" placeholder="https://..." /></label>
        <label>Bucket<input name="cloudBucket" value="${escapeHtml(cloud.bucket || "")}" placeholder="regis-arquivos" /></label>
        <label>URL publica/base<input name="cloudPublicBaseUrl" value="${escapeHtml(cloud.publicBaseUrl || "")}" placeholder="https://cdn.suaimobiliaria.com" /></label>
        <p class="empty-inline full">Status: ${escapeHtml(cloud.status || "Aguardando credenciais")}</p>
      </section>

      <section class="integration-card">
        <div>
          <p class="eyebrow">Google Maps</p>
          <h3>Places, Geocoding e mapa publico</h3>
          <p>Com a chave ativa, o cadastro podera sugerir endereco, salvar latitude/longitude, cidade, bairro e link do Maps.</p>
        </div>
        <label>Ativar Maps<select name="mapsEnabled">
          <option value="Nao" ${maps.enabled !== "Sim" ? "selected" : ""}>Nao</option>
          <option value="Sim" ${maps.enabled === "Sim" ? "selected" : ""}>Sim</option>
        </select></label>
        <label>Google Maps API key<input name="mapsApiKey" value="${escapeHtml(maps.apiKey || "")}" placeholder="AIza..." /></label>
        <label>Autocomplete<select name="mapsAutocomplete">
          <option value="Sim" ${maps.autocomplete !== "Nao" ? "selected" : ""}>Sim</option>
          <option value="Nao" ${maps.autocomplete === "Nao" ? "selected" : ""}>Nao</option>
        </select></label>
        <label>Visibilidade no site<select name="mapsVisibility">
          <option value="Aproximada" ${maps.mapVisibility !== "Exata" ? "selected" : ""}>Aproximada</option>
          <option value="Exata" ${maps.mapVisibility === "Exata" ? "selected" : ""}>Exata</option>
        </select></label>
        <p class="empty-inline full">Status: ${escapeHtml(maps.status || "Aguardando chave Google Maps")}</p>
      </section>

      <section class="integration-card">
        <div>
          <p class="eyebrow">WhatsApp Cloud API</p>
          <h3>Atendimento e automacoes</h3>
          <p>O botao simples usa wa.me. A automacao real exige backend para proteger token, phone number id e webhooks.</p>
        </div>
        <label>Cloud API<select name="whatsappCloudApiEnabled">
          <option value="Nao" ${whatsapp.cloudApiEnabled !== "Sim" ? "selected" : ""}>Nao</option>
          <option value="Sim" ${whatsapp.cloudApiEnabled === "Sim" ? "selected" : ""}>Sim</option>
        </select></label>
        <label>Phone Number ID<input name="whatsappPhoneNumberId" value="${escapeHtml(whatsapp.phoneNumberId || "")}" /></label>
        <label>Business Account ID<input name="whatsappBusinessAccountId" value="${escapeHtml(whatsapp.businessAccountId || "")}" /></label>
        <label>Webhook verify token<input name="whatsappWebhookVerifyToken" value="${escapeHtml(whatsapp.webhookVerifyToken || "")}" /></label>
        <label class="full">Access token<input name="whatsappAccessToken" value="${escapeHtml(whatsapp.accessToken || "")}" placeholder="Guarde no backend em producao" /></label>
      </section>

      <div class="modal-actions">
        <button class="submit-button" type="submit">Salvar integracoes</button>
        <button class="secondary-button" type="button" data-sync-local-db>Sincronizar banco local</button>
      </div>
    </form>
  `;
}

function renderUsersSettings() {
  return `
    <section class="settings-panel">
      <div class="access-guide">
        ${Object.entries(accessDescriptions)
          .map(
            ([level, config]) => `
              <article>
                <strong>${escapeHtml(level)}</strong>
                <p>${escapeHtml(config.summary)}</p>
              </article>
            `,
          )
          .join("")}
      </div>
      <div class="team-layout settings-team-layout">
        <section class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Cadastro</p>
              <h2 id="settings-team-form-title">Novo usuario</h2>
            </div>
          </div>
          <form class="form-grid active" id="settings-team-form">
            <input name="teamId" type="hidden" />
            <label>Nome completo<input name="name" type="text" placeholder="Nome do colaborador" required /></label>
            <label>Funcao operacional<select name="role" required>
              <option value="Gestao">Gestao</option>
              <option value="Corretor">Corretor</option>
              <option value="Atendimento">Atendimento</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Administrativo">Administrativo</option>
            </select></label>
            <label>Email<input name="email" type="email" placeholder="email@empresa.com" /></label>
            <label>Telefone<input name="phone" type="tel" placeholder="(00) 00000-0000" /></label>
            <label>Nivel de acesso<select name="accessLevel" required>
              <option value="Administrador">Administrador</option>
              <option value="Gerente">Gerente</option>
              <option value="Operacional">Operacional</option>
              <option value="Somente visualizacao">Somente visualizacao</option>
            </select></label>
            <label>Status<select name="status" required>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select></label>
            <fieldset class="access-box full">
              <legend>Permissoes liberadas</legend>
              ${permissionList.map((permission) => `<label><input type="checkbox" name="permissions" value="${permission}" /> ${permission}</label>`).join("")}
            </fieldset>
            <div class="permission-guide full">
              <p><strong>Cadastros:</strong> proprietarios, clientes e imoveis.</p>
              <p><strong>Imoveis:</strong> carteira, disponibilidade e fotos.</p>
              <p><strong>Clientes:</strong> consulta e atendimento de clientes.</p>
              <p><strong>Contratos:</strong> emitir, assinar, baixar e rescindir contratos conforme nivel.</p>
              <p><strong>Faturas:</strong> criar cobrancas, registrar pagamentos e baixar faturas.</p>
              <p><strong>Agendamentos:</strong> criar visitas, manutencoes e concluir agenda.</p>
              <p><strong>Relatorios:</strong> painel e indicadores.</p>
              <p><strong>Configuracoes:</strong> empresa, usuarios, backup e integracoes conforme nivel.</p>
            </div>
            <label class="full">Observacoes<textarea name="notes" rows="3" placeholder="Responsabilidades, escala, carteira ou observacoes internas"></textarea></label>
            <div class="modal-actions full">
              <button class="submit-button" type="submit">Salvar usuario</button>
              <button class="secondary-button" type="button" data-team-cancel hidden>Cancelar edicao</button>
            </div>
          </form>
        </section>
        <section class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Acessos</p>
              <h2>Usuarios cadastrados</h2>
            </div>
          </div>
          <div class="team-list" id="settings-team-list"></div>
        </section>
      </div>
    </section>
  `;
}

function renderHelpSettings() {
  return `
    <section class="settings-panel help-panel">
      <div>
        <p class="eyebrow">Introducao</p>
        <h3>Como usar o sistema</h3>
        <p>Organize a imobiliaria em uma rotina simples: cadastre as partes, registre os imoveis, emita contratos, acompanhe faturas e mantenha visitas ou manutencoes na agenda.</p>
      </div>
      <div class="help-grid">
        <article class="help-card">
          <strong>1. Cadastros</strong>
          <p>Comece pelo proprietario, depois cadastre o imovel e por fim o cliente. Fotos e documentos podem ser anexados no cadastro ou no perfil de cada registro.</p>
        </article>
        <article class="help-card">
          <strong>2. Imoveis e clientes</strong>
          <p>Use os perfis para conferir dados completos, documentos, fotos, disponibilidade e historico. Itens excluidos ficam na lixeira por ate 30 dias.</p>
        </article>
        <article class="help-card">
          <strong>3. Contratos</strong>
          <p>Emita contratos de locacao, venda ou avulso, baixe o PDF e anexe o contrato assinado para finalizar. Contratos rescindidos ficam inativos.</p>
        </article>
        <article class="help-card">
          <strong>4. Faturas</strong>
          <p>Cadastre faturas de locacao, venda ou avulsas. Para locacao, selecione o contrato para preencher o mes de referencia e controlar cobrancas recorrentes.</p>
        </article>
        <article class="help-card">
          <strong>5. Agendamentos</strong>
          <p>Registre visitas de clientes, visitas da imobiliaria e manutencoes. Acompanhe ativos, quase vencendo, pendentes e concluidos pelos filtros.</p>
        </article>
        <article class="help-card">
          <strong>6. Configuracoes</strong>
          <p>Atualize perfil da empresa, logo, temas, WhatsApp, backup e lixeira. Essas informacoes aparecem em documentos e PDFs do sistema.</p>
        </article>
      </div>
      <section class="help-flow">
        <strong>Fluxo recomendado</strong>
        <ol>
          <li>Preencha o perfil da empresa antes de emitir contratos e faturas.</li>
          <li>Cadastre proprietarios, imoveis e clientes com documentos completos.</li>
          <li>Use contratos para formalizar venda ou locacao e faturas para controlar cobrancas.</li>
          <li>Use agendamentos para visitas e manutencoes, marcando como concluido ao finalizar.</li>
          <li>Exporte backup periodicamente para preservar os dados salvos no navegador.</li>
        </ol>
      </section>
    </section>
  `;
}

function renderWhatsAppSettings() {
  const whatsapp = state.company.whatsapp || {};
  return `
    <form class="settings-panel whatsapp-settings" data-whatsapp-form>
      <section class="integration-card">
        <div>
          <p class="eyebrow">Atendimento</p>
          <h3>Botao WhatsApp do site</h3>
          <p>Use o numero em formato internacional. Este numero alimenta o botao publico de contato e as mensagens preparadas nas faturas.</p>
        </div>
        <label>Numero principal/remetente<input name="sender" value="${escapeHtml(whatsapp.sender || "")}" placeholder="5513999990000" /></label>
        <label>Status da conexao<input value="${escapeHtml(whatsapp.connectionStatus || (whatsapp.cloudApiEnabled === "Sim" ? "Pronto para conectar" : "Modo link wa.me"))}" readonly /></label>
      </section>

      <section class="integration-card">
        <div>
          <p class="eyebrow">Mensagem padrao</p>
          <h3>Faturas e lembretes</h3>
          <p>O sistema monta o texto automaticamente usando as variaveis abaixo. O envio automatico real depende do backend conectado a API oficial.</p>
        </div>
        <label class="full">Modelo da mensagem<textarea name="message" rows="6">${escapeHtml(whatsapp.message || "")}</textarea></label>
        <p class="empty-inline full">Variaveis: {{cliente_nome}}, {{categoria}}, {{valor}}, {{vencimento}}, {{imovel_titulo}}, {{empresa_nome}}</p>
      </section>

      <section class="integration-card">
        <div>
          <p class="eyebrow">WhatsApp Cloud API</p>
          <h3>Pronto para conectar</h3>
          <p>Preencha os dados do Meta Developers. Em producao, o access token deve ficar no backend, nao no navegador.</p>
        </div>
        <label>Cloud API<select name="cloudApiEnabled">
          <option value="Nao" ${whatsapp.cloudApiEnabled !== "Sim" ? "selected" : ""}>Nao</option>
          <option value="Sim" ${whatsapp.cloudApiEnabled === "Sim" ? "selected" : ""}>Sim</option>
        </select></label>
        <label>Phone Number ID<input name="phoneNumberId" value="${escapeHtml(whatsapp.phoneNumberId || "")}" placeholder="ID do numero no Meta" /></label>
        <label>Business Account ID<input name="businessAccountId" value="${escapeHtml(whatsapp.businessAccountId || "")}" placeholder="WABA ID" /></label>
        <label>App ID<input name="appId" value="${escapeHtml(whatsapp.appId || "")}" placeholder="App ID do Meta" /></label>
        <label>Webhook verify token<input name="webhookVerifyToken" value="${escapeHtml(whatsapp.webhookVerifyToken || "")}" placeholder="Token para validar webhook" /></label>
        <label>URL do webhook<input name="webhookUrl" value="${escapeHtml(whatsapp.webhookUrl || "")}" placeholder="https://api.suaimobiliaria.com/webhooks/whatsapp" /></label>
        <label class="full">Access token<input name="accessToken" value="${escapeHtml(whatsapp.accessToken || "")}" placeholder="Use somente para teste local; em producao fica no backend" /></label>
      </section>

      <section class="integration-card">
        <div>
          <p class="eyebrow">Teste</p>
          <h3>Mensagem de verificacao</h3>
          <p>Preencha um numero e uma mensagem para deixar o teste preparado quando o backend/API estiver conectado.</p>
        </div>
        <label>Numero de teste<input name="testTo" value="${escapeHtml(whatsapp.testTo || "")}" placeholder="5513999990000" /></label>
        <label class="full">Mensagem de teste<textarea name="testMessage" rows="3">${escapeHtml(whatsapp.testMessage || "Teste de conexao WhatsApp - Regis Imobiliaria")}</textarea></label>
      </section>

      <div class="modal-actions">
        <button class="submit-button" type="submit">Salvar WhatsApp</button>
        <a class="secondary-button" href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank" rel="noopener">Documentacao Cloud API</a>
      </div>
    </form>
  `;
}

function renderContractTemplateSettings() {
  const templates = state.company.contractTemplates || defaultContractTemplates();
  return `
    <form class="settings-panel contract-template-editor" data-contract-template-form>
      <p>Defina os modelos padrao. Use as lacunas abaixo para o sistema preencher automaticamente dados de empresa, partes, imovel, prazos e valores ao baixar o PDF.</p>
      <div class="template-toolbar">
        <button class="secondary-button" type="button" data-template-insert="CLAUSULA 00 - TITULO DA CLAUSULA\nTexto da clausula." onclick="insertTemplateText(this.dataset.templateInsert)">Clausula</button>
        <button class="secondary-button" type="button" data-template-insert="\n\n________________________________________\n{{proprietario_nome}}\n\n________________________________________\n{{cliente_nome}}\n\n________________________________________\n{{empresa_nome}}" onclick="insertTemplateText(this.dataset.templateInsert)">Assinaturas</button>
        <button class="secondary-button" type="button" data-template-insert="\n\n" onclick="insertTemplateText(this.dataset.templateInsert)">Quebra</button>
      </div>
      <div class="placeholder-grid">
        ${contractPlaceholders
          .map(([key, label]) => `<button class="placeholder-chip" type="button" data-template-insert="{{${key}}}" onclick="insertTemplateText(this.dataset.templateInsert)">${escapeHtml(label)}</button>`)
          .join("")}
      </div>
      <section class="template-box">
        <h3>Modelo de locacao</h3>
        <label>Titulo principal<input name="locacaoTitle" value="${escapeHtml(templates.locacao.title)}" /></label>
        <label class="full">Texto do contrato<textarea name="locacaoBody" rows="16" data-template-body="locacao">${escapeHtml(templates.locacao.body)}</textarea></label>
      </section>
      <section class="template-box">
        <h3>Modelo de venda</h3>
        <label>Titulo principal<input name="compraTitle" value="${escapeHtml(templates.compra.title)}" /></label>
        <label class="full">Texto do contrato<textarea name="compraBody" rows="16" data-template-body="compra">${escapeHtml(templates.compra.body)}</textarea></label>
      </section>
      <section class="template-box">
        <h3>Modelo avulso</h3>
        <label>Titulo principal<input name="avulsoTitle" value="${escapeHtml(templates.avulso.title)}" /></label>
        <label class="full">Texto do contrato<textarea name="avulsoBody" rows="16" data-template-body="avulso">${escapeHtml(templates.avulso.body)}</textarea></label>
      </section>
      <div class="modal-actions">
        <button class="submit-button" type="submit">Salvar modelos</button>
        <button class="secondary-button" type="button" data-restore-default-templates>Restaurar padrao</button>
      </div>
    </form>
  `;
}

function renderCompanySettings() {
  return `
    <form class="settings-panel settings-options" data-company-form>
      <label>Nome da empresa<input name="name" value="${escapeHtml(state.company.name)}" required /></label>
      <label>Razao social<input name="legalName" value="${escapeHtml(state.company.legalName || "")}" /></label>
      <label>CNPJ<input name="cnpj" value="${escapeHtml(state.company.cnpj || "")}" placeholder="00.000.000/0000-00" /></label>
      <label>CRECI<input name="creci" value="${escapeHtml(state.company.creci)}" /></label>
      <label>Telefone<input name="phone" value="${escapeHtml(state.company.phone)}" /></label>
      <label>Email<input name="email" value="${escapeHtml(state.company.email)}" /></label>
      <label class="full">Endereco<input name="address" value="${escapeHtml(state.company.address)}" /></label>
      <section class="brand-logo-manager full">
        <div class="brand-logo-preview ${state.company.logo ? "" : "empty"}">
          ${state.company.logo ? `<img src="${state.company.logo}" alt="Logo da empresa">` : "<span>Sem logo</span>"}
        </div>
        <div>
          <strong>Logo da empresa</strong>
          <small>Adicione uma logo quando estiver vazio ou substitua a imagem atual.</small>
          <div class="modal-actions">
            <label class="mini-upload">
              Adicionar logo
              <input type="file" accept="image/*" data-company-logo-upload="add" />
            </label>
            <label class="mini-upload">
              Substituir logo
              <input type="file" accept="image/*" data-company-logo-upload="replace" />
            </label>
            <button class="danger-button" type="button" data-remove-company-logo ${state.company.logo ? "" : "disabled"}>Excluir logo</button>
          </div>
        </div>
      </section>
      <div class="modal-actions full">
        <button class="submit-button" type="submit">Salvar perfil</button>
      </div>
    </form>
  `;
}

function renderAppearanceSettings() {
  const colors = companyColors();
  return `
    <form class="settings-panel" data-appearance-form>
      <p>Selecione um tema pronto ou personalize as cores principais do sistema.</p>
      <div class="theme-grid">
        ${Object.entries(themePresets)
          .map(([key, theme]) => {
            const active = (state.company.theme || "regis") === key;
            return `
              <label class="theme-card ${active ? "active" : ""}">
                <input type="radio" name="theme" value="${key}" ${active ? "checked" : ""} data-theme-choice>
                <span class="theme-swatches">
                  <i style="background:${theme.blue}"></i>
                  <i style="background:${theme.green}"></i>
                  <i style="background:${theme.yellow}"></i>
                </span>
                <strong>${escapeHtml(theme.name)}</strong>
              </label>
            `;
          })
          .join("")}
      </div>
      <div class="settings-options">
        <label>Azul principal<input type="color" name="blue" value="${escapeHtml(colors.blue)}" /></label>
        <label>Azul escuro<input type="color" name="blueDark" value="${escapeHtml(colors.blueDark)}" /></label>
        <label>Verde principal<input type="color" name="green" value="${escapeHtml(colors.green)}" /></label>
        <label>Verde escuro<input type="color" name="greenDark" value="${escapeHtml(colors.greenDark)}" /></label>
        <label>Amarelo destaque<input type="color" name="yellow" value="${escapeHtml(colors.yellow)}" /></label>
      </div>
      <div class="modal-actions">
        <button class="submit-button" type="submit">Salvar tema</button>
      </div>
    </form>
  `;
}

function renderTrashSettings() {
  return `
    <section class="settings-panel">
      <p>Itens excluidos ficam aqui por 30 dias. Voce pode restaurar ou esvaziar manualmente.</p>
      <div class="trash-list">
        ${
          state.trash.length
            ? state.trash
                .map((entry) => {
                  const title = entry.item.title || entry.item.name || "Registro";
                  const origin = entry.item.parentName ? ` de ${entry.item.parentName}` : "";
                  return `
                    <article class="trash-item">
                      <div>
                        <strong>${escapeHtml(title)}</strong>
                        <small>${escapeHtml(entityLabel(entry.type))}${escapeHtml(origin)} excluido em ${escapeHtml(new Date(entry.deletedAt).toLocaleDateString("pt-BR"))}</small>
                      </div>
                      <button class="secondary-button" type="button" data-restore-trash="${entry.id}">Restaurar</button>
                    </article>
                  `;
                })
                .join("")
            : '<p class="empty-inline">Lixeira vazia.</p>'
        }
      </div>
      <div class="modal-actions">
        <button class="danger-button" type="button" data-empty-trash>Esvaziar lixeira</button>
      </div>
    </section>
  `;
}

function renderBackupSettings(config) {
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    company: state.company,
    properties: state.properties,
    clients: state.clients,
    owners: state.owners,
    contracts: state.contracts,
    appointments: state.appointments,
    invoices: state.invoices,
    team: state.team,
    trash: state.trash,
  };
  const json = JSON.stringify(backup, null, 2);
  return `
    <section class="settings-panel backup-panel">
      <p>${escapeHtml(config.description)}</p>
      <div class="invoice-summary">
        <article class="invoice-metric"><span>Imoveis</span><strong>${state.properties.length}</strong></article>
        <article class="invoice-metric"><span>Clientes</span><strong>${state.clients.length}</strong></article>
        <article class="invoice-metric"><span>Contratos</span><strong>${state.contracts.length}</strong></article>
        <article class="invoice-metric"><span>Faturas</span><strong>${state.invoices.length}</strong></article>
      </div>
      <div class="modal-actions">
        <button class="submit-button" type="button" data-download-backup>Baixar backup JSON</button>
        <label class="secondary-button">
          Restaurar backup
          <input type="file" accept="application/json,.json" data-restore-backup hidden />
        </label>
      </div>
      <p class="empty-inline">O arquivo inclui empresa, imoveis, clientes, proprietarios, contratos, agendamentos, faturas, usuarios e lixeira. Guarde em local seguro.</p>
      <textarea readonly rows="10">${escapeHtml(json)}</textarea>
    </section>
  `;
}

function renderReportsSettings(config) {
  const gross = state.properties.reduce((sum, property) => sum + propertyGrossValue(property), 0);
  const net = state.properties.reduce((sum, property) => sum + propertyNetValue(property), 0);
  const profit = state.properties.reduce((sum, property) => sum + propertyProfitValue(property), 0);
  const monthlyRentProfit = state.properties
    .filter((property) => property.purpose === "Locacao")
    .reduce((sum, property) => sum + propertyProfitValue(property), 0);
  return `
    <section class="settings-panel">
      <p>${escapeHtml(config.description)}</p>
      <div class="invoice-summary">
        <article class="invoice-metric"><span>Imoveis</span><strong>${state.properties.length}</strong></article>
        <article class="invoice-metric"><span>Clientes</span><strong>${state.clients.length}</strong></article>
        <article class="invoice-metric"><span>Proprietarios</span><strong>${state.owners.length}</strong></article>
        <article class="invoice-metric"><span>Contratos</span><strong>${state.contracts.length}</strong></article>
        <article class="invoice-metric"><span>Valor bruto</span><strong>${formatter.format(gross)}</strong></article>
        <article class="invoice-metric"><span>Valor liquido</span><strong>${formatter.format(net)}</strong></article>
        <article class="invoice-metric"><span>Lucro previsto</span><strong>${formatter.format(profit)}</strong></article>
        <article class="invoice-metric"><span>Lucro mensal locacao</span><strong>${formatter.format(monthlyRentProfit)}</strong></article>
      </div>
    </section>
  `;
}

function contractTemplateKey(contract) {
  if (contract.type === "Locacao") return "locacao";
  if (contract.type === "Avulso") return "avulso";
  return "compra";
}

function contractTypeLabel(contract) {
  if (contract?.type === "Locacao") return "Locacao";
  if (contract?.type === "Avulso") return "Avulso por temporada";
  return "Compra e venda";
}

function contractTitle(contract) {
  const templates = state.company.contractTemplates || defaultContractTemplates();
  const template = contract.template || templates[contractTemplateKey(contract)];
  return template?.title || defaultContractTemplates()[contractTemplateKey(contract)].title;
}

function contractFileName(contract, property, client) {
  const base = `${contract.type}-${property?.title || "imovel"}-${client?.name || "cliente"}`;
  return normalize(base).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "contrato";
}

function compactContact(entity) {
  return [entity?.contact1, entity?.contact2].filter(Boolean).join(" / ") || "nao informado";
}

function propertyAddress(property) {
  return propertyLocation(property) || "endereco nao informado";
}

function contractTemplateValues(contract, { property, client, owner, company }) {
  const guarantor = contract.guarantor || {};
  const hasGuarantor = contract.hasGuarantor === "Sim" && guarantor.name;
  return {
    empresa_nome: company.name || "Imobiliaria",
    empresa_razao_social: company.legalName || company.name || "nao informado",
    empresa_cnpj: company.cnpj || "nao informado",
    empresa_creci: company.creci || "nao informado",
    empresa_endereco: company.address || "nao informado",
    contrato_tipo: contractTypeLabel(contract),
    data_emissao: formatDate(contract.issuedAt || new Date().toISOString()),
    data_vencimento: contractDueDate(contract) || "nao se aplica",
    prazo_meses: contract.termMonths || "nao se aplica",
    valor_mensal: formatter.format(Number(contract.monthlyValue || contract.amount || 0)),
    valor_caucao: formatter.format(Number(contract.securityDeposit || 0)),
    valor_entrada: formatter.format(Number(contract.downPayment || 0)),
    valor_total_venda: formatter.format(Number(contract.negotiatedValue || contract.amount || 0)),
    valor_avulso: formatter.format(Number(contract.oneOffValue || contract.amount || 0)),
    data_entrada: formatDate(contract.seasonStart) || contract.seasonStart || "nao informado",
    data_saida: formatDate(contract.seasonEnd) || contract.seasonEnd || "nao informado",
    categoria_temporada: contract.seasonCategory || "Temporada",
    imovel_titulo: property?.title || "nao informado",
    imovel_tipo: [property?.type, property?.subtype].filter(Boolean).join(" / ") || "nao informado",
    imovel_endereco: propertyAddress(property),
    proprietario_nome: owner?.name || "nao informado",
    proprietario_cpf: owner?.cpf || "nao informado",
    proprietario_contato: compactContact(owner),
    cliente_nome: client?.name || "nao informado",
    cliente_cpf: client?.cpf || "nao informado",
    cliente_contato: compactContact(client),
    cliente_endereco: client?.address || "nao informado",
    fiador_nome: hasGuarantor ? guarantor.name : "Nao possui fiador",
    fiador_cpf: hasGuarantor ? guarantor.cpf || "nao informado" : "nao se aplica",
    fiador_contato: hasGuarantor ? compactContact(guarantor) : "nao se aplica",
    fiador_endereco: hasGuarantor ? guarantor.address || "nao informado" : "nao se aplica",
    fiador_renda: hasGuarantor ? formatter.format(Number(guarantor.income || 0)) : "nao se aplica",
    data_rescisao: formatDate(contract.rescindedAt || new Date().toISOString()),
    motivo_rescisao: contract.rescissionReason || "Motivo nao informado.",
    observacoes: contract.notes || "Sem observacoes adicionais.",
  };
}

function fillContractTemplate(template, values) {
  return String(template || "").replace(/\{\{\s*([a-z0-9_]+)\s*\}\}/gi, (_, key) => values[key] ?? "");
}

function insertTemplateText(text) {
  const target =
    document.activeElement?.matches?.("[data-template-body]") && document.activeElement
      ? document.activeElement
      : document.querySelector("[data-template-body]");
  if (!target) return;
  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  target.value = `${target.value.slice(0, start)}${text}${target.value.slice(end)}`;
  target.focus();
  target.selectionStart = target.selectionEnd = start + text.length;
}

function contractTextBlocks(contract) {
  const property = findProperty(contract.propertyId);
  const client = findClient(contract.clientId);
  const owner = property ? propertyOwner(property) : null;
  const company = state.company;
  const templates = company.contractTemplates || defaultContractTemplates();
  const template = contract.template || templates[contractTemplateKey(contract)];
  const values = contractTemplateValues(contract, { property, client, owner, company });
  const body = fillContractTemplate(template?.body, values);
  const paragraphs = body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  if (contract.signed && contract.signatures?.length) {
    paragraphs.push(
      `ASSINATURAS ELETRONICAS: Documento assinado eletronicamente em ${formatDate(contract.signedAt)} pelas partes abaixo.`,
      ...contract.signatures.map((signature) => `${signature.role}: ${signature.name} - Assinatura digital coletada.`),
    );
  }
  if (contract.rescinded) {
    paragraphs.push(`CONTRATO RESCINDIDO: Rescindido em ${formatDate(contract.rescindedAt)}. Motivo: ${contract.rescissionReason || "Sem motivo informado."}`);
  }
  return {
    property,
    client,
    owner,
    company,
    title: fillContractTemplate(template?.title || contractTitle(contract), values),
    paragraphs,
  };
  const isLease = contract.type === "Locacao";
  const buyerRole = isLease ? "LOCATARIO(A)" : "COMPRADOR(A)";
  const ownerRole = isLease ? "LOCADOR(A)" : "VENDEDOR(A)";
  const amountText = isLease
    ? `aluguel mensal de ${formatter.format(Number(contract.monthlyValue || contract.amount || 0))}`
    : `entrada no valor de ${formatter.format(Number(contract.downPayment || 0))}`;
  const paymentText = isLease
    ? `O prazo da locacao sera de ${contract.termMonths || "____"} meses, com vencimento contratual calculado para ${contractDueDate(contract) || "____/____/______"}, contado a partir da data de emissao.`
    : "As demais condicoes de pagamento, escritura, registro e transferencia deverao ser conferidas na documentacao complementar e ajustadas entre as partes.";

  return {
    property,
    client,
    owner,
    company,
    title: contractTitle(contract),
    paragraphs: [
      `${company.name || "IMOBILIARIA"}, pessoa juridica${company.legalName ? ` denominada ${company.legalName}` : ""}${company.cnpj ? `, inscrita no CNPJ sob nº ${company.cnpj}` : ""}${company.creci ? `, CRECI ${company.creci}` : ""}, com endereco ${company.address || "nao informado"}, apresenta a presente minuta contratual para formalizacao das condicoes abaixo.`,
      `${ownerRole}: ${owner?.name || "Nao informado"}, CPF/CNPJ ${owner?.cpf || "nao informado"}, contato ${owner?.contact1 || "nao informado"}, endereco ${owner?.address || "nao informado"}.`,
      `${buyerRole}: ${client?.name || "Nao informado"}, CPF/CNPJ ${client?.cpf || "nao informado"}, contato ${client?.contact1 || "nao informado"}, endereco ${client?.address || "nao informado"}.`,
      `OBJETO: O presente contrato tem por objeto o imovel ${property?.title || "nao informado"}, do tipo ${property?.type || "nao informado"}${property?.subtype ? ` / ${property.subtype}` : ""}, situado em ${propertyAddress(property)}.`,
      `CONDICOES ECONOMICAS: As partes ajustam ${amountText}. ${paymentText}`,
      isLease
        ? "OBRIGACOES GERAIS: O locatario declara receber o imovel para uso regular, comprometendo-se a zelar pela conservacao, pagar pontualmente os valores pactuados e observar as normas legais aplicaveis a locacao urbana."
        : "OBRIGACOES GERAIS: O vendedor declara possuir poderes para negociar o imovel e o comprador declara ciencia das condicoes de pagamento, documentacao, tributos e providencias necessarias a transferencia.",
      isLease
        ? "REFERENCIA LEGAL: A presente minuta observa, em linhas gerais, a Lei nº 8.245/1991, que regula as locacoes de imoveis urbanos, sem prejuizo de clausulas especificas e revisao profissional."
        : "REFERENCIA LEGAL: A presente minuta observa, em linhas gerais, o Codigo Civil brasileiro, especialmente as disposicoes relativas aos contratos e a compra e venda, sem prejuizo de escritura, registro e revisao profissional.",
      "DOCUMENTACAO: As partes deverao apresentar documentos pessoais, comprovantes, certidoes e demais instrumentos necessarios a formalizacao, registro ou reconhecimento do contrato, conforme o caso.",
      "RESCISAO E INADIMPLEMENTO: O descumprimento das obrigacoes pactuadas sujeitara a parte infratora as medidas cabiveis, perdas e danos, encargos pactuados e demais consequencias previstas na legislacao aplicavel.",
      "FORO: Fica eleito o foro da comarca do local do imovel, salvo disposicao diversa expressamente pactuada entre as partes.",
      "OBSERVACOES ESPECIFICAS: " + (contract.notes || "Sem observacoes adicionais."),
      "MINUTA OPERACIONAL: Este documento foi gerado pelo sistema para apoio administrativo e deve ser revisado por profissional habilitado antes da assinatura definitiva.",
    ],
  };
}

function rescissionTextBlocks(contract) {
  const property = findProperty(contract.propertyId);
  const client = findClient(contract.clientId);
  const owner = property ? propertyOwner(property) : null;
  const company = state.company;
  const template = contract.rescissionTemplate || defaultRescissionTemplate();
  const values = contractTemplateValues(contract, { property, client, owner, company });
  const body = fillContractTemplate(template.body, values);
  const paragraphs = body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  if (contract.rescissionSignatures?.length) {
    paragraphs.push(
      `ASSINATURAS ELETRONICAS DO DISTRATO: Documento assinado eletronicamente em ${formatDate(contract.rescindedAt)} pelas partes abaixo.`,
      ...contract.rescissionSignatures.map((signature) => `${signature.role}: ${signature.name} - Assinatura: ${signature.signature}`),
    );
  }
  return {
    property,
    client,
    owner,
    company,
    title: fillContractTemplate(template.title, values),
    paragraphs,
  };
}

function addPdfWrappedText(doc, text, x, y, maxWidth, lineHeight) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line) => {
    if (y > 275) {
      doc.addPage();
      y = 30;
    }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

async function imageToDataUrl(src) {
  if (!src) return "";
  if (src.startsWith("data:")) return src;
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => resolve("");
    image.src = src;
  });
}

async function downloadContractPdf(contractId, documentType = "") {
  const contract = state.contracts.find((item) => item.id === contractId);
  if (!contract) return;
  if (!documentType && contract.signedDocument?.data) {
    const link = document.createElement("a");
    link.href = contract.signedDocument.data;
    link.download = contract.signedDocument.name || contract.signedDocument.label || "contrato-assinado";
    link.click();
    return;
  }
  if (contract.rescinded && !documentType) {
    const choice = window.prompt("Baixar qual documento?\n1 - Contrato rescindido\n2 - Distrato contratual\n3 - Ambos", "1");
    if (!choice) return;
    if (choice === "2") return downloadContractPdf(contractId, "rescission");
    if (choice === "3") {
      await downloadContractPdf(contractId, "contract");
      return downloadContractPdf(contractId, "rescission");
    }
    documentType = "contract";
  }
  const isRescission = documentType === "rescission";
  const data = isRescission ? rescissionTextBlocks(contract) : contractTextBlocks(contract);
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    downloadBasicContractPdf(contract, isRescission ? "rescission" : "contract");
    showToast(isRescission ? "PDF do distrato baixado." : "PDF do contrato baixado.");
    return;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const left = 30;
  const right = 20;
  const maxWidth = 210 - left - right;
  let y = 24;

  doc.setFont("times", "normal");
  const logoData = await imageToDataUrl(state.company.logo);
  if (logoData) {
    doc.addImage(logoData, "PNG", left, y, 34, 20, undefined, "FAST");
  }
  doc.setFontSize(10);
  doc.text(state.company.name || "Regis Imobiliaria", 70, y + 7);
  doc.text(`${state.company.legalName || ""}${state.company.cnpj ? `  CNPJ: ${state.company.cnpj}` : ""}`, 70, y + 13);
  doc.text(`${state.company.creci ? `CRECI: ${state.company.creci}` : ""}${state.company.phone ? `  Tel: ${state.company.phone}` : ""}`, 70, y + 19);
  y += 36;

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text(data.title, 105, y, { align: "center" });
  y += 14;

  doc.setFont("times", "normal");
  doc.setFontSize(12);
  data.paragraphs.forEach((paragraph, index) => {
    const label = index >= 3 && index <= 8 ? `CLAUSULA ${String(index - 2).padStart(2, "0")} - ` : "";
    y = addPdfWrappedText(doc, `${label}${paragraph}`, left, y, maxWidth, 6.5);
    y += 4;
  });

  if (y > 230) {
    doc.addPage();
    y = 35;
  } else {
    y += 12;
  }

  doc.text(`${data.property?.city || "Cidade"}, ${new Date().toLocaleDateString("pt-BR")}.`, left, y);
  y += 26;
  const signatures = contract.signatures?.length
    ? contract.signatures
    : [
        { name: data.owner?.name || "Proprietario", role: "Proprietario" },
        { name: data.client?.name || "Cliente", role: "Cliente" },
        { name: state.company.name || "Imobiliaria", role: "Imobiliaria" },
      ];
  signatures.forEach((signature) => {
    if (y > 270) {
      doc.addPage();
      y = 35;
    }
    if (signature.signature?.startsWith("data:image")) {
      doc.addImage(signature.signature, "PNG", left, y - 17, 70, 18, undefined, "FAST");
    }
    doc.line(left, y, left + 70, y);
    doc.text(signature.name || "Assinatura", left, y + 6);
    if (signature.role) doc.text(signature.role, left, y + 11);
    y += 22;
  });

  doc.save(`${contractFileName(contract, data.property, data.client)}${isRescission ? "-distrato" : ""}.pdf`);
}

function openPrintableContract(contract) {
  const data = contractTextBlocks(contract);
  const popup = window.open("", "_blank");
  if (!popup) return;
  popup.document.write(`
    <!doctype html>
    <html><head><title>${escapeHtml(data.title)}</title>
    <style>
      @page { size: A4; margin: 3cm 2cm 2cm 3cm; }
      body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.5; color: #111; }
      h1 { text-align: center; font-size: 12pt; margin: 24pt 0; }
      p { text-align: justify; margin: 0 0 12pt; }
      .sign { margin-top: 34pt; width: 70%; border-top: 1px solid #111; padding-top: 6pt; }
    </style></head><body>
    <h1>${escapeHtml(data.title)}</h1>
    ${data.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
    <p>${escapeHtml(data.property?.city || "Cidade")}, ${new Date().toLocaleDateString("pt-BR")}.</p>
    <div class="sign">${escapeHtml(data.owner?.name || "Proprietario")}</div>
    <div class="sign">${escapeHtml(data.client?.name || "Cliente")}</div>
    <div class="sign">${escapeHtml(state.company.name || "Imobiliaria")}</div>
    </body></html>
  `);
  popup.document.close();
  popup.print();
}

function pdfEscape(value) {
  return String(value ?? "")
    .replace(/[^\x20-\x7EÀ-ÿ]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildBasicPdf(lines) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const left = 85;
  const top = 85;
  const bottom = 57;
  const lineHeight = 15;
  const maxChars = 88;
  const pages = [[]];
  let y = top;

  lines.forEach((line) => {
    const words = String(line).split(/\s+/);
    let current = "";
    words.forEach((word) => {
      if ((current + " " + word).trim().length > maxChars) {
        pages[pages.length - 1].push(current);
        y += lineHeight;
        current = word;
        if (y > pageHeight - bottom) {
          pages.push([]);
          y = top;
        }
      } else {
        current = `${current} ${word}`.trim();
      }
    });
    if (current) {
      pages[pages.length - 1].push(current);
      y += lineHeight;
    }
    pages[pages.length - 1].push("");
    y += lineHeight;
    if (y > pageHeight - bottom) {
      pages.push([]);
      y = top;
    }
  });

  const objects = [];
  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>");
  const pageIds = [];

  pages.forEach((pageLines) => {
    let text = `BT /F1 12 Tf ${left} ${pageHeight - top} Td 15 TL `;
    pageLines.forEach((line, index) => {
      if (index) text += "T* ";
      text += `(${pdfEscape(line)}) Tj `;
    });
    text += "ET";
    const streamId = addObject(`<< /Length ${text.length} >>\nstream\n${text}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`);
    pageIds.push(pageId);
  });

  const pagesId = addObject(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`);
  pageIds.forEach((id) => {
    objects[id - 1] = objects[id - 1].replace("/Parent 0 0 R", `/Parent ${pagesId} 0 R`);
  });
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

function downloadBasicContractPdf(contract, documentType = "contract") {
  const isRescission = documentType === "rescission";
  const data = isRescission ? rescissionTextBlocks(contract) : contractTextBlocks(contract);
  const lines = [
    state.company.name || "Regis Imobiliaria",
    `${state.company.legalName || ""} ${state.company.cnpj ? `CNPJ: ${state.company.cnpj}` : ""} ${state.company.creci ? `CRECI: ${state.company.creci}` : ""}`,
    data.title,
    ...data.paragraphs,
    `${data.property?.city || "Cidade"}, ${new Date().toLocaleDateString("pt-BR")}.`,
    "________________________________________",
    data.owner?.name || "Proprietario",
    "________________________________________",
    data.client?.name || "Cliente",
    "________________________________________",
    state.company.name || "Imobiliaria",
  ];
  const pdf = buildBasicPdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const property = findProperty(contract.propertyId);
  const client = findClient(contract.clientId);
  link.href = url;
  link.download = `${contractFileName(contract, property, client)}${isRescission ? "-distrato" : ""}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function invoiceFileName(invoice, client) {
  return slugify(`fatura-${invoice.category}-${client?.name || "cliente"}-${invoice.dueDate || invoice.createdAt || ""}`) || "fatura";
}

function invoicePdfLines(invoice, title = "FATURA DE COBRANCA") {
  const client = findClient(invoice.clientId);
  const property = findProperty(invoice.propertyId);
  const contract = findContract(invoice.contractId);
  const status = invoiceComputedStatus(invoice);
  return [
    state.company.name || "Regis Imobiliaria",
    `${state.company.legalName || ""} ${state.company.cnpj ? `CNPJ: ${state.company.cnpj}` : ""} ${state.company.creci ? `CRECI: ${state.company.creci}` : ""}`.trim(),
    state.company.address ? `Endereco: ${state.company.address}` : "",
    "",
    title,
    `Categoria: ${invoice.category}`,
    `Status: ${status}`,
    `Emissao: ${formatDate(invoice.createdAt) || new Date().toLocaleDateString("pt-BR")}`,
    `Vencimento: ${formatDate(invoice.dueDate) || invoice.dueDate || "Nao informado"}`,
    invoice.reference ? `Mes de referencia: ${invoice.reference}` : "",
    invoice.contractEndReference ? `Ultimo mes de cobranca do contrato: ${invoice.contractEndReference}` : "",
    invoice.installmentTotal > 1
      ? `Carne de ${invoice.category === "Compra" ? "venda" : "locacao"}: ${invoiceInstallmentDisplay(invoice)}`
      : "",
    "",
    "DADOS DO CLIENTE",
    `Nome/Razao: ${client?.name || "Nao informado"}`,
    `CPF/CNPJ: ${client?.cpf || "Nao informado"}`,
    `Contato: ${compactContact(client)}`,
    `Endereco: ${client?.address || "Nao informado"}`,
    "",
    "DADOS DO IMOVEL E CONTRATO",
    `Imovel: ${property?.title || "Nao vinculado"}`,
    `Endereco do imovel: ${propertyAddress(property)}`,
    `Contrato: ${contract ? `Contrato de ${contract.type}` : "Nao vinculado"}`,
    "",
    "VALORES",
    invoice.saleTotal ? `Valor total do imovel: ${formatter.format(Number(invoice.saleTotal || 0))}` : "",
    invoice.downPayment ? `Entrada: ${formatter.format(Number(invoice.downPayment || 0))}` : "",
    invoice.financedTotal ? `Saldo parcelado com juros: ${formatter.format(Number(invoice.financedTotal || 0))}` : "",
    invoice.interestRate ? `Juros aplicado: ${invoice.interestRate}%` : "",
    `Valor da fatura: ${formatter.format(Number(invoice.amount || 0))}`,
    invoice.installment ? `Parcela: ${invoice.installment}` : "",
    invoice.chargeType ? `Tipo de cobranca: ${invoice.chargeType}` : "",
    "",
    "DESCRICAO E OBSERVACOES",
    invoice.description || "Sem observacoes adicionais.",
    "",
    "DECLARACAO",
    "Esta fatura representa cobranca administrativa vinculada aos dados acima, devendo ser conferida pelas partes antes do pagamento. O pagamento nao substitui recibo formal quando exigido pelas partes ou pela legislacao aplicavel.",
    "",
    `${property?.city || state.company.address || "Cidade"}, ${new Date().toLocaleDateString("pt-BR")}.`,
    "",
    "________________________________________",
    state.company.name || "Imobiliaria",
    "",
    "________________________________________",
    client?.name || "Cliente",
  ].filter((line) => line !== "");
}

function downloadInvoicePdf(invoiceId) {
  const invoice = state.invoices.find((item) => item.id === invoiceId);
  if (!invoice) return;
  const client = findClient(invoice.clientId);
  const lines = invoicePdfLines(invoice);
  const pdf = buildBasicPdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceFileName(invoice, client)}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadInvoiceBookletPdf(invoiceId) {
  const invoice = state.invoices.find((item) => item.id === invoiceId);
  if (!invoice) return;
  const booklet = invoiceBookletItems(invoice);
  if (booklet.length <= 1) {
    downloadInvoicePdf(invoiceId);
    return;
  }
  const client = findClient(invoice.clientId);
  const title = `CARNE DE ${invoice.category === "Compra" ? "VENDA" : "LOCACAO"}`;
  const header = [
    title,
    `Cliente: ${client?.name || "Nao informado"}`,
    `Total de parcelas: ${booklet.length}`,
    "",
  ];
  const lines = booklet.flatMap((item, index) => [
    ...(index === 0 ? header : ["", ""]),
    `FATURA ${index + 1} DE ${booklet.length}`,
    ...invoicePdfLines(item, "FATURA DO CARNE").slice(5),
    "",
    "------------------------------------------------------------",
  ]);
  const pdf = buildBasicPdf(lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(`carne-${invoice.category}-${client?.name || "cliente"}-${invoice.bookletId}`) || "carne"}.pdf`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function backupPayload() {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    company: state.company,
    properties: state.properties,
    clients: state.clients,
    owners: state.owners,
    contracts: state.contracts,
    appointments: state.appointments,
    invoices: state.invoices,
    team: state.team,
    trash: state.trash,
  };
}

function downloadBackup() {
  const blob = new Blob([JSON.stringify(backupPayload(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup-regis-imobiliaria-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function restoreBackupFile(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(reader.result);
      const confirmed = window.confirm("Restaurar este backup vai substituir os dados atuais deste navegador. Continuar?");
      if (!confirmed) return;
      state.company = ensureCompany(data.company || {});
      state.properties = ensureProperties(Array.isArray(data.properties) ? data.properties : []);
      state.clients = ensureClients(Array.isArray(data.clients) ? data.clients : []);
      state.owners = ensureOwners(Array.isArray(data.owners) ? data.owners : []);
      state.contracts = ensureContracts(Array.isArray(data.contracts) ? data.contracts : []);
      state.appointments = ensureAppointments(Array.isArray(data.appointments) ? data.appointments : []);
      state.invoices = ensureInvoices(Array.isArray(data.invoices) ? data.invoices : []);
      state.team = ensureTeam(Array.isArray(data.team) ? data.team : defaultTeam);
      state.trash = ensureTrash(Array.isArray(data.trash) ? data.trash : []);
      saveAll();
      render();
      openSettingsTool("backup");
      showToast("Backup restaurado.");
    } catch (error) {
      showToast("Arquivo de backup invalido.");
      console.error(error);
    }
  });
  reader.readAsText(file);
}

function renderEditAppointmentProfile(appointment) {
  return `
    <form class="form-grid active modal-edit-form" data-edit-form="appointment" data-edit-id="${appointment.id}">
      <label>Tipo<select name="type" required>
        ${["Visita do cliente", "Visita da imobiliaria", "Manutencao"].map((type) => `<option value="${type}" ${appointment.type === type ? "selected" : ""}>${type}</option>`).join("")}
      </select></label>
      <label>Imovel<select name="propertyId" required>
        ${state.properties.map((property) => `<option value="${property.id}" ${appointment.propertyId === property.id ? "selected" : ""}>${escapeHtml(property.title)} - ${escapeHtml(propertyLocation(property) || "")}</option>`).join("")}
      </select></label>
      <label>Cliente<select name="clientId">
        <option value="">Nao vincular cliente</option>
        ${state.clients.map((client) => `<option value="${client.id}" ${appointment.clientId === client.id ? "selected" : ""}>${escapeHtml(client.name)} - ${escapeHtml(client.cpf || "")}</option>`).join("")}
      </select></label>
      <label>Responsavel<input name="responsible" value="${escapeHtml(appointment.responsible || "")}" /></label>
      <label>Data<input name="date" type="date" value="${escapeHtml(appointment.date || "")}" required /></label>
      <label>Horario<input name="time" type="time" value="${escapeHtml(appointment.time || "")}" required /></label>
      <label>Status<select name="status" required>
        ${["Agendado", "Concluido", "Cancelado"].map((status) => `<option value="${status}" ${appointment.status === status ? "selected" : ""}>${status}</option>`).join("")}
      </select></label>
      <label class="full">Observacoes<textarea name="notes" rows="4">${escapeHtml(appointment.notes || "")}</textarea></label>
      <div class="modal-actions full">
        <button class="submit-button" type="submit">Salvar alteracoes</button>
        <button class="secondary-button" type="button" data-cancel-edit>Cancelar</button>
      </div>
    </form>
  `;
}

function renderEditProfile(type, entity) {
  if (type === "contract") return renderEditContractProfile(entity);
  if (type === "appointment") return renderEditAppointmentProfile(entity);
  const isProperty = type === "property";
  const isOwner = type === "owner";
  return `
    <form class="form-grid active modal-edit-form" data-edit-form="${type}" data-edit-id="${entity.id}">
      ${
        isProperty
          ? `
            <label>IPTU<input name="iptu" type="number" value="${escapeHtml(entity.iptu || 0)}" /></label>
            <label>Proprietario do imovel<select name="ownerId" required>
              ${state.owners.map((owner) => `<option value="${owner.id}" ${owner.id === entity.ownerId ? "selected" : ""}>${escapeHtml(owner.name)} - ${escapeHtml(owner.cpf)}</option>`).join("")}
            </select></label>
            <label>Titulo do imovel<input name="title" value="${escapeHtml(entity.title)}" required /></label>
            <label>Tipo<select name="type" required data-edit-property-type>
              ${Object.keys(propertyTypes).map((type) => `<option value="${type}" ${type === entity.type ? "selected" : ""}>${type}</option>`).join("")}
            </select></label>
            <label>Especificacao<select name="subtype" required data-edit-property-subtype>
              ${(propertyTypes[entity.type] || []).map((subtype) => `<option value="${subtype}" ${subtype === entity.subtype ? "selected" : ""}>${subtype}</option>`).join("")}
            </select></label>
            <label>Finalidade<input name="purpose" value="${escapeHtml(entity.purpose)}" required /></label>
            <label>Valor bruto<input name="grossValue" type="number" value="${escapeHtml(propertyGrossValue(entity) || 0)}" required /></label>
            <label>Valor liquido<input name="netValue" type="number" value="${escapeHtml(propertyNetValue(entity) || 0)}" required /></label>
            <label class="full">Localizacao Google Maps<input name="googleLocation" value="${escapeHtml(propertyLocation(entity))}" placeholder="Cole o link do Google Maps ou digite o endereco completo" required /></label>
            <section class="geo-grid full">
              <div class="section-title">
                <p class="eyebrow">Georreferencia</p>
                <h3>Maps e cidades de atuacao</h3>
              </div>
              <label>Latitude<input name="latitude" type="number" step="0.000001" value="${escapeHtml(entity.latitude || "")}" /></label>
              <label>Longitude<input name="longitude" type="number" step="0.000001" value="${escapeHtml(entity.longitude || "")}" /></label>
              <label>Cidade detectada<input name="city" value="${escapeHtml(entity.city || "")}" /></label>
              <label>Bairro/regiao<input name="district" value="${escapeHtml(entity.district || "")}" /></label>
              <label class="full">Endereco formatado<input name="formattedAddress" value="${escapeHtml(entity.formattedAddress || propertyLocation(entity))}" /></label>
              <label class="full">Link do Google Maps<input name="googleMapsUrl" type="url" value="${escapeHtml(entity.googleMapsUrl || "")}" /></label>
              <input name="googlePlaceId" type="hidden" value="${escapeHtml(entity.googlePlaceId || "")}" />
            </section>
            <label>Quartos<input name="rooms" type="number" value="${escapeHtml(entity.rooms || 0)}" /></label>
            <label>Area<input name="area" type="number" value="${escapeHtml(entity.area || 0)}" /></label>
            <label>Area de lazer?<select name="leisureArea"><option value="Nao" ${entity.leisureArea !== "Sim" ? "selected" : ""}>Nao</option><option value="Sim" ${entity.leisureArea === "Sim" ? "selected" : ""}>Sim</option></select></label>
            <label>Piscina?<select name="pool"><option value="Nao" ${entity.pool !== "Sim" ? "selected" : ""}>Nao</option><option value="Sim" ${entity.pool === "Sim" ? "selected" : ""}>Sim</option></select></label>
            <label>Garagem?<select name="garage"><option value="Nao" ${entity.garage !== "Sim" ? "selected" : ""}>Nao</option><option value="Sim" ${entity.garage === "Sim" ? "selected" : ""}>Sim</option></select></label>
            <label>Vagas de garagem<input name="garageSpaces" type="number" value="${escapeHtml(entity.garageSpaces || 0)}" /></label>
            ${renderPropertyPhotoEditor(entity)}
          `
          : `
            <label>${isOwner ? "Nome do proprietario" : "Nome completo"}<input name="name" value="${escapeHtml(entity.name)}" required /></label>
            <label>CPF<input name="cpf" value="${escapeHtml(entity.cpf || "")}" required /></label>
            <label>Nome do contato 1<input name="contact1Name" value="${escapeHtml(entity.contact1Name || "")}" required /></label>
            <label>Contato 1<input name="contact1" value="${escapeHtml(entity.contact1 || "")}" required /></label>
            <label>Nome do contato 2<input name="contact2Name" value="${escapeHtml(entity.contact2Name || "")}" /></label>
            <label>Contato 2<input name="contact2" value="${escapeHtml(entity.contact2 || "")}" /></label>
            <label class="full">Endereco<input name="address" value="${escapeHtml(entity.address || "")}" /></label>
            ${isOwner ? "" : renderClientPhotoEditor(entity)}
            <div class="crop-controls full">
              <label>Zoom da foto<input name="cropZoom" type="range" min="1" max="1.8" step="0.05" value="${entity.crop?.zoom || 1}" /></label>
              <label>Posicao horizontal<input name="cropX" type="range" min="0" max="100" step="1" value="${entity.crop?.x || 50}" /></label>
              <label>Posicao vertical<input name="cropY" type="range" min="0" max="100" step="1" value="${entity.crop?.y || 50}" /></label>
            </div>
          `
      }
      <label class="full">Observacoes<textarea name="notes" rows="4">${escapeHtml(entity.notes || "")}</textarea></label>
      <div class="modal-actions full">
        <button class="submit-button" type="submit">Salvar alteracoes</button>
        <button class="secondary-button" type="button" data-cancel-edit>Cancelar</button>
        <button class="danger-button" type="button" data-delete-entity="${type}">Excluir ${isProperty ? "imovel" : isOwner ? "proprietario" : "cliente"}</button>
      </div>
    </form>
  `;
}

function renderEditContractProfile(contract) {
  return renderContractProfile(contract);
}

function renderRenewContractForm(contractId) {
  const contract = findContract(contractId);
  if (!contract || contract.type !== "Locacao") return;
  const guarantor = contract.guarantor || {};
  document.querySelector("#profile-kind").textContent = "Renovacao";
  document.querySelector("#profile-title").textContent = "Renovar contrato de locacao";
  document.querySelector("#profile-content").innerHTML = `
    <form class="form-grid active modal-edit-form" data-renew-contract-form="${contract.id}">
      <label>Imovel<select name="propertyId" required>
        ${state.properties.map((property) => `<option value="${property.id}" ${property.id === contract.propertyId ? "selected" : ""}>${escapeHtml(property.title)}</option>`).join("")}
      </select></label>
      <label>Cliente<select name="clientId" required>
        ${state.clients.map((client) => `<option value="${client.id}" ${client.id === contract.clientId ? "selected" : ""}>${escapeHtml(client.name)} - ${escapeHtml(client.cpf)}</option>`).join("")}
      </select></label>
      <section class="contract-type-panel full">
        <div class="section-title">
          <p class="eyebrow">Locacao</p>
          <h3>Dados da renovacao</h3>
        </div>
        <label>Tempo do contrato<select name="termMonths">
          ${["6", "12", "24", "30", "36"].map((months) => `<option value="${months}" ${String(contract.termMonths || "") === months ? "selected" : ""}>${months} meses</option>`).join("")}
        </select></label>
        <label>Valor mensal<input name="monthlyValue" type="number" min="0" step="10" value="${escapeHtml(contract.monthlyValue || contract.amount || "")}" /></label>
        <label>Valor em caucao<input name="securityDeposit" type="number" min="0" step="10" value="${escapeHtml(contract.securityDeposit || "")}" /></label>
        <label>Adicionar fiador?<select name="hasGuarantor">
          <option value="Nao" ${contract.hasGuarantor !== "Sim" ? "selected" : ""}>Nao</option>
          <option value="Sim" ${contract.hasGuarantor === "Sim" ? "selected" : ""}>Sim</option>
        </select></label>
        <label>Nome do fiador<input name="guarantorName" value="${escapeHtml(guarantor.name || "")}" /></label>
        <label>CPF do fiador<input name="guarantorCpf" value="${escapeHtml(guarantor.cpf || "")}" /></label>
        <label>Contato 1<input name="guarantorContact1" value="${escapeHtml(guarantor.contact1 || "")}" /></label>
        <label>Nome do dono do contato 1<input name="guarantorContact1Name" value="${escapeHtml(guarantor.contact1Name || "")}" /></label>
        <label>Contato 2<input name="guarantorContact2" value="${escapeHtml(guarantor.contact2 || "")}" /></label>
        <label>Nome do dono do contato 2<input name="guarantorContact2Name" value="${escapeHtml(guarantor.contact2Name || "")}" /></label>
        <label>Renda mensal<input name="guarantorIncome" type="number" min="0" step="10" value="${escapeHtml(guarantor.income || "")}" /></label>
        <label class="full">Endereco do fiador<input name="guarantorAddress" value="${escapeHtml(guarantor.address || "")}" /></label>
        <label class="full">Observacoes do fiador<textarea name="guarantorNotes" rows="3">${escapeHtml(guarantor.notes || "")}</textarea></label>
      </section>
      <label class="full">Observacoes<textarea name="notes" rows="4">${escapeHtml(contract.notes || "")}</textarea></label>
      <div class="modal-actions full">
        <button class="submit-button" type="submit">Emitir renovacao</button>
        <button class="secondary-button" type="button" data-cancel-edit>Cancelar</button>
      </div>
    </form>
  `;
}

document.querySelectorAll("[data-open-login]").forEach((button) => {
  button.addEventListener("click", openLogin);
});

document.querySelector("[data-close-login]")?.addEventListener("click", closeLogin);

document.querySelector("#login-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = collectForm(event.currentTarget);
  if (!isValidLogin(data.email, data.password)) {
    showToast("Email ou senha invalidos.");
    return;
  }
  setAppMode(true);
  closeLogin();
  render();
  setView(firstAvailableView());
  event.currentTarget.reset();
  showToast("Acesso liberado.");
});

document.querySelector("[data-logout]")?.addEventListener("click", () => {
  setAppMode(false);
  closeProfile();
  window.location.hash = "home";
  setPublicPage("home");
  showToast("Voce saiu do sistema interno.");
});

document.querySelectorAll("[data-public-filter]").forEach((field) => {
  field.addEventListener("input", () => {
    const key = field.dataset.publicFilter;
    const map = {
      query: "publicQuery",
      purpose: "publicPurpose",
      city: "publicCity",
      type: "publicType",
      maxPrice: "publicMaxPrice",
    };
    state.filters[map[key]] = field.value;
    renderPublicProperties();
  });
  field.addEventListener("change", () => {
    field.dispatchEvent(new Event("input"));
  });
});

document.addEventListener("click", (event) => {
  const publicPageLink = event.target.closest("[data-public-page-link]");
  if (publicPageLink) {
    event.preventDefault();
    const page = publicPageLink.dataset.publicPageLink;
    window.location.hash = page;
    setPublicPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const publicFeaturedButton = event.target.closest("[data-public-featured]");
  if (publicFeaturedButton) {
    event.preventDefault();
    event.stopPropagation();
    const featuredItems = state.properties.filter((property) => property.available !== false && property.featured);
    if (featuredItems.length) {
      state.publicHeroIndex =
        publicFeaturedButton.dataset.publicFeatured === "next"
          ? (state.publicHeroIndex + 1) % featuredItems.length
          : (state.publicHeroIndex - 1 + featuredItems.length) % featuredItems.length;
      renderPublicHeroV2();
    }
    return;
  }

  const publicFeaturedDot = event.target.closest("[data-public-featured-dot]");
  if (publicFeaturedDot) {
    event.preventDefault();
    event.stopPropagation();
    state.publicHeroIndex = Number(publicFeaturedDot.dataset.publicFeaturedDot);
    renderPublicHeroV2();
    return;
  }

  const publicPropertyTrigger = event.target.closest("[data-public-property]");
  if (publicPropertyTrigger && !event.target.closest("a")) {
    event.preventDefault();
    renderPublicPropertyDetail(publicPropertyTrigger.dataset.publicProperty);
    return;
  }

  if (event.target.closest("[data-close-public-property]")) {
    document.querySelector("#public-property-modal").hidden = true;
    return;
  }

});

window.addEventListener("hashchange", () => {
  if (!state.authenticated) setPublicPage(publicPageFromHash());
});

document.querySelectorAll("[data-view-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (!state.authenticated) {
      openLogin();
      return;
    }
    setView(link.dataset.viewLink);
  });
});

document.querySelectorAll("[data-form-tab]").forEach((button) => {
  button.addEventListener("click", () => setForm(button.dataset.formTab));
});

document.querySelector("[data-scroll-target]").addEventListener("click", () => {
  setView("cadastro");
  setForm("property");
  document.querySelector("#property-form").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-collapse-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(`#${button.dataset.collapseTarget}`);
    if (!target) return;
    target.hidden = !target.hidden;
    button.classList.toggle("active", !target.hidden);
  });
});

document.querySelector("#property-form [name='type']").addEventListener("change", () => {
  renderPropertySubtypeOptions();
});

function updateContractTypeFields() {
  const form = document.querySelector("#contract-form");
  if (!form) return;
  const type = form.querySelector("[name='type']").value;
  form.querySelectorAll("[data-contract-field]").forEach((field) => {
    field.hidden = field.dataset.contractField !== normalize(type);
  });
  form.querySelectorAll("[data-contract-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.contractTab === type);
  });
  if (type !== "Locacao") {
    const toggle = form.querySelector("[data-guarantor-toggle]");
    if (toggle) toggle.value = "Nao";
  }
  updateGuarantorFields();
}

function updateGuarantorFields() {
  const form = document.querySelector("#contract-form");
  if (!form) return;
  const type = form.querySelector("[name='type']").value;
  const toggle = form.querySelector("[data-guarantor-toggle]");
  const fields = form.querySelector("[data-guarantor-fields]");
  if (!toggle || !fields) return;
  fields.hidden = type !== "Locacao" || toggle.value !== "Sim";
}

document.querySelectorAll("[data-contract-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const form = document.querySelector("#contract-form");
    form.querySelector("[name='type']").value = button.dataset.contractTab;
    updateContractTypeFields();
    syncContractValueFromProperty();
  });
});

document.querySelector("[data-guarantor-toggle]")?.addEventListener("change", updateGuarantorFields);

document.querySelectorAll("[data-contract-type-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.contractType = button.dataset.contractTypeFilter;
    renderContractList();
  });
});

document.querySelectorAll("[data-contract-status-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.contractStatus = button.dataset.contractStatusFilter;
    renderContractList();
  });
});

document.querySelector("[data-contract-period-filter]")?.addEventListener("change", (event) => {
  state.filters.contractPeriod = event.target.value;
  renderContractList();
});

document.querySelectorAll("[data-appointment-type-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.appointmentType = button.dataset.appointmentTypeFilter;
    renderAppointments();
  });
});

document.querySelectorAll("[data-appointment-status-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.appointmentStatus = button.dataset.appointmentStatusFilter;
    renderAppointments();
  });
});

document.querySelector("[data-appointment-period-filter]")?.addEventListener("change", (event) => {
  state.filters.appointmentPeriod = event.target.value;
  renderAppointments();
});

document.querySelectorAll("[data-invoice-type-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.invoiceType = button.dataset.invoiceTypeFilter;
    renderInvoices();
  });
});

document.querySelectorAll("[data-invoice-status-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.invoiceStatus = button.dataset.invoiceStatusFilter;
    renderInvoices();
  });
});

document.querySelector("[data-invoice-period-filter]")?.addEventListener("change", (event) => {
  state.filters.invoicePeriod = event.target.value;
  renderInvoices();
});

document.querySelectorAll("[data-invoice-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-invoice-tab]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.invoiceTab === button.dataset.invoiceTab);
    });
    document.querySelectorAll("[data-invoice-form]").forEach((form) => {
      form.classList.toggle("active", form.dataset.invoiceForm === button.dataset.invoiceTab);
    });
  });
});

function syncLeaseInvoiceFromContract() {
  const form = document.querySelector("[data-invoice-form='Locacao']");
  if (!form) return;
  const contract = findContract(form.querySelector("[name='contractId']")?.value);
  if (!contract) return;
  const client = findClient(contract.clientId);
  form.querySelector("[name='clientId']").value = contract.clientId || "";
  form.querySelector("[name='propertyId']").value = contract.propertyId || "";
  form.querySelector("[name='amount']").value = contract.monthlyValue || contract.amount || "";
  form.querySelector("[name='contractEndReference']").value = monthValue(contractDueDate(contract));
  form.querySelector("[name='reference']").value = monthValue(new Date().toISOString());
  if (!form.querySelector("[name='whatsappTo']").value) form.querySelector("[name='whatsappTo']").value = client?.contact1 || "";
}

function syncSaleInvoiceFromContract() {
  const form = document.querySelector("[data-invoice-form='Compra']");
  if (!form) return;
  const contract = findContract(form.querySelector("[name='contractId']")?.value);
  if (!contract) return;
  form.querySelector("[name='clientId']").value = contract.clientId || "";
  form.querySelector("[name='propertyId']").value = contract.propertyId || "";
  form.querySelector("[name='saleTotal']").value = contract.negotiatedValue || contract.amount || "";
  form.querySelector("[name='downPayment']").value = contract.downPayment || "";
}

function syncContractValueFromProperty(force = true) {
  const form = document.querySelector("#contract-form");
  if (!form) return;
  const property = findProperty(form.querySelector("[name='propertyId']")?.value);
  if (!property) return;
  const net = propertyNetValue(property);
  const type = form.querySelector("[name='type']")?.value;
  if (type === "Locacao") {
    const monthly = form.querySelector("[name='monthlyValue']");
    if (monthly && (force || !monthly.value)) monthly.value = net || "";
  } else if (type === "Compra") {
    const total = form.querySelector("[name='negotiatedValue']");
    if (total && (force || !total.value)) total.value = net || "";
  } else if (type === "Avulso") {
    const oneOff = form.querySelector("[name='oneOffValue']");
    if (oneOff && (force || !oneOff.value)) oneOff.value = net || "";
  }
}

document.querySelector("[data-invoice-form='Locacao'] [name='contractId']")?.addEventListener("change", syncLeaseInvoiceFromContract);
document.querySelector("[data-invoice-form='Compra'] [name='contractId']")?.addEventListener("change", syncSaleInvoiceFromContract);
document.querySelector("#contract-form [name='propertyId']")?.addEventListener("change", syncContractValueFromProperty);

document.querySelector("#property-form [name='photos']").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  updateFileLabels("#photo-preview", state.selectedPropertyPhotos);
  const files = await readFiles(input, 8, true);
  state.selectedPropertyPhotos = [...state.selectedPropertyPhotos, ...files].slice(0, 8);
  renderImagePreview("#photo-preview", state.selectedPropertyPhotos);
  input.value = "";
});

document.querySelector("#property-form [name='documents']").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  updateFileLabels("#property-document-preview", state.selectedPropertyDocs);
  const files = await readFiles(input, 5);
  state.selectedPropertyDocs = [...state.selectedPropertyDocs, ...files];
  renderFilePreview("#property-document-preview", state.selectedPropertyDocs);
  input.value = "";
});

document.querySelector("#client-form [name='photo']").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  updateFileLabels("#client-photo-preview", state.selectedClientPhotos);
  const files = await readFiles(input, 8, true);
  state.selectedClientPhotos = [...state.selectedClientPhotos, ...files].slice(0, 8);
  state.selectedClientPhoto = state.selectedClientPhotos[0] || null;
  state.selectedClientCrop = { zoom: 1, x: 50, y: 50 };
  document.querySelector("#client-crop-fields").hidden = true;
  document.querySelector("[data-collapse-target='client-crop-fields']").classList.remove("active");
  renderClientPhotoPreview();
  input.value = "";
});

document.querySelectorAll("#client-crop-controls input").forEach((input) => {
  input.addEventListener("input", () => {
    state.selectedClientCrop = {
      zoom: Number(document.querySelector("#client-crop-controls [name='cropZoom']").value),
      x: Number(document.querySelector("#client-crop-controls [name='cropX']").value),
      y: Number(document.querySelector("#client-crop-controls [name='cropY']").value),
    };
    renderClientPhotoPreview();
  });
});

document.querySelector("#owner-form [name='photo']").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  const files = await readFiles(input, 1, true);
  state.selectedOwnerPhoto = files[0] || null;
  state.selectedOwnerCrop = { zoom: 1, x: 50, y: 50 };
  document.querySelector("#owner-crop-fields").hidden = true;
  document.querySelector("[data-collapse-target='owner-crop-fields']").classList.remove("active");
  renderOwnerPhotoPreview();
  input.value = "";
});

document.querySelectorAll("#owner-crop-controls input").forEach((input) => {
  input.addEventListener("input", () => {
    state.selectedOwnerCrop = {
      zoom: Number(document.querySelector("#owner-crop-controls [name='cropZoom']").value),
      x: Number(document.querySelector("#owner-crop-controls [name='cropX']").value),
      y: Number(document.querySelector("#owner-crop-controls [name='cropY']").value),
    };
    renderOwnerPhotoPreview();
  });
});

document.querySelector("#client-form [name='documents']").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  updateFileLabels("#client-document-preview", state.selectedClientDocs);
  const files = await readFiles(input, 5);
  state.selectedClientDocs = [...state.selectedClientDocs, ...files];
  renderFilePreview("#client-document-preview", state.selectedClientDocs);
  input.value = "";
});

document.querySelector("#owner-form [name='documents']").addEventListener("change", async (event) => {
  const input = event.currentTarget;
  updateFileLabels("#owner-document-preview", state.selectedOwnerDocs);
  const files = await readFiles(input, 5);
  state.selectedOwnerDocs = [...state.selectedOwnerDocs, ...files];
  renderFilePreview("#owner-document-preview", state.selectedOwnerDocs);
  input.value = "";
});

document.querySelector("[data-guarantor-document-upload]")?.addEventListener("change", async (event) => {
  const input = event.currentTarget;
  updateFileLabels("#guarantor-document-preview", state.selectedGuarantorDocs);
  const files = await readFiles(input, 5);
  state.selectedGuarantorDocs = [...state.selectedGuarantorDocs, ...files];
  renderFilePreview("#guarantor-document-preview", state.selectedGuarantorDocs);
  input.value = "";
});

document.querySelector("#property-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePermission("Cadastros", "cadastrar imovel")) return;
  updateFileLabels("#photo-preview", state.selectedPropertyPhotos);
  updateFileLabels("#property-document-preview", state.selectedPropertyDocs);
  const property = collectForm(event.currentTarget);
  delete property.photos;
  delete property.documents;
  property.id = createId("property");
  property.available = true;
  property.featured = false;
  property.price = property.netValue || property.grossValue || "";
  property.photos = [...state.selectedPropertyPhotos];
  property.documents = [...state.selectedPropertyDocs];
  state.properties.unshift(property);
  if (!saveAll()) {
    state.properties.shift();
    return;
  }
  event.currentTarget.reset();
  state.selectedPropertyPhotos = [];
  state.selectedPropertyDocs = [];
  renderImagePreview("#photo-preview", []);
  renderFilePreview("#property-document-preview", []);
  render();
  showToast("Imovel cadastrado com sucesso.");
});

document.querySelector("#client-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePermission("Clientes", "cadastrar cliente")) return;
  updateFileLabels("#client-document-preview", state.selectedClientDocs);
  updateFileLabels("#client-photo-preview", state.selectedClientPhotos);
  const client = collectForm(event.currentTarget);
  delete client.photo;
  delete client.documents;
  delete client.cropZoom;
  delete client.cropX;
  delete client.cropY;
  client.id = createId("client");
  client.photos = [...state.selectedClientPhotos];
  client.photo = client.photos[0] || null;
  client.crop = { ...state.selectedClientCrop };
  client.documents = [...state.selectedClientDocs];
  state.clients.unshift(client);
  if (!saveAll()) {
    state.clients.shift();
    return;
  }
  event.currentTarget.reset();
  state.selectedClientPhoto = null;
  state.selectedClientPhotos = [];
  state.selectedClientDocs = [];
  state.selectedClientCrop = { zoom: 1, x: 50, y: 50 };
  renderClientPhotoPreview();
  renderFilePreview("#client-document-preview", []);
  render();
  showToast("Cliente cadastrado com sucesso.");
});

document.querySelector("#owner-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePermission("Cadastros", "cadastrar proprietario")) return;
  updateFileLabels("#owner-document-preview", state.selectedOwnerDocs);
  const owner = collectForm(event.currentTarget);
  delete owner.documents;
  delete owner.photo;
  delete owner.cropZoom;
  delete owner.cropX;
  delete owner.cropY;
  owner.id = createId("owner");
  owner.photo = state.selectedOwnerPhoto;
  owner.crop = { ...state.selectedOwnerCrop };
  owner.documents = [...state.selectedOwnerDocs];
  state.owners.unshift(owner);
  if (!saveAll()) {
    state.owners.shift();
    return;
  }
  event.currentTarget.reset();
  state.selectedOwnerDocs = [];
  state.selectedOwnerPhoto = null;
  state.selectedOwnerCrop = { zoom: 1, x: 50, y: 50 };
  renderFilePreview("#owner-document-preview", []);
  renderOwnerPhotoPreview();
  render();
  showToast("Proprietario cadastrado com sucesso.");
});

function saveTeamFromForm(form) {
  if (!canManageUsers()) {
    showToast("Somente administrador pode alterar usuarios e permissoes.");
    return;
  }
  const data = collectForm(form);
  const permissions = Array.isArray(data.permissions) ? data.permissions : data.permissions ? [data.permissions] : [];
  const existing = state.team.find((member) => member.id === data.teamId);
  const payload = {
    id: data.teamId || createId("team"),
    name: data.name,
    role: data.role,
    email: data.email,
    phone: data.phone,
    accessLevel: data.accessLevel,
    status: data.status,
    permissions,
    password: existing?.password || "",
    passwordSet: Boolean(existing?.passwordSet),
    resetRequested: false,
    passwordResetAuthorized: false,
    notes: data.notes,
  };

  if (existing) {
    Object.assign(existing, payload);
  } else {
    state.team.unshift(payload);
  }

  if (!saveAll()) {
    if (!existing) state.team.shift();
    return;
  }

  resetTeamForm();
  render();
  showToast(existing ? "Membro da equipe atualizado." : "Membro da equipe cadastrado.");
}

document.querySelector("#team-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveTeamFromForm(event.currentTarget);
});

document.addEventListener("submit", (event) => {
  const settingsTeamForm = event.target.closest("#settings-team-form");
  if (!settingsTeamForm) return;
  event.preventDefault();
  saveTeamFromForm(settingsTeamForm);
  openSettingsTool("users");
});

document.addEventListener("change", (event) => {
  const backupInput = event.target.closest("[data-restore-backup]");
  if (backupInput) {
    if (!isAdmin()) {
      showToast("Somente administrador pode restaurar backup.");
      backupInput.value = "";
      return;
    }
    const file = backupInput.files?.[0];
    if (file) restoreBackupFile(file);
    backupInput.value = "";
    return;
  }

  const accessLevel = event.target.closest("#settings-team-form [name='accessLevel'], #team-form [name='accessLevel']");
  if (!accessLevel) return;
  const form = accessLevel.closest("form");
  const defaults = accessDescriptions[accessLevel.value]?.defaultPermissions || [];
  form.querySelectorAll('[name="permissions"]').forEach((checkbox) => {
    checkbox.checked = defaults.includes(checkbox.value);
  });
});

document.querySelector("#appointment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!requirePermission("Agendamentos", "salvar agendamento")) return;
  const data = collectForm(event.currentTarget);
  state.appointments.unshift({
    id: createId("appointment"),
    type: data.type,
    propertyId: data.propertyId,
    clientId: data.clientId,
    responsible: data.responsible,
    date: data.date,
    time: data.time,
    status: data.status,
    notes: data.notes,
    createdAt: new Date().toISOString(),
  });

  if (!saveAll()) {
    state.appointments.shift();
    return;
  }
  event.currentTarget.reset();
  render();
  showToast("Agendamento salvo.");
});

document.querySelectorAll("[data-invoice-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!requirePermission("Faturas", "emitir fatura")) return;
    const data = collectForm(event.currentTarget);
    const contract = findContract(data.contractId);
    const client = findClient(data.clientId);
    const property = findProperty(data.propertyId);
    const details = [
      data.reference ? `Referencia: ${data.reference}` : "",
      data.installment ? `Parcela: ${data.installment}` : "",
      data.installmentCount ? `Parcelas: ${data.installmentCount}` : "",
      data.downPayment ? `Entrada: ${formatter.format(Number(data.downPayment || 0))}` : "",
      data.interestRate ? `Juros: ${data.interestRate}%` : "",
      data.chargeType ? `Tipo: ${data.chargeType}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
    const whatsappMessage = fillContractTemplate(state.company.whatsapp?.message || "", {
      empresa_nome: state.company.name || "Imobiliaria",
      cliente_nome: client?.name || "Cliente",
      categoria: data.category,
      valor: formatter.format(Number(data.amount || data.saleTotal || 0)),
      vencimento: formatDate(data.dueDate) || data.dueDate || "",
      imovel_titulo: property?.title || "",
    });
    let createdInvoices = [];
    const now = new Date().toISOString();

    if (data.category === "Locacao" && contract?.id) {
      const hasOpenBooklet = state.invoices.some((invoice) => invoice.category === data.category && invoice.contractId === contract.id && invoiceComputedStatus(invoice) !== "Inativa");
      if (hasOpenBooklet) {
        showToast("Ja existe um carne ativo para este contrato.");
        return;
      }

      const total = Math.max(1, Number(contract.termMonths || 1));
      const bookletId = createId("booklet");
      const startReference = data.reference || monthValue(data.dueDate) || monthValue(now);
      const finalReference = addMonthsToMonth(startReference, total - 1) || data.contractEndReference || monthValue(contractDueDate(contract));
      createdInvoices = Array.from({ length: total }, (_, index) => ({
        id: createId("invoice"),
        category: data.category,
        contractId: data.contractId || "",
        clientId: data.clientId,
        propertyId: data.propertyId || "",
        amount: data.amount,
        dueDate: addMonthsToDate(data.dueDate, index),
        status: index === 0 ? data.status : "Aguardando",
        paidAt: index === 0 && data.status === "Paga" ? now : "",
        description: [details, data.description].filter(Boolean).join(" - "),
        reference: addMonthsToMonth(startReference, index),
        contractEndReference: finalReference,
        recurring: "Mensal",
        bookletId,
        installmentNumber: index + 1,
        installmentTotal: total,
        releaseStatus: index === 0 ? "Disponivel" : "Aguardando",
        whatsappTo: data.whatsappTo || "",
        whatsappReminderDays: 3,
        whatsappSender: state.company.whatsapp?.sender || "",
        whatsappMessage,
        installment: `${index + 1}/${total}`,
        chargeType: "",
        createdAt: now,
      }));

      if (createdInvoices[0]?.status === "Paga" && createdInvoices[1]) {
        createdInvoices[1].status = "Aberta";
        createdInvoices[1].releaseStatus = "Disponivel";
      }
    } else if (data.category === "Compra" && contract?.id) {
      const hasOpenBooklet = state.invoices.some((invoice) => invoice.category === data.category && invoice.contractId === contract.id && invoiceComputedStatus(invoice) !== "Inativa");
      if (hasOpenBooklet) {
        showToast("Ja existe um carne ativo para este contrato.");
        return;
      }

      const saleTotal = Number(data.saleTotal || contract.negotiatedValue || contract.amount || 0);
      const downPayment = Math.min(Number(data.downPayment || 0), saleTotal);
      const installmentCount = Math.max(1, Number(data.installmentCount || 1));
      const interestRate = Math.max(0, Number(data.interestRate || 0));
      const financedBase = Math.max(0, saleTotal - downPayment);
      const financedTotal = financedBase * (1 + interestRate / 100);
      const installmentAmount = installmentCount ? financedTotal / installmentCount : 0;
      const hasDownPayment = downPayment > 0;
      const hasInstallments = installmentAmount > 0;
      const invoiceTotal = (hasDownPayment ? 1 : 0) + (hasInstallments ? installmentCount : 0);

      if (!saleTotal || !invoiceTotal) {
        showToast("Informe um contrato com valor total valido.");
        return;
      }

      const bookletId = createId("booklet");
      const startReference = monthValue(data.dueDate) || monthValue(now);
      const finalReference = addMonthsToMonth(startReference, invoiceTotal - 1);
      const saleMeta = {
        category: data.category,
        contractId: data.contractId || "",
        clientId: data.clientId,
        propertyId: data.propertyId || "",
        description: [details, data.description].filter(Boolean).join(" - "),
        recurring: "Mensal",
        bookletId,
        installmentTotal: invoiceTotal,
        whatsappTo: "",
        whatsappReminderDays: "",
        whatsappSender: state.company.whatsapp?.sender || "",
        whatsappMessage,
        saleTotal: String(saleTotal),
        downPayment: String(downPayment),
        interestRate: String(interestRate),
        financedTotal: String(financedTotal.toFixed(2)),
        createdAt: now,
      };

      if (hasDownPayment) {
        createdInvoices.push({
          id: createId("invoice"),
          ...saleMeta,
          amount: String(downPayment.toFixed(2)),
          dueDate: data.dueDate,
          status: data.status,
          paidAt: data.status === "Paga" ? now : "",
          reference: startReference,
          contractEndReference: finalReference,
          installmentNumber: 1,
          releaseStatus: "Disponivel",
          installment: "Entrada",
          chargeType: "Entrada da venda",
        });
      }

      if (hasInstallments) {
        Array.from({ length: installmentCount }, (_, index) => {
          const invoiceIndex = createdInvoices.length;
          const isFirstInvoice = invoiceIndex === 0;
          createdInvoices.push({
            id: createId("invoice"),
            ...saleMeta,
            amount: String(installmentAmount.toFixed(2)),
            dueDate: addMonthsToDate(data.dueDate, hasDownPayment ? index + 1 : index),
            status: isFirstInvoice ? data.status : "Aguardando",
            paidAt: isFirstInvoice && data.status === "Paga" ? now : "",
            reference: addMonthsToMonth(startReference, hasDownPayment ? index + 1 : index),
            contractEndReference: finalReference,
            installmentNumber: invoiceIndex + 1,
            releaseStatus: isFirstInvoice ? "Disponivel" : "Aguardando",
            installment: `${index + 1}/${installmentCount}`,
            chargeType: "Parcela de venda",
          });
        });
      }

      if (createdInvoices[0]?.status === "Paga" && createdInvoices[1]) {
        createdInvoices[1].status = "Aberta";
        createdInvoices[1].releaseStatus = "Disponivel";
      }
    } else {
      createdInvoices = [
        {
          id: createId("invoice"),
          category: data.category,
          contractId: data.contractId || "",
          clientId: data.clientId,
          propertyId: data.propertyId || "",
          amount: data.amount,
          dueDate: data.dueDate,
          status: data.status,
          paidAt: data.status === "Paga" ? now : "",
          description: [details, data.description].filter(Boolean).join(" - "),
          reference: data.reference || "",
          contractEndReference: data.contractEndReference || (contract ? monthValue(contractDueDate(contract)) : ""),
          recurring: data.category === "Locacao" ? "Mensal" : "",
          bookletId: ["Locacao", "Compra"].includes(data.category) ? createId("booklet") : "",
          installmentNumber: 1,
          installmentTotal: 1,
          releaseStatus: "Disponivel",
          whatsappTo: data.whatsappTo || "",
          whatsappReminderDays: data.category === "Locacao" ? 3 : "",
          whatsappSender: state.company.whatsapp?.sender || "",
          whatsappMessage,
          installment: data.category === "Compra" ? "1/1" : data.installment || "",
          chargeType: data.chargeType || "",
          createdAt: now,
        },
      ];
    }

    state.invoices.unshift(...createdInvoices);

    if (!saveAll()) {
      state.invoices.splice(0, createdInvoices.length);
      return;
    }
    event.currentTarget.reset();
    render();
    showToast(createdInvoices.length > 1 ? `Carne gerado com ${createdInvoices.length} faturas.` : "Fatura emitida.");
  });
});

document.querySelector("#contract-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canEditEntity("contract")) {
    showToast("Somente administrador ou gerente com permissao de contratos pode emitir contrato.");
    return;
  }
  updateFileLabels("#guarantor-document-preview", state.selectedGuarantorDocs);
  const data = collectForm(event.currentTarget);
  const property = findProperty(data.propertyId);
  const existingActiveContract = state.contracts.find(
    (contract) => contract.propertyId === data.propertyId && contractComputedStatus(contract) !== "Inativo",
  );

  if (existingActiveContract) {
    showToast("Este imovel ja possui um contrato ativo.");
    return;
  }

  const issuedAt = new Date().toISOString();
  const liquidValue = propertyNetValue(property);
  const amount =
    data.type === "Locacao"
      ? data.monthlyValue || liquidValue
      : data.type === "Avulso"
        ? data.oneOffValue || liquidValue
        : data.negotiatedValue || liquidValue;
  const issuedDate = new Date(issuedAt);
  issuedDate.setMonth(issuedDate.getMonth() + Number(data.termMonths || 0));
  const dueDate = data.type === "Locacao" ? issuedDate.toISOString().slice(0, 10) : data.type === "Avulso" ? data.seasonEnd || "" : "";
  const hasGuarantor = data.type === "Locacao" && data.hasGuarantor === "Sim";
  const guarantor = hasGuarantor
    ? {
        name: data.guarantorName || "",
        cpf: data.guarantorCpf || "",
        contact1Name: data.guarantorContact1Name || "",
        contact1: data.guarantorContact1 || "",
        contact2Name: data.guarantorContact2Name || "",
        contact2: data.guarantorContact2 || "",
        income: data.guarantorIncome || "",
        address: data.guarantorAddress || "",
        notes: data.guarantorNotes || "",
        documents: [...state.selectedGuarantorDocs],
      }
    : null;

  state.contracts.unshift({
    id: createId("contract"),
    propertyId: data.propertyId,
    clientId: data.clientId,
    type: data.type,
    payerRole: data.type === "Compra" ? "Comprador" : data.type === "Avulso" ? "Cliente" : "Inquilino",
    amount,
    monthlyValue: data.type === "Locacao" ? amount : "",
    negotiatedValue: data.type === "Compra" ? amount : "",
    oneOffValue: data.type === "Avulso" ? amount : "",
    downPayment: data.type === "Compra" ? data.downPayment : "",
    securityDeposit: data.type === "Locacao" ? data.securityDeposit : "",
    seasonStart: data.type === "Avulso" ? data.seasonStart : "",
    seasonEnd: data.type === "Avulso" ? data.seasonEnd : "",
    seasonCategory: data.type === "Avulso" ? data.seasonCategory || "Temporada" : "",
    hasGuarantor: hasGuarantor ? "Sim" : "Nao",
    guarantor,
    termMonths: data.type === "Locacao" ? data.termMonths : "",
    paymentMode: "",
    installments: "",
    dueDate,
    status: "Ativo",
    notes: data.notes,
    issuedAt,
    createdAt: issuedAt,
  });

  if (property) {
    property.available = false;
  }

  if (!saveAll()) {
    state.contracts.shift();
    if (property) {
      property.available = true;
    }
    return;
  }
  event.currentTarget.reset();
  state.selectedGuarantorDocs = [];
  renderFilePreview("#guarantor-document-preview", []);
  updateContractTypeFields();
  render();
  showToast("Contrato emitido e imovel marcado como indisponivel.");
});

document.querySelectorAll("[data-filter]").forEach((input) => {
  const updateFilter = () => {
    state.filters[input.dataset.filter] = input.value;
    render();
  };
  input.addEventListener("input", updateFilter);
  input.addEventListener("change", updateFilter);
});

document.addEventListener("click", (event) => {
  const editTeamButton = event.target.closest("[data-edit-team]");
  if (editTeamButton) {
    if (!canManageUsers()) {
      showToast("Somente administrador pode editar usuarios.");
      return;
    }
    const member = state.team.find((item) => item.id === editTeamButton.dataset.editTeam);
    fillTeamForm(member);
    return;
  }

  const deleteTeamButton = event.target.closest("[data-delete-team]");
  if (deleteTeamButton) {
    if (!canManageUsers()) {
      showToast("Somente administrador pode remover usuarios.");
      return;
    }
    const member = state.team.find((item) => item.id === deleteTeamButton.dataset.deleteTeam);
    if (!member) return;
    const confirmed = window.confirm(`Remover o acesso de ${member.name}? O registro ficara na lixeira.`);
    if (!confirmed) return;
    moveToTrash("team", member.id);
    resetTeamForm();
    renderTeam();
    showToast("Acesso removido e enviado para a lixeira.");
    return;
  }

  if (event.target.matches("[data-team-cancel]")) {
    resetTeamForm();
    return;
  }

  const payInvoiceButton = event.target.closest("[data-pay-invoice]");
  if (payInvoiceButton) {
    if (!requirePermission("Faturas", "registrar pagamento")) return;
    const invoice = state.invoices.find((item) => item.id === payInvoiceButton.dataset.payInvoice);
    if (!invoice || invoiceComputedStatus(invoice) === "Inativa" || invoiceComputedStatus(invoice) === "Aguardando") return;
    invoice.status = "Paga";
    invoice.paidAt = new Date().toISOString();
    const releasedNext = releaseNextBookletInvoice(invoice);
    saveAll();
    render();
    if (state.activeProfile?.type === "invoice") renderProfile();
    showToast(releasedNext ? "Pagamento registrado. Proxima fatura liberada." : "Pagamento registrado.");
    return;
  }

  const completeAppointmentButton = event.target.closest("[data-complete-appointment]");
  if (completeAppointmentButton) {
    if (!requirePermission("Agendamentos", "concluir agendamento")) return;
    const appointment = state.appointments.find((item) => item.id === completeAppointmentButton.dataset.completeAppointment);
    if (!appointment) return;
    appointment.status = "Concluido";
    saveAll();
    render();
    state.activeProfile = { type: "appointment", id: appointment.id };
    renderProfile();
    showToast("Agendamento concluido.");
    return;
  }

  const settingsTool = event.target.closest("[data-settings-tool]");
  if (settingsTool) {
    if (!canUseSettingsTool(settingsTool.dataset.settingsTool)) {
      showToast("Seu usuario nao tem permissao para esta configuracao.");
      return;
    }
    openSettingsTool(settingsTool.dataset.settingsTool);
    return;
  }

  if (event.target.matches("[data-restore-default-templates]")) {
    if (!isAdmin()) {
      showToast("Somente administrador pode restaurar modelos padrao.");
      return;
    }
    state.company.contractTemplates = defaultContractTemplates();
    saveAll();
    openSettingsTool("invoices");
    showToast("Modelos padrao restaurados.");
    return;
  }

  if (event.target.matches("[data-open-contract-settings]")) {
    openSettingsTool("invoices");
    return;
  }

  const renewButton = event.target.closest("[data-renew-contract]");
  if (renewButton) {
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para renovar contratos.");
      return;
    }
    renderRenewContractForm(renewButton.dataset.renewContract);
    return;
  }

  const signButton = event.target.closest("[data-sign-contract]");
  if (signButton) {
    event.preventDefault();
    event.stopPropagation();
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para assinar contratos.");
      return;
    }
    renderContractSignatureForm(signButton.dataset.signContract);
    return;
  }

  const rescindButton = event.target.closest("[data-rescind-contract]");
  if (rescindButton) {
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para rescindir contratos.");
      return;
    }
    renderRescindContractForm(rescindButton.dataset.rescindContract);
    return;
  }

  const rescissionModelButton = event.target.closest("[data-rescission-model-editor]");
  if (rescissionModelButton) {
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para editar modelo de distrato.");
      return;
    }
    renderRescissionModelEditor(rescissionModelButton.dataset.rescissionModelEditor);
    return;
  }

  const rescissionDraftButton = event.target.closest("[data-download-rescission-draft]");
  if (rescissionDraftButton) {
    if (!hasPermission("Contratos")) {
      showToast("Seu usuario nao tem permissao para baixar contratos.");
      return;
    }
    downloadContractPdf(rescissionDraftButton.dataset.downloadRescissionDraft, "rescission");
    return;
  }

  const downloadContractButton = event.target.closest("[data-download-contract]");
  if (downloadContractButton) {
    event.preventDefault();
    event.stopPropagation();
    if (!hasPermission("Contratos")) {
      showToast("Seu usuario nao tem permissao para baixar contratos.");
      return;
    }
    downloadContractPdf(downloadContractButton.dataset.downloadContract);
    return;
  }

  const downloadInvoiceButton = event.target.closest("[data-download-invoice]");
  if (downloadInvoiceButton) {
    event.preventDefault();
    event.stopPropagation();
    if (!hasPermission("Faturas")) {
      showToast("Seu usuario nao tem permissao para baixar faturas.");
      return;
    }
    downloadInvoicePdf(downloadInvoiceButton.dataset.downloadInvoice);
    return;
  }

  const downloadInvoiceBookletButton = event.target.closest("[data-download-invoice-booklet]");
  if (downloadInvoiceBookletButton) {
    event.preventDefault();
    event.stopPropagation();
    if (!hasPermission("Faturas")) {
      showToast("Seu usuario nao tem permissao para baixar carnes.");
      return;
    }
    downloadInvoiceBookletPdf(downloadInvoiceBookletButton.dataset.downloadInvoiceBooklet);
    return;
  }

  const openContractDocument = event.target.closest("[data-open-contract-document]");
  if (openContractDocument) {
    renderContractDocumentViewer(openContractDocument.dataset.openContractDocument);
    return;
  }

  const contractModelEditor = event.target.closest("[data-contract-model-editor]");
  if (contractModelEditor) {
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para editar modelos de contrato.");
      return;
    }
    const contract = findContract(contractModelEditor.dataset.contractModelEditor);
    if (contract?.signed) {
      showToast("Contrato assinado nao pode ser modificado.");
      return;
    }
    renderContractModelEditor(contractModelEditor.dataset.contractModelEditor);
    return;
  }

  const backContractProfile = event.target.closest("[data-back-contract-profile]");
  if (backContractProfile) {
    state.activeProfile = { type: "contract", id: backContractProfile.dataset.backContractProfile };
    renderProfile();
    return;
  }

  const card = event.target.closest("[data-profile-type][data-profile-id]");
  if (card) {
    openProfile(card.dataset.profileType, card.dataset.profileId);
    return;
  }

  if (event.target.matches("[data-close-modal]")) {
    closeProfile();
    return;
  }

  if (event.target.matches("[data-edit-profile]")) {
    if (!requireEntityEdit(state.activeProfile?.type)) return;
    renderProfile("edit");
    return;
  }

  if (event.target.matches("[data-cancel-edit]")) {
    renderProfile();
    return;
  }

  const featuredToggle = event.target.closest("[data-featured-toggle]");
  if (featuredToggle && state.activeProfile?.type === "property") {
    if (!requireEntityEdit("property")) return;
    const property = activeEntity();
    property.featured = !property.featured;
    saveAll();
    render();
    renderProfile();
    showToast(property.featured ? "Imovel marcado como destaque da Home." : "Imovel removido dos destaques da Home.");
    return;
  }

  const deleteButton = event.target.closest("[data-delete-entity]");
  if (deleteButton && state.activeProfile) {
    const { type, id } = state.activeProfile;
    const entity = activeEntity();
    if (!canDeleteEntity(type)) {
      showToast("Seu usuario nao tem permissao para excluir registros.");
      return;
    }
    if (type === "contract" && entity?.signed) {
      showToast("Contrato assinado nao pode ser excluido. Use rescindir contrato.");
      return;
    }
    if (moveToTrash(type, id)) {
      closeProfile();
      showToast(`${entityLabel(type)} enviado para a lixeira.`);
    }
    return;
  }

  const restoreButton = event.target.closest("[data-restore-trash]");
  if (restoreButton) {
    if (!isAdmin()) {
      showToast("Somente administrador pode restaurar itens da lixeira.");
      return;
    }
    if (restoreFromTrash(restoreButton.dataset.restoreTrash)) {
      openSettingsTool("trash");
      showToast("Item restaurado.");
    }
    return;
  }

  if (event.target.matches("[data-empty-trash]")) {
    if (!isAdmin()) {
      showToast("Somente administrador pode esvaziar a lixeira.");
      return;
    }
    emptyTrash();
    openSettingsTool("trash");
    showToast("Lixeira esvaziada.");
    return;
  }

  if (event.target.matches("[data-remove-company-logo]")) {
    if (!isAdmin()) {
      showToast("Somente administrador pode remover a logo.");
      return;
    }
    if (!state.company.logo) return;
    const confirmed = window.confirm("Tem certeza que deseja excluir a logo da empresa?");
    if (!confirmed) return;
    if (state.company.logo) {
      addToTrash("company-logo", {
        logo: state.company.logo,
        name: "Logo da empresa",
      });
    }
    state.company.logo = "";
    saveAll();
    applyCompanyBranding();
    openSettingsTool("company");
    showToast("Logo removida.");
    return;
  }

  if (event.target.matches("[data-save-settings]")) {
    showToast("Configuracao salva.");
    return;
  }

  if (event.target.matches("[data-download-backup]")) {
    if (!isAdmin()) {
      showToast("Somente administrador pode baixar backup.");
      return;
    }
    downloadBackup();
    return;
  }

  if (event.target.matches("[data-sync-local-db]")) {
    mirrorToLocalDatabase();
    showToast("Banco local sincronizado.");
    return;
  }

  const removePhotoButton = event.target.closest("[data-remove-photo]");
  if (removePhotoButton && ["property", "client"].includes(state.activeProfile?.type)) {
    if (!requireEntityEdit(state.activeProfile.type)) return;
    const entity = activeEntity();
    const index = Number(removePhotoButton.dataset.removePhoto);
    const photo = entity.photos?.[index];
    if (photo) {
      addToTrash("photo", {
        name: photo.label || photo.name || "Foto",
        photo,
        parentType: state.activeProfile.type,
        parentId: entity.id,
        parentName: entity.title || entity.name || "",
      });
    }
    entity.photos = (entity.photos || []).filter((_, photoIndex) => photoIndex !== index);
    if (state.activeProfile.type === "client") {
      entity.photo = entity.photos[0] || null;
    }
    state.carouselIndex = Math.min(state.carouselIndex, Math.max((entity.photos || []).length - 1, 0));
    saveAll();
    render();
    renderProfile("edit");
    showToast("Foto excluida.");
    return;
  }

  const removeDocumentButton = event.target.closest("[data-remove-document]");
  if (removeDocumentButton) {
    const entity = documentEntity(removeDocumentButton.dataset.documentType, removeDocumentButton.dataset.documentEntity);
    const index = Number(removeDocumentButton.dataset.removeDocument);
    if (entity?.documents?.[index]) {
      const document = entity.documents[index];
      addToTrash("document", {
        name: document.label || document.name || "Documento",
        document,
        parentType: removeDocumentButton.dataset.documentType,
        parentId: removeDocumentButton.dataset.documentEntity || entity.id,
        parentName: entity.title || entity.name || "",
      });
      entity.documents.splice(index, 1);
      saveAll();
      render();
      if (state.activeProfile) renderProfile();
      showToast("Documento excluido.");
    }
    return;
  }

  const tab = event.target.closest("[data-profile-tab]");
  if (tab) {
    state.activeProfileTab = tab.dataset.profileTab;
    renderProfile();
    return;
  }

  const carouselButton = event.target.closest("[data-carousel]");
  if (carouselButton && state.activeProfile?.type === "property") {
    const property = findProperty(state.activeProfile.id);
    const total = property?.photos?.length || 0;
    if (total) {
      state.carouselIndex =
        carouselButton.dataset.carousel === "next"
          ? (state.carouselIndex + 1) % total
          : (state.carouselIndex - 1 + total) % total;
      renderProfile();
    }
    return;
  }

  const carouselDot = event.target.closest("[data-carousel-dot]");
  if (carouselDot && state.activeProfile?.type === "property") {
    state.carouselIndex = Number(carouselDot.dataset.carouselDot);
    renderProfile();
    return;
  }

});

document.addEventListener("change", async (event) => {
  const companyLogoInput = event.target.closest("[data-company-logo-upload]");
  if (companyLogoInput) {
    const files = await readFiles(companyLogoInput, 1, true);
    if (companyLogoInput.dataset.companyLogoUpload === "replace" && state.company.logo) {
      addToTrash("company-logo", {
        logo: state.company.logo,
        name: "Logo da empresa",
      });
    }
    state.company.logo = getPhotoSrc(files[0]) || "";
    saveAll();
    applyCompanyBranding();
    openSettingsTool("company");
    showToast("Logo da empresa atualizada.");
    return;
  }

  if (event.target.matches("[data-theme-choice]")) {
    const theme = event.target.value;
    state.company.theme = theme;
    state.company.colors = { ...themePresets[theme] };
    applyCompanyBranding();
    openSettingsTool("appearance");
    return;
  }

  if (event.target.matches("[data-edit-property-type]")) {
    const form = event.target.closest("[data-edit-form='property']");
    const subtypeSelect = form.querySelector("[data-edit-property-subtype]");
    const options = propertyTypes[event.target.value] || [];
    subtypeSelect.innerHTML = options.map((subtype) => `<option value="${subtype}">${subtype}</option>`).join("");
    return;
  }

  if (event.target.matches("[data-availability-toggle]")) {
    if (!canEditEntity("property")) {
      event.target.checked = !event.target.checked;
      showToast("Seu usuario nao tem permissao para alterar disponibilidade.");
      return;
    }
    const property = activeEntity();
    property.available = event.target.checked;
    saveAll();
    render();
    renderProfile();
    showToast(property.available ? "Imovel marcado como disponivel." : "Imovel marcado como indisponivel.");
    return;
  }

  const signedDocumentInput = event.target.closest("[data-signed-document-upload]");
  if (signedDocumentInput) {
    const preview = document.querySelector("#signed-document-preview");
    const file = signedDocumentInput.files?.[0];
    if (!preview) return;
    if (!file) {
      renderFilePreview("#signed-document-preview", []);
      return;
    }
    if (file.size > 2000000) {
      signedDocumentInput.value = "";
      renderFilePreview("#signed-document-preview", []);
      showToast("Contrato assinado muito grande. Use um arquivo de ate 2 MB.");
      return;
    }
    preview.classList.add("has-files");
    preview.innerHTML = `
      <div class="file-label-row">
        <strong>${escapeHtml(file.name)}</strong>
        <small>${Math.max(1, Math.round(file.size / 1024))} KB selecionado</small>
      </div>
    `;
    return;
  }

  const editPhotoInput = event.target.closest("[data-edit-photo-upload]");
  if (editPhotoInput && ["property", "client"].includes(state.activeProfile?.type)) {
    const entity = activeEntity();
    const files = await readFiles(editPhotoInput, 8, true);
    entity.photos = [...(entity.photos || []), ...files].slice(0, 8);
    if (state.activeProfile.type === "client") {
      entity.photo = entity.photos[0] || null;
    }
    saveAll();
    render();
    renderProfile("edit");
    showToast("Fotos adicionadas.");
    return;
  }

  const docInput = event.target.closest("[data-document-upload]");
  if (docInput && state.activeProfile) {
    const files = await readFiles(docInput, 5);
    const entity = activeEntity();
    entity.documents = [...(entity.documents || []), ...files];
    saveAll();
    render();
    renderProfile();
    showToast("Documento adicionado.");
    return;
  }

  const photoInput = event.target.closest("[data-photo-upload]");
  if (photoInput && state.activeProfile) {
    const files = await readFiles(photoInput, photoInput.dataset.photoUpload === "property" ? 8 : 1, true);
    const entity = activeEntity();

    if (state.activeProfile.type === "property") {
      entity.photos = [...(entity.photos || []), ...files].slice(0, 8);
      state.carouselIndex = 0;
    } else {
      entity.photo = files[0] || entity.photo;
      entity.crop = entity.crop || { zoom: 1, x: 50, y: 50 };
    }

    saveAll();
    render();
    renderProfile();
    showToast("Foto atualizada.");
  }
});

document.addEventListener("input", (event) => {
  const documentLabelInput = event.target.closest("[data-document-label]");
  if (documentLabelInput) {
    const entity = documentEntity(documentLabelInput.dataset.documentType, documentLabelInput.dataset.documentEntity);
    const doc = entity?.documents?.[Number(documentLabelInput.dataset.documentLabel)];
    if (doc) {
      doc.label = documentLabelInput.value;
      saveAll();
    }
    return;
  }

  const photoLabelInput = event.target.closest("[data-edit-photo-label]");
  if (photoLabelInput && ["property", "client"].includes(state.activeProfile?.type)) {
    const entity = activeEntity();
    const photo = entity.photos?.[Number(photoLabelInput.dataset.editPhotoLabel)];
    if (photo) {
      photo.label = photoLabelInput.value;
      saveAll();
      render();
    }
    return;
  }

  const editForm = event.target.closest("[data-edit-form='client']");
  if (editForm && ["cropZoom", "cropX", "cropY"].includes(event.target.name)) {
    const entity = findClient(editForm.dataset.editId);
    entity.crop = {
      zoom: Number(editForm.querySelector("[name='cropZoom']").value),
      x: Number(editForm.querySelector("[name='cropX']").value),
      y: Number(editForm.querySelector("[name='cropY']").value),
    };
    render();
  }
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-photo-index]");
  if (!card || !["property", "client"].includes(state.activeProfile?.type)) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", card.dataset.photoIndex);
  card.classList.add("dragging");
});

document.addEventListener("dragend", (event) => {
  event.target.closest("[data-photo-index]")?.classList.remove("dragging");
});

document.addEventListener("dragover", (event) => {
  const list = event.target.closest("[data-photo-sort-list]");
  if (!list || !["property", "client"].includes(state.activeProfile?.type)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
});

document.addEventListener("drop", (event) => {
  const targetCard = event.target.closest("[data-photo-index]");
  if (!targetCard || !["property", "client"].includes(state.activeProfile?.type)) return;
  event.preventDefault();

  const fromIndex = Number(event.dataTransfer.getData("text/plain"));
  const toIndex = Number(targetCard.dataset.photoIndex);
  const entity = activeEntity();
  const photos = [...(entity.photos || [])];

  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex || !photos[fromIndex]) return;

  const [movedPhoto] = photos.splice(fromIndex, 1);
  photos.splice(toIndex, 0, movedPhoto);
  entity.photos = photos;
  if (state.activeProfile.type === "client") {
    entity.photo = entity.photos[0] || null;
  }
  state.carouselIndex = toIndex;
  saveAll();
  render();
  renderProfile("edit");
  showToast("Ordem das fotos atualizada.");
});

document.addEventListener("submit", async (event) => {
  const rescissionModelForm = event.target.closest("[data-rescission-model-form]");
  if (rescissionModelForm) {
    event.preventDefault();
    const contract = findContract(rescissionModelForm.dataset.rescissionModelForm);
    if (!contract || contract.rescinded) return;
    const data = collectForm(rescissionModelForm);
    contract.rescissionTemplate = {
      title: data.title || defaultRescissionTemplate().title,
      body: data.body || defaultRescissionTemplate().body,
    };
    saveAll();
    renderRescindContractForm(contract.id);
    showToast("Modelo do distrato salvo para este contrato.");
    return;
  }

  const rescindContractForm = event.target.closest("[data-rescind-contract-form]");
  if (rescindContractForm) {
    event.preventDefault();
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para rescindir contratos.");
      return;
    }
    const contract = findContract(rescindContractForm.dataset.rescindContractForm);
    if (!contract || contract.rescinded) return;
    const data = collectForm(rescindContractForm);
    const count = Number(data.signatureCount || 0);
    const signatures = Array.from({ length: count }, (_, index) => ({
      role: data[`role_${index}`],
      name: data[`name_${index}`],
      key: data[`key_${index}`],
      signature: data[`signature_${index}`],
      signedAt: new Date().toISOString(),
    }));
    if (!data.rescissionReason || signatures.some((signature) => !signature.signature)) {
      showToast("Preencha motivo e todas as assinaturas do distrato.");
      return;
    }
    const confirmed = window.confirm("Tem certeza que deseja rescindir este contrato? O contrato ficara inativo e nao sera excluido.");
    if (!confirmed) return;
    contract.rescinded = true;
    contract.rescindedAt = new Date().toISOString();
    contract.rescissionReason = data.rescissionReason;
    contract.rescissionSignatures = signatures;
    contract.inactive = true;
    contract.status = "Inativo";
    saveAll();
    render();
    state.activeProfile = { type: "contract", id: contract.id };
    renderProfile();
    showToast("Contrato rescindido.");
    return;
  }

  const signContractForm = event.target.closest("[data-sign-contract-form]");
  if (signContractForm) {
    event.preventDefault();
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para assinar contratos.");
      return;
    }
    const contract = findContract(signContractForm.dataset.signContractForm);
    if (!contract || contract.signed) return;
    const signedDocumentInput = signContractForm.querySelector('[name="signedDocument"]');
    const signedDocument = signedDocumentInput?.files?.length ? await readSignedContractDocument(signedDocumentInput) : null;
    if (signedDocumentInput?.files?.length && !signedDocument) return;
    if (!signedDocument) {
      showToast("Anexe o contrato assinado para finalizar.");
      return;
    }
    const confirmed = window.confirm("Tem certeza que deseja salvar o contrato assinado? Depois disso o contrato nao podera ser modificado ou excluido.");
    if (!confirmed) return;
    const previous = {
      signed: contract.signed,
      signedAt: contract.signedAt,
      signatures: contract.signatures,
      signedDocument: contract.signedDocument,
    };
    contract.signed = true;
    contract.signedAt = new Date().toISOString();
    contract.signatures = [];
    contract.signedDocument = signedDocument;
    if (!saveAll()) {
      Object.assign(contract, previous);
      return;
    }
    render();
    state.activeProfile = { type: "contract", id: contract.id };
    renderProfile();
    showToast("Contrato assinado.");
    return;
  }

  const contractModelForm = event.target.closest("[data-contract-model-form]");
  if (contractModelForm) {
    event.preventDefault();
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para editar este contrato.");
      return;
    }
    const contract = findContract(contractModelForm.dataset.contractModelForm);
    if (!contract) return;
    const data = collectForm(contractModelForm);
    contract.template = {
      title: data.title || contractTitle(contract),
      body: data.body || "",
    };
    saveAll();
    render();
    renderContractDocumentViewer(contract.id);
    showToast("Modelo salvo somente neste contrato.");
    return;
  }

  const renewContractForm = event.target.closest("[data-renew-contract-form]");
  if (renewContractForm) {
    event.preventDefault();
    if (!canEditEntity("contract")) {
      showToast("Seu usuario nao tem permissao para renovar contratos.");
      return;
    }
    const previous = findContract(renewContractForm.dataset.renewContractForm);
    if (!previous) return;
    const data = collectForm(renewContractForm);
    const issuedAt = new Date().toISOString();
    const issuedDate = new Date(issuedAt);
    issuedDate.setMonth(issuedDate.getMonth() + Number(data.termMonths || 0));
    const hasGuarantor = data.hasGuarantor === "Sim";
    const guarantor = hasGuarantor
      ? {
          name: data.guarantorName || "",
          cpf: data.guarantorCpf || "",
          contact1Name: data.guarantorContact1Name || "",
          contact1: data.guarantorContact1 || "",
          contact2Name: data.guarantorContact2Name || "",
          contact2: data.guarantorContact2 || "",
          income: data.guarantorIncome || "",
          address: data.guarantorAddress || "",
          notes: data.guarantorNotes || "",
          documents: Array.isArray(previous.guarantor?.documents) ? previous.guarantor.documents : [],
        }
      : null;

    previous.inactive = true;
    previous.status = "Inativo";
    previous.inactiveReason = "Renovado";

    const renewed = {
      id: createId("contract"),
      propertyId: data.propertyId,
      clientId: data.clientId,
      type: "Locacao",
      payerRole: "Inquilino",
      amount: data.monthlyValue,
      monthlyValue: data.monthlyValue,
      negotiatedValue: "",
      downPayment: "",
      securityDeposit: data.securityDeposit,
      hasGuarantor: hasGuarantor ? "Sim" : "Nao",
      guarantor,
      termMonths: data.termMonths,
      paymentMode: "",
      installments: "",
      dueDate: issuedDate.toISOString().slice(0, 10),
      status: "Ativo",
      notes: data.notes,
      issuedAt,
      createdAt: issuedAt,
      previousContractId: previous.id,
    };
    previous.renewedBy = renewed.id;
    state.contracts.unshift(renewed);
    saveAll();
    render();
    state.activeProfile = { type: "contract", id: renewed.id };
    renderProfile();
    showToast("Contrato renovado. Versao anterior inativada.");
    return;
  }

  const contractTemplateForm = event.target.closest("[data-contract-template-form]");
  if (contractTemplateForm) {
    event.preventDefault();
    const data = collectForm(contractTemplateForm);
    state.company.contractTemplates = {
      locacao: {
        title: data.locacaoTitle || "CONTRATO PARTICULAR DE LOCACAO DE IMOVEL",
        body: data.locacaoBody || defaultContractTemplates().locacao.body,
      },
      compra: {
        title: data.compraTitle || "CONTRATO PARTICULAR DE COMPRA E VENDA DE IMOVEL",
        body: data.compraBody || defaultContractTemplates().compra.body,
      },
      avulso: {
        title: data.avulsoTitle || "CONTRATO AVULSO DE TEMPORADA",
        body: data.avulsoBody || defaultContractTemplates().avulso.body,
      },
    };
    saveAll();
    openSettingsTool("invoices");
    showToast("Modelos de contrato salvos.");
    return;
  }

  const companyForm = event.target.closest("[data-company-form]");
  if (companyForm) {
    event.preventDefault();
    if (!canUseSettingsTool("company")) {
      showToast("Seu usuario nao tem permissao para alterar o perfil da empresa.");
      return;
    }
    state.company = {
      ...state.company,
      ...collectForm(companyForm),
    };
    saveAll();
    applyCompanyBranding();
    document.querySelector("#profile-title").textContent = state.company.name || "Perfil da empresa";
    showToast("Perfil da empresa atualizado.");
    return;
  }

  const whatsappForm = event.target.closest("[data-whatsapp-form]");
  if (whatsappForm) {
    event.preventDefault();
    if (!canUseSettingsTool("whatsapp")) {
      showToast("Seu usuario nao tem permissao para alterar WhatsApp.");
      return;
    }
    const data = collectForm(whatsappForm);
    state.company.whatsapp = {
      ...state.company.whatsapp,
      sender: data.sender || "",
      message: data.message || "",
      cloudApiEnabled: data.cloudApiEnabled || "Nao",
      phoneNumberId: data.phoneNumberId || "",
      businessAccountId: data.businessAccountId || "",
      appId: data.appId || "",
      webhookVerifyToken: data.webhookVerifyToken || "",
      webhookUrl: data.webhookUrl || "",
      accessToken: data.accessToken || "",
      testTo: data.testTo || "",
      testMessage: data.testMessage || "",
      connectionStatus: data.cloudApiEnabled === "Sim" && data.phoneNumberId && data.businessAccountId ? "Pronto para backend/API" : "Aguardando configuracao",
    };
    saveAll();
    openSettingsTool("whatsapp");
    showToast("Configuracao do WhatsApp salva.");
    return;
  }

  const integrationsForm = event.target.closest("[data-integrations-form]");
  if (integrationsForm) {
    event.preventDefault();
    if (!canUseSettingsTool("integrations")) {
      showToast("Seu usuario nao tem permissao para alterar integracoes.");
      return;
    }
    const data = collectForm(integrationsForm);
    state.company.integrations = {
      database: {
        mode: data.databaseMode || "indexeddb",
        endpoint: data.databaseEndpoint || "",
        projectId: data.databaseProjectId || "",
        status: data.databaseEndpoint ? "Preparado para API externa" : "Banco local ativo",
      },
      cloud: {
        provider: data.cloudProvider || "",
        endpoint: data.cloudEndpoint || "",
        bucket: data.cloudBucket || "",
        publicBaseUrl: data.cloudPublicBaseUrl || "",
        status: data.cloudEndpoint ? "Storage preparado para conexao" : "Aguardando credenciais",
      },
      googleMaps: {
        enabled: data.mapsEnabled || "Nao",
        apiKey: data.mapsApiKey || "",
        autocomplete: data.mapsAutocomplete || "Sim",
        geocoding: "Sim",
        mapVisibility: data.mapsVisibility || "Aproximada",
        status: data.mapsApiKey ? "Chave informada; pronto para carregar Places/Geocoding" : "Aguardando chave Google Maps",
      },
    };
    state.company.whatsapp = {
      ...state.company.whatsapp,
      cloudApiEnabled: data.whatsappCloudApiEnabled || "Nao",
      phoneNumberId: data.whatsappPhoneNumberId || "",
      businessAccountId: data.whatsappBusinessAccountId || "",
      accessToken: data.whatsappAccessToken || "",
      webhookVerifyToken: data.whatsappWebhookVerifyToken || "",
    };
    saveAll();
    openSettingsTool("integrations");
    showToast("Integracoes salvas.");
    return;
  }

  const appearanceForm = event.target.closest("[data-appearance-form]");
  if (appearanceForm) {
    event.preventDefault();
    if (!isAdmin()) {
      showToast("Somente administrador pode alterar aparencia.");
      return;
    }
    const data = collectForm(appearanceForm);
    state.company.theme = data.theme || state.company.theme || "regis";
    state.company.colors = {
      blue: data.blue,
      blueDark: data.blueDark,
      green: data.green,
      greenDark: data.greenDark,
      yellow: data.yellow,
    };
    saveAll();
    applyCompanyBranding();
    openSettingsTool("appearance");
    showToast("Tema atualizado.");
    return;
  }

  const changePasswordForm = event.target.closest("#change-password-form");
  if (changePasswordForm) {
    event.preventDefault();
    const user = activeUser();
    const data = collectForm(changePasswordForm);
    if (!user || user.password !== data.currentPassword) {
      showToast("Senha atual incorreta.");
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      showToast("A confirmacao da senha nao confere.");
      return;
    }
    user.password = data.newPassword;
    user.passwordSet = true;
    user.passwordResetAuthorized = false;
    user.resetRequested = false;
    saveAll();
    changePasswordForm.reset();
    showToast("Senha atualizada.");
    return;
  }

  const editForm = event.target.closest("[data-edit-form]");
  if (!editForm) return;

  event.preventDefault();
  const type = editForm.dataset.editForm;
  if (!requireEntityEdit(type)) return;
  const id = editForm.dataset.editId;
  const entity =
    type === "property"
      ? findProperty(id)
      : type === "owner"
        ? findOwner(id)
        : type === "contract"
          ? findContract(id)
          : type === "appointment"
            ? state.appointments.find((appointment) => appointment.id === id)
            : findClient(id);
  const data = collectForm(editForm);

  if (type === "contract") {
    const isLease = entity.type === "Locacao";
    const issuedDate = new Date(entity.issuedAt || entity.createdAt || new Date().toISOString());
    if (isLease) issuedDate.setMonth(issuedDate.getMonth() + Number(data.termMonths || 0));
    const keepDocs = Array.isArray(entity.guarantor?.documents) ? entity.guarantor.documents : [];
    Object.assign(entity, {
      propertyId: data.propertyId,
      clientId: data.clientId,
      amount: isLease ? data.monthlyValue : data.negotiatedValue,
      monthlyValue: isLease ? data.monthlyValue : "",
      negotiatedValue: isLease ? "" : data.negotiatedValue,
      downPayment: isLease ? "" : data.downPayment,
      securityDeposit: isLease ? data.securityDeposit : "",
      hasGuarantor: isLease && data.hasGuarantor === "Sim" ? "Sim" : "Nao",
      guarantor:
        isLease && data.hasGuarantor === "Sim"
          ? {
              name: data.guarantorName || "",
              cpf: data.guarantorCpf || "",
              contact1Name: data.guarantorContact1Name || "",
              contact1: data.guarantorContact1 || "",
              contact2Name: data.guarantorContact2Name || "",
              contact2: data.guarantorContact2 || "",
              income: data.guarantorIncome || "",
              address: data.guarantorAddress || "",
              notes: data.guarantorNotes || "",
              documents: keepDocs,
            }
          : null,
      termMonths: isLease ? data.termMonths : "",
      dueDate: isLease && !Number.isNaN(issuedDate.getTime()) ? issuedDate.toISOString().slice(0, 10) : "",
      notes: data.notes,
    });
    saveAll();
    render();
    renderProfile();
    showToast("Contrato atualizado.");
    return;
  }

  if (type === "client") {
    data.crop = {
      zoom: Number(data.cropZoom || entity.crop?.zoom || 1),
      x: Number(data.cropX || entity.crop?.x || 50),
      y: Number(data.cropY || entity.crop?.y || 50),
    };
    delete data.cropZoom;
    delete data.cropX;
    delete data.cropY;
    data.photo = entity.photos?.[0] || entity.photo || null;
  }

  if (type === "property") {
    data.price = data.netValue || data.grossValue || "";
  }

  Object.assign(entity, data);
  saveAll();
  render();
  renderProfile();
  showToast("Perfil atualizado.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.activeProfile) {
    closeProfile();
  }
});

render();
initCloudSync();
