// ======================================
// FIREBASE
// ======================================

const firebaseConfig = {

  apiKey: "AIzaSyAfF2l99nBaB3xP-Aj2C0LEJE0-05lufi8",

  authDomain: "teste-caminhao-5651f.firebaseapp.com",

  projectId: "teste-caminhao-5651f",

  storageBucket: "teste-caminhao-5651f.firebasestorage.app",

  messagingSenderId: "900483850217",

  appId: "1:900483850217:web:1b83a89ceac9747fbab578"

};

// INICIAR FIREBASE
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();

// ======================================
// LOGIN
// ======================================

function login() {

  const email =
    document.getElementById("user").value;

  const senha =
    document.getElementById("pass").value;

  auth.signInWithEmailAndPassword(email, senha)

    .then(() => {

      document.getElementById("login")
      .style.display = "none";

      document.getElementById("app")
      .style.display = "block";

    })

    .catch((error) => {

      console.log(error);

      alert(error.message);

    });

}
// ======================================
// LOGOUT
// ======================================

function logout() {

  auth.signOut()

    .then(() => {

      location.reload();

    });

}

// ======================================
// VERIFICAR LOGIN
// ======================================

auth.onAuthStateChanged((user) => {

  if (user) {

    document.getElementById("login")
    .style.display = "none";

    document.getElementById("app")
    .style.display = "block";

    carregarViagens();

  }

});

// ======================================
// DATA AUTOMÁTICA
// ======================================

const hoje = new Date();

document.getElementById("data").value =
hoje.toISOString().split("T")[0];

// ======================================
// SALVAR VIAGEM
// ======================================

function salvar() {

  const user = auth.currentUser;

  const cidade =
    document.getElementById("cidade").value;

  const frete =
    Number(document.getElementById("frete").value);

  const gasto =
    Number(document.getElementById("gasto").value);

  const data =
    document.getElementById("data").value;

  // VALIDAÇÃO
  if (!cidade || !frete || !gasto) {

    alert("Preencha todos os campos.");

    return;

  }

  // SALVAR NO FIREBASE
  db.collection("viagens").add({

    uid: user.uid,

    cidade: cidade,

    frete: frete,

    gasto: gasto,

    data: data,

    criadoEm: new Date()

  })

  .then(() => {

    alert("Viagem salva!");

    document.getElementById("cidade").value = "";

    document.getElementById("frete").value = "";

    document.getElementById("gasto").value = "";

    carregarViagens();

  })

  .catch((error) => {

    console.log(error);

    alert("Erro ao salvar.");

  });

}

// ======================================
// CARREGAR VIAGENS
// ======================================

function carregarViagens() {

  const lista =
    document.getElementById("lista");

  lista.innerHTML = "";

  let totalFrete = 0;

  let totalGasto = 0;

  const user = auth.currentUser;

  db.collection("viagens")

    .where("uid", "==", user.uid)

    .get()

    .then((snapshot) => {

      snapshot.forEach((doc) => {

        const v = doc.data();

        const lucro =
          v.frete - v.gasto;

        totalFrete += v.frete;

        totalGasto += v.gasto;

        lista.innerHTML += `

        <div class="viagem">

          <div class="viagemTop">

            <div class="viagemInfo">

              <h3>${v.cidade}</h3>

              <p>📅 ${v.data}</p>

            </div>

            <div class="valores">

              <p class="azulTexto">

                Frete:
                R$ ${v.frete.toFixed(2)}

              </p>

              <p class="vermelhoTexto">

                Gasto:
                R$ ${v.gasto.toFixed(2)}

              </p>

              <p class="verdeTexto">

                Lucro:
                R$ ${lucro.toFixed(2)}

              </p>

            </div>

          </div>

          <div class="botoes">

            <button class="editar"
            onclick="editarViagem('${doc.id}')">

              <i class="fa-solid fa-pen"></i>

              Editar

            </button>

            <button class="excluir"
            onclick="excluirViagem('${doc.id}')">

              <i class="fa-solid fa-trash"></i>

              Excluir

            </button>

          </div>

        </div>

        `;

      });

      // TOTAIS
      document.getElementById("totalFreteEl")
      .innerText = totalFrete.toFixed(2);

      document.getElementById("totalGastoEl")
      .innerText = totalGasto.toFixed(2);

      document.getElementById("lucroEl")
      .innerText =
      (totalFrete - totalGasto).toFixed(2);

    })

    .catch((error) => {

      console.log(error);

    });

}

// ======================================
// EXCLUIR
// ======================================

function excluirViagem(id) {

  const confirmar =
    confirm("Deseja excluir?");

  if (!confirmar) return;

  db.collection("viagens")

    .doc(id)

    .delete()

    .then(() => {

      carregarViagens();

    });

}

// ======================================
// EDITAR
// ======================================

function editarViagem(id) {

  const novoFrete =
    prompt("Novo valor do frete:");

  const novoGasto =
    prompt("Novo valor do gasto:");

  if (!novoFrete || !novoGasto) {

    return;

  }

  db.collection("viagens")

    .doc(id)

    .update({

      frete: Number(novoFrete),

      gasto: Number(novoGasto)

    })

    .then(() => {

      carregarViagens();

    });

}

console.log("APP FUNCIONANDO");

function mostrarModal() {
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}
