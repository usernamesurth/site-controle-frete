// FIREBASE
const firebaseConfig = {

  apiKey: "AIzaSyAfF2l99nBaB3xP-Aj2C0LEJE0-05lufi8",

  authDomain: "teste-caminhao-5651f.firebaseapp.com",

  projectId: "teste-caminhao-5651f",

  storageBucket: "teste-caminhao-5651f.firebasestorage.app",

  messagingSenderId: "900483850217",

  appId: "1:900483850217:web:1b83a89ceac9747fbab578"

};

// INICIAR
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();

// LOGIN
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

      carregarViagens();

    })

    .catch((error) => {

      console.log(error);

      alert(error.message);

    });

}

// LOGOUT
function logout() {

  auth.signOut()

    .then(() => {

      location.reload();

    });

}

// VERIFICAR LOGIN
auth.onAuthStateChanged((user) => {

  if (user) {

    document.getElementById("login")
    .style.display = "none";

    document.getElementById("app")
    .style.display = "block";

    carregarViagens();

  }

});

// DATA
const hoje = new Date();

document.getElementById("data").value =
hoje.toISOString().split("T")[0];

// SALVAR
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

  if (!cidade || !frete || !gasto) {

    alert("Preencha tudo.");

    return;

  }

  db.collection("viagens").add({

    uid: user.uid,

    cidade: cidade,

    frete: frete,

    gasto: gasto,

    data: data,

    criadoEm: new Date()

  })

  .then(() => {

    carregarViagens();

    document.getElementById("cidade").value = "";

    document.getElementById("frete").value = "";

    document.getElementById("gasto").value = "";

  });

}

  db.collection("viagens").add({

    cidade,
    frete,
    gasto,
    data,
    criadoEm: new Date()

  })

  .then(() => {

    carregarViagens();

    document.getElementById("frete").value = "";

    document.getElementById("gasto").value = "";

    document.getElementById("cidade").value = "";

  });

}

// CARREGAR
function carregarViagens() {

  const lista =
    document.getElementById("lista");

  lista.innerHTML = "";

  let totalFrete = 0;

  let totalGasto = 0;

  const user = auth.currentUser;

  db.collection("viagens")

    .where("uid", "==", user.uid)

    .orderBy("criadoEm", "desc")

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

          <h3>${v.cidade}</h3>

          <p>📅 ${v.data}</p>

          <p>Frete: R$ ${v.frete}</p>

          <p>Gasto: R$ ${v.gasto}</p>

          <p>Lucro: R$ ${lucro}</p>

          <div class="botoes">

            <button class="editar"
              onclick="editarViagem('${doc.id}')">

              Editar

            </button>

            <button class="excluir"
              onclick="excluirViagem('${doc.id}')">

              Excluir

            </button>

          </div>

        </div>

        `;

      });

      document.getElementById("totalFreteEl")
      .innerText = totalFrete.toFixed(2);

      document.getElementById("totalGastoEl")
      .innerText = totalGasto.toFixed(2);

      document.getElementById("lucroEl")
      .innerText =
      (totalFrete - totalGasto).toFixed(2);

    });

}
      document.getElementById("totalFreteEl")
      .innerText = totalFrete.toFixed(2);

      document.getElementById("totalGastoEl")
      .innerText = totalGasto.toFixed(2);

      document.getElementById("lucroEl")
      .innerText =
      (totalFrete - totalGasto).toFixed(2);

    });

}

// EXCLUIR
function excluirViagem(id) {

  db.collection("viagens")

    .doc(id)

    .delete()

    .then(() => {

      carregarViagens();

    });

}

// EDITAR
function editarViagem(id) {

  const frete =
    prompt("Novo frete:");

  const gasto =
    prompt("Novo gasto:");

  db.collection("viagens")

    .doc(id)

    .update({

      frete: Number(frete),

      gasto: Number(gasto)

    })

    .then(() => {

      carregarViagens();

    });

}

console.log("APP FUNCIONANDO");
