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
// MODAIS
// ======================================

function mostrarModal() {

  document.getElementById("modal")
  .style.display = "flex";

}

function fecharModal() {

  document.getElementById("modal")
  .style.display = "none";

}

function mostrarModalExcluir(id) {

  document.getElementById("modalExcluir")
  .style.display = "flex";

  document.getElementById("btnConfirmarExcluir")
  .onclick = () => confirmarExcluir(id);

}

function fecharModalExcluir() {

  document.getElementById("modalExcluir")
  .style.display = "none";

}

function mostrarModalEditar(id) {

  document.getElementById("modalEditar")
  .style.display = "flex";

  document.getElementById("btnSalvarEdicao")
  .onclick = () => confirmarEdicao(id);

  document.getElementById("editarFrete").value = "";

  document.getElementById("editarGasto").value = "";

}

function fecharModalEditar() {

  document.getElementById("modalEditar")
  .style.display = "none";

}

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

      console.log("LOGIN OK");

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

    // NOME USUÁRIO
    const nome =
      user.email.split("@")[0];

    document.getElementById("nomeUsuario")
    .innerText = nome;

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

  // SALVAR
  db.collection("viagens").add({

    uid: user.uid,

    cidade: cidade,

    frete: frete,

    gasto: gasto,

    data: data,

    criadoEm: new Date()

  })

  .then(() => {

    mostrarModal();

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

  let totalViagens = 0;

  // TOTAL DO MÊS ATUAL
  let viagensMes = 0;

  let freteMes = 0;

  let gastoMes = 0;

  const user = auth.currentUser;

  db.collection("viagens")

    .where("uid", "==", user.uid)

    .get()

    .then((snapshot) => {

      snapshot.forEach((doc) => {

        const v = doc.data();

        const lucro =
          v.frete - v.gasto;

        // RELATÓRIO MENSAL
        const hoje = new Date();

        const mesAtual =
          hoje.getMonth() + 1;

        const anoAtual =
          hoje.getFullYear();

        const dataViagem =
          new Date(v.data);

        const mesViagem =
          dataViagem.getMonth() + 1;

        const anoViagem =
          dataViagem.getFullYear();

        if (
          mesAtual === mesViagem &&
          anoAtual === anoViagem
        ) {

          viagensMes++;

          totalViagens++;

          totalFrete += v.frete;

          totalGasto += v.gasto;

          freteMes += v.frete;

          gastoMes += v.gasto;

        }

        lista.innerHTML += `

        <div class="viagem">

          <div class="viagemTop">

            <div class="viagemInfo">

              <h3>${v.cidade}</h3>

              <p>📅 ${v.data}</p>

            </div>

            <div class="valores">

              <p class="azulTexto">
                Frete: R$ ${v.frete.toFixed(2)}
              </p>

              <p class="vermelhoTexto">
                Gasto: R$ ${v.gasto.toFixed(2)}
              </p>

              <p class="verdeTexto">
                Lucro: R$ ${lucro.toFixed(2)}
              </p>

            </div>

          </div>

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

      // TOTAIS
      document.getElementById("totalFreteEl")
      .innerText = totalFrete.toFixed(2);

      document.getElementById("totalGastoEl")
      .innerText = totalGasto.toFixed(2);

      document.getElementById("lucroEl")
      .innerText =
      (totalFrete - totalGasto).toFixed(2);

      document.getElementById("totalViagensEl")
      .innerText = totalViagens;

    })

    .catch((error) => {

      console.log(error);

    });

}

// ======================================
// EXCLUIR
// ======================================

function excluirViagem(id) {

  mostrarModalExcluir(id);

}

function confirmarExcluir(id) {

  db.collection("viagens")

    .doc(id)

    .delete()

    .then(() => {

      fecharModalExcluir();

      carregarViagens();

    });

}

// ======================================
// EDITAR
// ======================================

function editarViagem(id) {

  mostrarModalEditar(id);

}

function confirmarEdicao(id) {

  const novoFrete =
    Number(document.getElementById("editarFrete").value);

  const novoGasto =
    Number(document.getElementById("editarGasto").value);

  if (!novoFrete || !novoGasto) {

    alert("Preencha todos os campos.");

    return;

  }

  db.collection("viagens")

    .doc(id)

    .update({

      frete: novoFrete,

      gasto: novoGasto

    })

    .then(() => {

      fecharModalEditar();

      carregarViagens();

    });

}

console.log("APP FUNCIONANDO");

function abrirRelatorios() {

  const area =
    document.getElementById("areaRelatorios");

  const lista =
    document.getElementById("listaRelatorios");

  // MOSTRAR / ESCONDER
  if(area.style.display === "block"){

    area.style.display = "none";

    return;

  }

  area.style.display = "block";

  lista.innerHTML = "";

  const user = auth.currentUser;

  const meses = [

    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"

  ];

  db.collection("viagens")

    .where("uid","==",user.uid)

    .get()

    .then((snapshot)=>{

      let dadosMes = {};

      snapshot.forEach((doc)=>{

        const v = doc.data();

        const data =
          new Date(v.data);

        const mes =
          data.getMonth();

        if(!dadosMes[mes]){

          dadosMes[mes] = {

            viagens:0,
            frete:0,
            gasto:0

          };

        }

        dadosMes[mes].viagens++;

        dadosMes[mes].frete += v.frete;

        dadosMes[mes].gasto += v.gasto;

      });

      for(let mes in dadosMes){

        const d = dadosMes[mes];

        const lucro =
          d.frete - d.gasto;

        lista.innerHTML += `

        <div class="relatorioAno">

          <h3>

            ${meses[mes]}

          </h3>

          <p>
            🚛 Viagens:
            ${d.viagens}
          </p>

          <p>
            💰 Fretes:
            R$ ${d.frete.toFixed(2)}
          </p>

          <p>
            ⛽ Gastos:
            R$ ${d.gasto.toFixed(2)}
          </p>

          <p>
            📈 Lucro:
            R$ ${lucro.toFixed(2)}
          </p>

        </div>

        `;

      }

    });

}
