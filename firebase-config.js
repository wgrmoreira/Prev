// Configuração do Firebase para a aplicação PREV+
// IMPORTANTE: Substitua estas credenciais pelas suas próprias credenciais do Firebase
// Obtidas no console do Firebase ao registrar seu aplicativo web

const firebaseConfig = {
  apiKey: "SUBSTITUA_PELA_SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);

// Referência para o banco de dados
const database = firebase.database();
