import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";

const host = "0.0.0.0";
const port = 3000;

var listaTimes = [];
var listaJogadores = [];

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: "M1nh4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 15,
        httpOnly: true,
        secure: false
    }
}));

app.get("/", verificarAutenticacao, (requisicao, resposta) => {
    const ultimoLogin = requisicao.cookies.ultimoLogin;
    resposta.send(`
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    img {
                        width: 100%;
                        height: auto;
                        max-height: 100vh;
                        object-fit: cover;
                        display: block;
                    }
                </style>
            </head>
            <body>
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                    <div class="container-fluid">
                        <img src="https://i.postimg.cc/N0z0Qrb5/logo.png" alt="logoSite" class="img-fluid rounded-circle mt-2" style="width: 60px; height: 60px;">
                        <a class="navbar-brand" href="#" style="margin-left: 20px;">
                            GoodTeam
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                            <ul class="navbar-nav">
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="/" id="cadastrosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Cadastro
                                    </a>
                                    <ul class="dropdown-menu" aria-labelledby="cadastrosDropdown">
                                    <li><a class="dropdown-item" href="/cadastroTime">Cadastro de time</a></li> 
                                    <li><hr class="dropdown-divider"></li>   
                                    <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro de jogador</a></li>
                                    </ul>
                                </li>
                            </ul>
                              <ul class="navbar-nav ms-auto">
                                <li class="nav-item">
                                    <span class="navbar-text nav-link disabled">${ultimoLogin ? "Último acesso: " + ultimoLogin : ""}</span>
                                </li>
                                
                                <li class="nav-item dropdown">
                                    <a class="nav-link dropdown-toggle" href="#" id="cadastrosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        User
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end text-center" aria-labelledby="cadastrosDropdown" style="min-width: 200px;">
                                        <li><hr class="dropdown-divider"></li>
                                        <li>
                                        <p class="dropdown-item fw-semibold">Admin</p>
                                        </li>
                                    </ul>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/login">Login</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/logout">Sair</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <img src="https://i.postimg.cc/HLxxGtwq/fundo.png" alt="fundoSite">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `)
});


app.get("/cadastroTime", verificarAutenticacao, (requisicao, resposta) => {
    resposta.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cadastro de Times</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style>
            body {
            background:rgba(41, 41, 41, 0.47);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            }
            .form-container {
            width: 100%;
            max-width: 550px;
            }
        </style>
        </head>
        <body>

        <div class="form-container">
            <div class="card shadow rounded-4">
            <div class="card-body p-4">
                <h4 class="text-center mb-4">Cadastro de Equipes</h4>
                <form method="POST" action="/cadastroTime" id="timesForm" novalidate>
                <div class="mb-3">
                    <input type="text" class="form-control" id="nomeEquipe" name="nomeEquipe" placeholder="Nome da equipe" required />
                    <div class="invalid-feedback">Informe o nome da equipe.</div>
                </div>

                <div class="mb-3">
                    <input type="text" class="form-control" id="nomeTecnico" name="nomeTecnico" placeholder="Nome do técnico responsável" required />
                    <div class="invalid-feedback">Informe o nome do técnico.</div>
                </div>

                <div class="mb-3">
                    <input type="tel" class="form-control" id="telefoneTecnico" name="telefoneTecnico" placeholder="Telefone do técnico (somente números)" pattern="\d{10,11}" required />
                    <div class="invalid-feedback">Informe um telefone válido (10 a 11 dígitos).</div>
                </div>

                <div class="mb-3">
                    <select class="form-control" id="categoriaEquipe" name="categoriaEquipe" required>
                        <option value="" disabled selected>Categoria da equipe</option>
                        <option value="juvenil">Juvenil</option>
                        <option value="adulto">Adulto</option>
                        <option value="master">Master</option>
                    </select>
                    <div class="invalid-feedback">Selecione a categoria da equipe.</div>
                </div>

                <div class="mb-3">
                    <input type="date" class="form-control" id="anoFundacao" name="anoFundacao" placeholder="Ano de fundação da equipe" min="1900" max="2100" required />
                    <div class="invalid-feedback">Informe um ano válido.</div>
                </div>

                <div class="mb-3">
                    <input type="text" class="form-control" id="cidadeEquipe" name="cidadeEquipe" placeholder="Endereço ou cidade da equipe" required />
                    <div class="invalid-feedback">Informe a cidade ou endereço da equipe.</div>
                </div>

                <div class="mb-3">
                    <input type="number" class="form-control" id="quantidadeJogadores" name="quantidadeJogadores" placeholder="Quantidade de jogadores na equipe" min="1" max="99" required />
                    <div class="invalid-feedback">Informe a quantidade de jogadores.</div>
                </div>

                <div class="mb-3">
                    <textarea class="form-control" id="observacoes" name="observacoes" placeholder="Observações ou notas extras" rows="3"></textarea>
                </div>

                <div class="d-grid">
                    <button type="submit" class="btn btn-primary">Cadastrar</button>
                    <a class="btn btn-secondary" href="/" style="margin-top: 5px">Voltar</a>
                </div>
            </form>

            </div>
            </div>
        </div>
        </body>
        </html>
    `);
});

app.post("/cadastroTime", verificarAutenticacao, (requisisao, resposta) => {
    const nomeEquipe = requisisao.body.nomeEquipe;
    const nomeTecnico = requisisao.body.nomeTecnico;
    const telefoneTecnico = requisisao.body.telefoneTecnico;
    const categoriaEquipe = requisisao.body.categoriaEquipe;
    const anoFundacao = requisisao.body.anoFundacao;
    const cidadeEquipe = requisisao.body.cidadeEquipe;
    const quantidadeJogadores = requisisao.body.quantidadeJogadores;
    const observacoes = requisisao.body.observacoes;
    
    const telefoneRegex = /^\d{10,11}$/;

    let erros = {
        nomeEquipe: !nomeEquipe ? "Nome da equipe e obrigatorio!" : "",
        nomeTecnico: !nomeTecnico ? "Nome dom tecnico e obrigatorio!" : "",
        telefoneTecnico: !telefoneTecnico
            ? "Telefone do técnico é obrigatório!" 
            : (!telefoneRegex.test(telefoneTecnico) 
            ? "Telefone inválido! Use somente números (10 ou 11 dígitos)." 
            : ""),
        categoriaEquipe: !categoriaEquipe ? "Categoria da equipe e obrigatoria!" : "",
        anoFundacao: !anoFundacao ? "O ano da fundação e obrigatorio!" : "",
        cidadeEquipe: !cidadeEquipe ? "A cidade da equipe e obrigatorio!" : "",
        quantidadeJogadores: !quantidadeJogadores ? "A quantidade de jogadores e obrigatorio!" : "",
    }

    const temErros = Object.values(erros).some(msg => msg !== "");

    if (!temErros) {
        listaTimes.push({
            nomeEquipe: nomeEquipe,
            nomeTecnico: nomeTecnico,
            telefoneTecnico: telefoneTecnico,
            categoriaEquipe: categoriaEquipe,
            anoFundacao: anoFundacao,
            cidadeEquipe: cidadeEquipe,
            quantidadeJogadores: quantidadeJogadores,
            observacoes: observacoes,
        });
        resposta.redirect("/listaTimes");
    } else {
        let conteudo = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Cadastro de Times</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <style>
                body {
                background:rgba(41, 41, 41, 0.47);
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                }
                .form-container {
                width: 100%;
                max-width: 550px;
                }
            </style>
            </head>
        <body>
            <div class="form-container">
                <div class="card shadow rounded-4">
                    <div class="card-body p-4">
                        <h4 class="text-center mb-4">Cadastro de Equipes</h4>
                        <form method="POST" action="/cadastroTime" id="timesForm" novalidate>
                `; conteudo += `
                        <div class="mb-3">
                            <input type="text" class="form-control" name="nomeEquipe" placeholder="Nome da equipe" value="${nomeEquipe}"/>
                            ${erros.nomeEquipe ? `<span class="text-danger">${erros.nomeEquipe}</span>` : ''}
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" name="nomeTecnico" placeholder="Nome do técnico responsável" value="${nomeTecnico}"/>
                            ${erros.nomeTecnico ? `<span class="text-danger">${erros.nomeTecnico}</span>` : ''}
                        </div>

                        <div class="mb-3">
                            <input type="tel" class="form-control" name="telefoneTecnico" placeholder="Telefone do técnico (somente números)" value="${telefoneTecnico}"/>
                            ${erros.telefoneTecnico ? `<span class="text-danger">${erros.telefoneTecnico}</span>` : ''}
                        </div>

                        <div class="mb-3">
                            <select class="form-control" name="categoriaEquipe">
                                <option value="">Categoria da equipe</option>
                                <option value="juvenil" ${categoriaEquipe === 'juvenil' ? 'selected' : ''}>Juvenil</option>
                                <option value="adulto" ${categoriaEquipe === 'adulto' ? 'selected' : ''}>Adulto</option>
                                <option value="master" ${categoriaEquipe === 'master' ? 'selected' : ''}>Master</option>
                            </select>
                            ${erros.categoriaEquipe ? `<span class="text-danger">${erros.categoriaEquipe}</span>` : ''}
                        </div>

                        <div class="mb-3">
                            <input type="date" class="form-control" name="anoFundacao" placeholder="Ano de fundação da equipe" min="1900" max="2100" value="${anoFundacao}"/>
                            ${erros.anoFundacao ? `<span class="text-danger">${erros.anoFundacao}</span>` : ''}
                        </div>

                        <div class="mb-3">
                            <input type="text" class="form-control" name="cidadeEquipe" placeholder="Endereço ou cidade da equipe" value="${cidadeEquipe}"/>
                            ${erros.cidadeEquipe ? `<span class="text-danger">${erros.cidadeEquipe}</span>` : ''}
                        </div>

                        <div class="mb-3">
                            <input type="number" class="form-control" name="quantidadeJogadores" placeholder="Quantidade de jogadores na equipe" min="1" max="99" value="${quantidadeJogadores}"/>
                            ${erros.quantidadeJogadores ? `<span class="text-danger">${erros.quantidadeJogadores}</span>` : ''}
                        </div>

                        <div class="mb-3">
                            <textarea class="form-control" name="observacoes" placeholder="Observações ou notas extras" rows="3">${observacoes}</textarea>
                        </div>

                        <div class="d-grid">
                                <button type="submit" class="btn btn-primary">Cadastrar</button>
                                <a class="btn btn-secondary" href="/" style="margin-top: 5px">Voltar</a>
                        </div>
                        `;
                conteudo += `
                        </form>
                    </div>
                </div>
            </div>
            </body>
            </html>
        `;
        resposta.send(conteudo);
    }
});

app.get("/listaTimes", verificarAutenticacao, (requisicao, resposta) => {
    let conteudo=`
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Formulário</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                </head>
                <body>
                    <div class="container w-90 mb-5 mt-5">
                        <table class="table table-dark table-striped-columns">
                            <thead>
                                <tr>
                                    <th scope="col">Equipe</th>
                                    <th scope="col">Responsavel</th>
                                    <th scope="col">Telefone técnico</th>
                                    <th scope="col">Categoria</th>
                                    <th scope="col">Ano de fundação</th>
                                    <th scope="col">Cidade</th>
                                    <th scope="col">Quantidade de Jogadores</th>
                                    <th scope="col">Observação</th>
                                </tr>
                            </thead>
                            <tbody> `;
                            for(let i = 0; i < listaTimes.length; i++) {
                                conteudo = conteudo + `
                                        <tr>
                                            <td>${listaTimes[i].nomeEquipe}</td>
                                            <td>${listaTimes[i].nomeTecnico}</td>
                                            <td>${listaTimes[i].telefoneTecnico}</td>
                                            <td>${listaTimes[i].categoriaEquipe}</td>
                                            <td>${listaTimes[i].anoFundacao}</td>
                                            <td>${listaTimes[i].cidadeEquipe}</td>
                                            <td>${listaTimes[i].quantidadeJogadores}</td>
                                            <td>${listaTimes[i].observacoes}</td>
                                        </tr> ` 
                                    }

    conteudo = conteudo + ` </tbody>
                        </table>
                        <a class="btn btn-secondary" href="/cadastroTime">Retornar ao cadastro</a>
                     </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </html>`
    resposta.send(conteudo);
    resposta.end();
})

app.get("/cadastroJogadores", verificarAutenticacao, (requisicao, resposta) => {
    resposta.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cadastro de Jogadores</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style>
            body {
            background:rgba(41, 41, 41, 0.47);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            }
            .form-container {
            width: 100%;
            max-width: 550px;
            }
        </style>
        </head>
        <body>
        <div class="form-container">
            <div class="card shadow rounded-4">
            <div class="card-body p-4">
                <h4 class="text-center mb-4">Cadastro de Jogadores</h4>
                <form method="POST" action="/cadastroJogadores" id="jogadoresForm" novalidate>
                <div class="mb-3">
                    <input type="text" class="form-control" name="nomeJogador" placeholder="Nome do Jogador" required />
                    <div class="invalid-feedback">Informe o nome do jogador.</div>
                </div>

                <div class="mb-3">
                    <input type="number" class="form-control" name="numeroCamisa" placeholder="Número da camisa" min="1" max="99" required />
                    <div class="invalid-feedback">Informe o número da camisa (1 a 99).</div>
                </div>

                <div class="mb-3">
                    <input type="date" class="form-control" name="dataNascimento" placeholder="Data de Nascimento" required />
                    <div class="invalid-feedback">Informe a data de nascimento.</div>
                </div>

                <div class="mb-3">
                    <input type="number" class="form-control" name="altura" placeholder="Altura em cm (ex: 185)" min="100" max="250" required />
                    <div class="invalid-feedback">Informe a altura em centímetros.</div>
                </div>

                <div class="mb-3">
                    <select class="form-control" name="genero" required>
                        <option value="">Selecione o gênero</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Outro">Outro</option>
                    </select>
                    <div class="invalid-feedback">Selecione o gênero.</div>
                </div>

                <div class="mb-3">
                    <input type="text" class="form-control" name="posicao" placeholder="Posição (ex: Levantador, Oposto...)" required />
                    <div class="invalid-feedback">Informe a posição do jogador.</div>
                </div>

                <div class="mb-3">
                    <select class="form-control" name="equipe" required>
                        <option value="">Selecione a equipe</option>
                        ${listaTimes.map(time => `
                            <option value="${time.nomeEquipe}">${time.nomeEquipe}</option>
                        `).join('')}
                    </select>
                    <div class="invalid-feedback">Selecione uma equipe.</div>
                </div>
                <div class="d-grid">
                    <button type="submit" class="btn btn-primary">Cadastrar</button>
                    <a class="btn btn-secondary" href="/" style="margin-top: 5px">Voltar</a>
                </div>
            </form>
            </div>
            </div>
        </div>
        </body>
        </html>
    `);
});

function contarJogadoresPorEquipe(nomeEquipe) {
    let count = 0;
    for (let i = 0; i < listaJogadores.length; i++) {
        if (listaJogadores[i].nomeEquipeJogadores === nomeEquipe) {
            count++;
        }
    }
    return count;
}

app.post("/cadastroJogadores", verificarAutenticacao, (requisicao, resposta) => {
    const nomeJogador = requisicao.body.nomeJogador;
    const numeroCamisa = requisicao.body.numeroCamisa;
    const dataNascimento = requisicao.body.dataNascimento;
    const altura = requisicao.body.altura;
    const genero = requisicao.body.genero;
    const posicao = requisicao.body.posicao;
    const nomeEquipeJogadores = requisicao.body.equipe || "";
    let quantidadeJogadoresEquipe = contarJogadoresPorEquipe(nomeEquipeJogadores);

    let erros = {
        nomeJogador: !nomeJogador ? "O nome do jogador e obrigatorio!" : "",
        numeroCamisa: !numeroCamisa ? "O numero da camisa e obrigatorio!" : "",
        dataNascimento: !dataNascimento ? "A data de nascimento e obrigatoria!" : "",
        altura: !altura ? "A altura e obrigatorio!" : "",
        genero: !genero ? "O genero e obrigatorio!" : "",
        posicao: !posicao ? "A posicao e obrigatoria!" : "",
        nomeEquipe: !nomeEquipeJogadores ? "O nome da equipe é obrigatório!" : (quantidadeJogadoresEquipe >= 6 ? "Essa equipe já atingiu o limite de 6 jogadores!" : ""),
    };

    const temErros = Object.values(erros).some(msg => msg !== "");

    if (!temErros) {
        listaJogadores.push({
            nomeJogador: nomeJogador,
            numeroCamisa: numeroCamisa,
            dataNascimento: dataNascimento,
            altura: altura,
            genero: genero,
            posicao: posicao,
            nomeEquipeJogadores: nomeEquipeJogadores,
        });
        resposta.redirect("/listaJogadores");
    } else {
        let conteudo = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cadastro de Jogadores</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <style>
            body {
            background:rgba(41, 41, 41, 0.47);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            }
            .form-container {
            width: 100%;
            max-width: 550px;
            }
        </style>
        </head>
        <body>
        <div class="form-container">
            <div class="card shadow rounded-4">
            <div class="card-body p-4">
                <h4 class="text-center mb-4">Cadastro de Jogadores</h4>
                <form method="POST" action="/cadastroJogadores" id="jogadoresForm" novalidate>
                `; conteudo += `
                    <div class="mb-3">
                        <input type="text" class="form-control" id="nomeJogador" name="nomeJogador" placeholder="Nome do jogador" value="${nomeJogador || ""}">
                        ${erros.nomeJogador ? `<span class="text-danger">${erros.nomeJogador}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <input type="number" class="form-control" id="numeroCamisa" name="numeroCamisa" placeholder="Numero da camisa" value="${numeroCamisa || ""}">
                        ${erros.numeroCamisa ? `<span class="text-danger">${erros.numeroCamisa}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" placeholder="Ano de nascimento" value="${dataNascimento || ""}">
                        ${erros.dataNascimento ? `<span class="text-danger">${erros.dataNascimento}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <input type="number" class="form-control" id="altura" name="altura" placeholder="Altura em cm (ex: 185)" value="${altura || ""}">
                        ${erros.altura ? `<span class="text-danger">${erros.altura}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <select class="form-control" id="genero" name="genero">
                            <option value="">Selecione o gênero</option>
                            <option value="Masculino" ${genero === "Masculino" ? "selected" : ""}>Masculino</option>
                            <option value="Feminino" ${genero === "Feminino" ? "selected" : ""}>Feminino</option>
                            <option value="Outro" ${genero === "Outro" ? "selected" : ""}>Outro</option>
                        </select>
                        ${erros.genero ? `<span class="text-danger">${erros.genero}</span>` : ""}
                    </div>

                    <div class="mb-3">
                        <input type="text" class="form-control" id="posicao" name="posicao" placeholder="Posição (ex: Levantador, Oposto...)" value="${posicao || ""}">
                        ${erros.posicao ? `<span class="text-danger">${erros.posicao}</span>` : ""}
                    </div>
                    <div class="mb-3">
                        <select class="form-control" id="equipe" name="equipe" required>
                            <option value="">Selecione a equipe</option>
                            ${listaTimes
                                .filter(time => contarJogadoresPorEquipe(time.nomeEquipe) < 6)
                                .map(time => `
                                    <option value="${time.nomeEquipe}" ${nomeEquipeJogadores === time.nomeEquipe ? "selected" : ""}>
                                        ${time.nomeEquipe}
                                    </option>
                                `).join('')}
                        </select>
                        ${erros.nomeEquipe ? `<span class="text-danger">${erros.nomeEquipe}</span>` : ""}
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Cadastrar</button>
                        <a class="btn btn-secondary" href="/" style="margin-top: 5px">Voltar</a>
                    </div>
                     `;
                conteudo += `
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        `;
        resposta.send(conteudo);
    }
});

app.get("/listaJogadores", verificarAutenticacao, (requisicao, resposta) => {
    let conteudo=`
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Formulário</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
                </head>
                <body>
                    <div class="container w-75 mb-5 mt-5">
                        <table class="table table-dark table-striped-columns">
                            <thead>
                                <tr>
                                    <th scope="col">Jogador</th>
                                    <th scope="col">Numero da camisa</th>
                                    <th scope="col">Data de nascimento</th>
                                    <th scope="col">Altura</th>
                                    <th scope="col">Genero</th>
                                    <th scope="col">Posição</th>
                                    <th scope="col">Nome da equipe</th>
                                    <th><input type="text" id="buscar" placeholder="Filtrar nome da equipe"></th>
                                </tr>
                            </thead>
                            <tbody> `;
                            for(let i = 0; i < listaJogadores.length; i++) {
                                conteudo = conteudo + `
                                        <tr>
                                            <td>${listaJogadores[i].nomeJogador}</td>
                                            <td>${listaJogadores[i].numeroCamisa}</td>
                                            <td>${listaJogadores[i].dataNascimento}</td>
                                            <td>${listaJogadores[i].altura}</td>
                                            <td>${listaJogadores[i].genero}</td>
                                            <td>${listaJogadores[i].posicao}</td>
                                            <td>${listaJogadores[i].nomeEquipeJogadores}</td>
                                        </tr> ` 
                                    }
        conteudo = conteudo + ` </tbody>
                        </table>
                        <a class="btn btn-secondary" href="/cadastroJogadores">Retornar ao cadastro</a>
                    </div>
                    <script>
                        document.getElementById('buscar').addEventListener('keyup', function() {
                            let filtro = this.value.toLowerCase();
                            let linhas = document.querySelectorAll('tbody tr');

                            linhas.forEach(function(linha) {
                                let colunaEquipe = linha.children[6].textContent.toLowerCase(); // 7ª coluna (começa do zero)
                                if (colunaEquipe.includes(filtro)) {
                                    linha.style.display = '';
                                } else {
                                    linha.style.display = 'none';
                                }
                            });
                        });
                    </script>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </html>`
    resposta.send(conteudo);
    resposta.end();
})

app.get("/login", (requisicao, resposta) => {
    resposta.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <style>
                input:focus {
                box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
                }
                .card {
                border-radius: 1rem;
                transition: all 0.3s ease;
                }
                .btn-outline-light:hover {
                background-color: #ffffff10;
                }
            </style>
            </head>
            <body class="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
            <div class="card bg-secondary text-light shadow p-4 border-0" style="width: 100%; max-width: 360px;">
                <div class="text-center">
                <h2 class="mb-3">Login</h2>
                </div>
                <form action="/login" method="POST">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Usuário</label>
                    <input type="text" class="form-control border-0" id="usuario" name="usuario" placeholder="Digite seu usuário" required />
                </div>
                <div class="mb-3">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control border-0" id="senha" name="senha" placeholder="Digite sua senha" required />
                </div>
                <button type="submit" class="btn btn-outline-light w-100">Entrar</button>
                </form>
                <div class="text-center mt-3">
                <a href="#" class="text-light text-decoration-underline">Esqueceu a senha?</a>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `);
})

app.post("/login", (requisicao, resposta) => {
    const usuario = requisicao.body.usuario;    
    const senha = requisicao.body.senha;

    if(usuario == "admin" && senha == "123") {
        requisicao.session.logado = true;
        const dataHorasAtuais = new Date();
        resposta.cookie('ultimoLogin', dataHorasAtuais.toLocaleString());
        resposta.redirect("/");
    } else {
        resposta.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Login</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <style>
                input:focus {
                box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
                }
                .card {
                border-radius: 1rem;
                transition: all 0.3s ease;
                }
                .btn-outline-light:hover {
                background-color: #ffffff10;
                }
            </style>
            </head>
            <body class="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
            <div class="card bg-secondary text-light shadow p-4 border-0" style="width: 100%; max-width: 360px;">
                <div class="text-center">
                <h2 class="mb-3">Login</h2>
                </div>
                <form action="/login" method="POST">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Usuário</label>
                    <input type="text" class="form-control border-0" id="usuario" name="usuario" placeholder="Digite seu usuário" required />
                </div>
                <div class="mb-3">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control border-0" id="senha" name="senha" placeholder="Digite sua senha" required />
                </div>
                <button type="submit" class="btn btn-outline-light w-100">Entrar</button>
                </form>
                <div class="text-center mt-3">
                <a href="#" class="text-light text-decoration-underline">Esqueceu a senha?</a>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `);
    }
})

function verificarAutenticacao(requisicao, resposta, next) {
    if(requisicao.session.logado) {
        next();
    } else {
        resposta.redirect("/login");
    }
}

app.get("/logout", verificarAutenticacao, (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.redirect("/login");
})


app.listen(port, host, () => {
    console.log(`Servidor em execucao em http://${host}:${port}/`);
});