// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAfF2l99nBaB3xP-Aj2C0LEJE0-05lufi8",
  authDomain: "teste-caminhao-5651f.firebaseapp.com",
  projectId: "teste-caminhao-5651f",
  storageBucket: "teste-caminhao-5651f.firebasestorage.app",
  messagingSenderId: "900483850217",
  appId: "1:900483850217:web:1b83a89ceac9747fbab578",
  measurementId: "G-RH831V3DQX"
};

// INICIAR FIREBASE
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

let userAtual = null;
let editandoId = null;

// LOGIN
function login() {

  const email =
    document.getElementById("user").value;

  const senha =
    document.getElementById("pass").value;

  auth.signInWithEmailAndPassword(email, senha)
    .catch(error => {
      alert(error.message);
    });
}

// CRIAR CONTA
function registrar() {

  const email =
    document.getElementById("user").value;

  const senha =
    document.getElementById("pass").value;

  auth.createUserWithEmailAndPassword(email, senha)
    .then(() => {
      alert("Conta criada!");
    })
    .catch(error => {
      alert(error.message);
    });
}

// SAIR
function logout() {
  auth.signOut();
}

// MONITORAR LOGIN
auth.onAuthStateChanged(user => {

  if (user) {

    userAtual = user;

    document.getElementById("login")
      .style.display = "none";

    document.getElementById("app")
      .style.display = "block";

    carregarDados();

  } else {

    document.getElementById("login")
      .style.display = "block";

    document.getElementById("app")
      .style.display = "none";
  }
});

// SALVAR
function salvar() {

  const frete =
    parseFloat(
      document.getElementById("frete").value
    );

  const gasto =
    parseFloat(
      document.getElementById("gasto").value
    );

  const data =
    document.getElementById("data").value;

  const cidade =
    document.getElementById("cidade").value;

  if (!frete || !gasto || !data || !cidade) {

    alert("Preencha tudo");

    return;
  }

  const viagem = {
    uid: userAtual.uid,
    frete,
    gasto,
    data,
    cidade
  };

  if (editandoId) {

    db.collection("viagens")
      .doc(editandoId)
      .update(viagem);

    editandoId = null;

  } else {

    db.collection("viagens")
      .add(viagem);
  }

  limparCampos();
}

// CARREGAR
function carregarDados() {

  db.collection("viagens")
    .where("uid", "==", userAtual.uid)
    .onSnapshot(snapshot => {

      let totalFrete = 0;

      let totalGasto = 0;

      const lista =
        document.getElementById("lista");

      lista.innerHTML = "";

      snapshot.forEach(doc => {

        const v = doc.data();

        totalFrete += v.frete;

        totalGasto += v.gasto;

        const item =
          document.createElement("li");

        item.innerHTML = `
          📍 ${v.cidade}<br>
          📅 ${v.data}<br>
          🚛 R$${v.frete}<br>
          ⛽ R$${v.gasto}<br><br>

          <button onclick="editar('${doc.id}')">
            Editar
          </button>

          <button onclick="excluir('${doc.id}')">
            Excluir
          </button>
        `;

        lista.appendChild(item);
      });

      const lucro =
        totalFrete - totalGasto;

      const metade =
        lucro / 2;

      document.getElementById("totalFreteEl")
        .innerText = totalFrete.toFixed(2);

      document.getElementById("totalGastoEl")
        .innerText = totalGasto.toFixed(2);

      document.getElementById("lucroEl")
        .innerText = lucro.toFixed(2);

      document.getElementById("metadeEl")
        .innerText = metade.toFixed(2);
    });
}

// EDITAR
function editar(id) {

  db.collection("viagens")
    .doc(id)
    .get()
    .then(doc => {

      const v = doc.data();

      document.getElementById("frete").value =
        v.frete;

      document.getElementById("gasto").value =
        v.gasto;

      document.getElementById("data").value =
        v.data;

      document.getElementById("cidade").value =
        v.cidade;

      editandoId = id;
    });
}

// EXCLUIR
function excluir(id) {

  if (confirm("Excluir viagem?")) {

    db.collection("viagens")
      .doc(id)
      .delete();
  }
}

// LIMPAR
function limparCampos() {

  document.getElementById("frete").value = "";

  document.getElementById("gasto").value = "";

  document.getElementById("data").value = "";

  document.getElementById("cidade").value = "";
}
// DATA AUTOMÁTICA BRASIL
window.onload = () => {

  const hoje = new Date();

  const brasil = hoje.toLocaleDateString("en-CA", {
    timeZone: "America/Sao_Paulo"
  });

  document.getElementById("data").value = brasil;
};
// VALIDAR CIDADE DA LISTA
document.getElementById("cidade").addEventListener("change", function () {

  const inputCidade = this.value;

  const opcoes =
    document.querySelectorAll("#cidadesMG option");

  let valido = false;

  opcoes.forEach(option => {

    if (option.value === inputCidade) {
      valido = true;
    }
  });

  if (!valido) {

    alert("Selecione uma cidade válida da lista.");

    this.value = "";
  }
});
